import { walkNode } from 'tongwen-core/walker';
import { observeMutationTargets, registerShadowRoots, type CtState } from '../state';
import { updateNodes } from './update-nodes';

type SConvertNode = (state: CtState, nodes: Node[]) => void;

export const convertNode: SConvertNode = (state, nodes) => {
  if (!state.enabled) return;
  const parsedNodes = registerShadowRoots(state, nodes).flatMap(node => walkNode(node));
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
