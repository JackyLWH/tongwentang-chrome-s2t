import type { Pref } from '../../preference/types/latest';
import { setBadge } from '../../service/browser-action/set-badge';
import { getStorage, initialStorage, setStorage, type StorageChanges } from '../../service/storage/storage';

let state: Pref | undefined;
let queue: Promise<Pref> | null = null;

export const bgInitialPref = (): Promise<Pref> => {
  if (queue) return queue;

  queue = initialStorage()
    .then(async pref => {
      await setBadge(pref.general);
      state = pref;
      return pref;
    })
    .catch(error => {
      queue = null;
      throw error;
    });
  return queue;
};

export const bgGetPref = async () => {
  return state ? Promise.resolve(state) : queue ? queue : (queue = getStorage().then(p => (state = p)));
};

export const bgSetPref = async (...args: Parameters<typeof setStorage>) => {
  return setStorage(...args).then(async () => (queue = getStorage().then(p => (state = p))));
};

export const bgHandlePrefUpdate = (changes: StorageChanges): void => {
  const general = changes.general?.newValue as Pref['general'] | undefined;
  if (general) {
    if (state) state.general = general;
    void setBadge(general).catch(console.error);
  }

  const word = changes.word?.newValue as Pref['word'] | undefined;
  if (word && state) state.word = word;
};
