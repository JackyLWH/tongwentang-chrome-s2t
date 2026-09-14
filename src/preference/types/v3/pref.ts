import type { PrefGeneral, PrefWord } from '.';

export interface PrefV3 {
  version: 3;
  meta: { update: number };
  general: PrefGeneral;
  word: PrefWord;
}
