import type { ParsedResult } from 'tongwen-core/walker';
import type { ConversionHistory } from './conversion-history';

const updateNode = (parsed: ParsedResult, text: string, history: ConversionHistory) => {
  if (text == null || !parsed.node.isConnected) return;

  switch (parsed.type) {
    case 'TEXT':
      if (parsed.node.nodeValue === parsed.text && parsed.node.nodeValue !== text) {
        parsed.node.nodeValue = text;
        history.record(parsed, text);
      }
      break;
    case 'ELEMENT':
      if (parsed.node.getAttribute(parsed.attr) === parsed.text && parsed.text !== text) {
        parsed.node.setAttribute(parsed.attr, text);
        history.record(parsed, text);
      }
  }
};

export const updateNodes = (parseds: ParsedResult[], texts: string[], history: ConversionHistory): void => {
  parseds.forEach((parsed, index) => updateNode(parsed, texts[index], history));
};
