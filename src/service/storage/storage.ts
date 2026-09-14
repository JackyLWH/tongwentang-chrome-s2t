import { getDefaultPref } from '../../preference/default';
import type { Pref, PrefKeys } from '../../preference/types/latest';
import { safeUpgradePref, validatePref } from '../../preference/upgrade';
import { browser } from '../browser';

type StorageAreaName = 'local' | 'sync' | 'managed' | 'session';
export type StorageChanges = Partial<{ [P in PrefKeys]: { oldValue?: unknown; newValue?: unknown } }>;
type StorageListener<A extends StorageAreaName> = (store: StorageChanges, areaName: A) => void;

const updatePrefTime = (pref: Partial<Pref>): Partial<Pref> => ({ ...pref, meta: { update: Date.now() } });

const hasOnlyKeys = (value: unknown, allowed: string[]): boolean =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).every(key => allowed.includes(key));

const isCurrentShape = (stored: Record<string, unknown>): boolean =>
  hasOnlyKeys(stored, ['version', 'meta', 'general', 'word']) &&
  hasOnlyKeys(stored.meta, ['update']) &&
  hasOnlyKeys(stored.general, ['enabled']) &&
  hasOnlyKeys(stored.word, ['default', 'custom']) &&
  hasOnlyKeys((stored.word as Record<string, unknown>).default, ['char', 'phrase']);

export const getStorage = async (): Promise<Pref> => browser.storage.local.get() as unknown as Promise<Pref>;

export const setStorage = async (data: Partial<Pref>): Promise<void> => browser.storage.local.set(updatePrefTime(data));

export const resetStorage = async (pref: Pref = getDefaultPref()): Promise<void> => {
  await browser.storage.local.clear();
  await browser.storage.local.set(pref);
};

export const listenStorage = <PKey extends PrefKeys, AreaName extends StorageAreaName>(
  listener: StorageListener<AreaName>,
  opt: Partial<{ keys: PKey[]; areaName: AreaName[] }> = {},
): (() => void) => {
  const wrapper = (changes: StorageChanges, areaName: StorageAreaName) => {
    if (opt.areaName && !opt.areaName.includes(areaName as AreaName)) return;
    const keys = opt.keys;
    if (keys && !Object.keys(changes).some(key => keys.includes(key as PKey))) return;
    listener(changes, areaName as AreaName);
  };

  browser.storage.onChanged.addListener(wrapper as never);
  return () => {
    browser.storage.onChanged.removeListener(wrapper as never);
  };
};

export const initialStorage = async (): Promise<Pref> => {
  const stored = await browser.storage.local.get();
  const pref = safeUpgradePref(stored);
  if (stored.version !== 3 || validatePref(stored).invalid || !isCurrentShape(stored)) {
    await browser.storage.local.clear();
    await browser.storage.local.set(pref);
  }
  return pref;
};
