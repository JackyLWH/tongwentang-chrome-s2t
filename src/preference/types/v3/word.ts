export interface PrefWord {
  default: { char: boolean; phrase: boolean };
  custom: Record<string, string>;
}

export type PrefWordDefault = PrefWord['default'];
