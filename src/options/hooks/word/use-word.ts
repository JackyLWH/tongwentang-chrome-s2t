import { useEffect, useState } from 'react';
import { getDefaultPref } from '../../../preference/default';
import { safeUpgradePref } from '../../../preference/upgrade';
import type { PrefWord } from '../../../preference/types/v3';
import { getStorage, listenStorage } from '../../../service/storage/storage';

export const useWord = () => {
  const [word, setWord] = useState<PrefWord>(() => getDefaultPref().word);

  useEffect(() => {
    let active = true;
    let changed = false;
    const stopListening = listenStorage(
      ({ word }) => {
        if (!word?.newValue) return;
        changed = true;
        setWord(word.newValue as PrefWord);
      },
      { keys: ['word'], areaName: ['local'] },
    );
    void getStorage()
      .then(pref => {
        if (active && !changed) setWord(safeUpgradePref(pref).word);
      })
      .catch(console.error);

    return () => {
      active = false;
      stopListening();
    };
  }, []);

  return { word, setWord };
};
