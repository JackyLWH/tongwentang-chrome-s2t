import { convertNode } from './convert';
import { setConversionObserver } from './mutation-observer/mount-mutation-observer';
import type { CtState } from './state';
import { createCtState } from './state';
import { createContentConverter } from './converter';
import type { Pref } from '../preference/types/latest';
import { listenStorage, type StorageChanges } from '../service/storage/storage';

const applyStorageChanges = (state: CtState, changes: StorageChanges, initializing = false): void => {
  const word = changes.word?.newValue as Pref['word'] | undefined;
  if (word) state.word = word;

  const general = changes.general?.newValue as Pref['general'] | undefined;
  const wasEnabled = state.enabled;
  if (general && typeof general.enabled === 'boolean') state.enabled = general.enabled;
  if (initializing) return;

  if (state.enabled && (word || !wasEnabled)) state.converter = createContentConverter(state.word);
  if (!general || typeof general.enabled !== 'boolean') return;

  setConversionObserver(state, state.enabled);
  if (wasEnabled && !state.enabled) state.conversionHistory.restore();
  if (!wasEnabled && state.enabled) convertNode(state, [document]);
};

(async function main() {
  let state: CtState | undefined = undefined;
  const pendingChanges: StorageChanges[] = [];

  listenStorage(
    changes => {
      if (state) applyStorageChanges(state, changes);
      else pendingChanges.push(changes);
    },
    { keys: ['general', 'word'], areaName: ['local'] },
  );

  state = await createCtState();
  pendingChanges.forEach(changes => applyStorageChanges(state, changes, true));
  if (state.enabled) state.converter = createContentConverter(state.word);
  setConversionObserver(state, state.enabled);
  if (state.enabled) convertNode(state, [document]);
})();
