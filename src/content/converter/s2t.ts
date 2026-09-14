export type Dictionary = Record<string, string>;
export type S2TConverter = (text: string) => string;

interface IndexedWords {
  max: number;
  words: Map<string, string>;
}

/** Index the Simplified-to-Traditional dictionaries used by this content script. */
export const createS2TConverter = (sources: Dictionary[]): S2TConverter => {
  const characters = new Map<string, string>();
  const phrases = new Map<string, IndexedWords>();

  for (const source of sources) {
    for (const [simplified, traditional] of Object.entries(source)) {
      if (simplified.length === 1) {
        characters.set(simplified, traditional);
        continue;
      }

      const prefix = simplified.substring(0, 2);
      let indexed = phrases.get(prefix);
      if (!indexed) {
        indexed = { max: 0, words: new Map() };
        phrases.set(prefix, indexed);
      }
      indexed.max = Math.max(indexed.max, simplified.length);
      indexed.words.set(simplified, traditional);
    }
  }

  return (text: string): string => {
    if (typeof text !== 'string') return '';

    let converted = '';
    for (let pointer = 0; pointer < text.length; pointer++) {
      const indexed = phrases.get(text.substring(pointer, pointer + 2));
      let found = false;

      if (indexed) {
        for (let size = Math.min(text.length - pointer, indexed.max); size > 1; size--) {
          const word = text.substring(pointer, pointer + size);
          const replacement = indexed.words.get(word);
          if (replacement !== undefined) {
            converted += replacement;
            pointer += size - 1;
            found = true;
            break;
          }
        }
      }

      if (!found) converted += characters.get(text[pointer]) || text[pointer];
    }
    return converted;
  };
};
