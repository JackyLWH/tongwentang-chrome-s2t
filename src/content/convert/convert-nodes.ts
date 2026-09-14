import { walkNode } from 'tongwen-core/walker';
import { observeMutationTargets, registerShadowRoots, type CtState } from '../state';
import { updateNodes } from './update-nodes';

type SConvertNode = (state: CtState, nodes: Node[]) => void;

// The walker rejects script and editable elements when traversing a document,
// but a mutation can hand it a text node directly, bypassing those ancestors.
const isConvertibleRoot = (node: Node): boolean => {
  if (node.nodeType !== Node.TEXT_NODE) return true;
  const parent = node.parentElement;
  return !parent?.isContentEditable && !parent?.closest('script, style, link, meta, frame, iframe, input, textarea');
};

export const convertNode: SConvertNode = (state, nodes) => {
  if (!state.enabled) return;
  const parsedNodes = registerShadowRoots(state, nodes.filter(isConvertibleRoot)).flatMap(node => walkNode(node));
  if (parsedNodes.length === 0) return;

  const texts = parsedNodes.map(({ text }) => state.converter(text));
  if (texts.every((text, index) => text === parsedNodes[index].text)) return;
  state.mutationObserver?.disconnect();
  try {
    updateNodes(parsedNodes, texts, state.conversionHistory);
  } finally {
    observeMutationTargets(state);
  }
};
