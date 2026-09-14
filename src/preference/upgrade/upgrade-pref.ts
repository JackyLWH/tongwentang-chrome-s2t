import { v3Schema } from '../schema/v3';
import type { Pref } from '../types/latest';

type RecordLike = Record<string, unknown>;
const asRecord = (value: unknown): RecordLike =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as RecordLike) : {};

/** Keep only simplified-to-traditional settings from old Chrome preferences. */
export const normalizePref = (value: unknown): RecordLike => {
  const source = asRecord(value);
  const oldGeneral = asRecord(source.general);
  const oldWord = asRecord(source.word);
  const oldDefault = asRecord(oldWord.default);
  const oldCustom = asRecord(oldWord.custom);
  const isV1 = Number.parseInt(String(source.version)) === 1;
  const isV2 = source.version === 2;

  return {
    version: 3,
    meta: source.meta,
    general: isV1 ? { enabled: true } : oldGeneral,
    word: {
      default: isV1 ? {} : isV2 ? oldDefault.s2t : oldDefault,
      custom: isV1 ? asRecord(source.userPhrase).trad : isV2 ? oldCustom.s2t : oldCustom,
    },
  };
};

export const safeUpgradePref = (value: unknown): Pref => v3Schema(normalizePref(value)).value();
