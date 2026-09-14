import { loadDictionary } from './load-dictionary';
import { createS2TConverter, type Dictionary, type S2TConverter } from './s2t';

const asRecord = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

export const createContentConverter = (value: unknown): S2TConverter => {
  const word = asRecord(value);
  const defaults = asRecord(word.default);
  const custom = Object.fromEntries(
    Object.entries(asRecord(word.custom)).filter(
      ([simplified, traditional]) =>
        simplified.trim().length > 0 && typeof traditional === 'string' && traditional.length > 0,
    ),
  ) as Dictionary;
  const sources: Dictionary[] = [
    defaults.char === false ? {} : loadDictionary('s2t-char.min.json'),
    defaults.phrase === false ? {} : loadDictionary('s2t-phrase.min.json'),
    custom,
  ];
  return createS2TConverter(sources);
};
