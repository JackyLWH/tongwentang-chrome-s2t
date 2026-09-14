import { browser } from '../../service/browser';
import type { Dictionary } from './s2t';

type DictionaryFile = 's2t-char.min.json' | 's2t-phrase.min.json';

const cache = new Map<DictionaryFile, Dictionary>();

export const loadDictionary = (file: DictionaryFile): Dictionary => {
  const cached = cache.get(file);
  if (cached) return cached;

  const request = new XMLHttpRequest();
  request.open('GET', browser.runtime.getURL(`dictionaries/${file}`), false);
  request.send();
  if (request.status !== 200) throw new Error(`Unable to load dictionary ${file}: HTTP ${request.status}`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(request.responseText);
  } catch (cause) {
    throw new Error(`Invalid JSON in dictionary ${file}`, { cause });
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Dictionary ${file} must be a JSON object`);
  }
  if (Object.entries(parsed).some(([key, value]) => !key || typeof value !== 'string')) {
    throw new Error(`Dictionary ${file} must contain non-empty keys and string values`);
  }

  const dictionary = parsed as Dictionary;
  cache.set(file, dictionary);
  return dictionary;
};
