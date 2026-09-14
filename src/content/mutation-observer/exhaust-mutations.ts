import { convertNode } from '../convert';
import type { CtState } from '../state';
import { parseMutation } from './parse-mutation';

export type ExhaustMutations = (s: CtState, m: MutationRecord[]) => void;

const getUniqueRootNodes = (mutations: MutationRecord[]): Node[] => {
  const nodes = Array.from(new Set(mutations.flatMap(parseMutation))).filter(node => node.isConnected);
  const nodeSet = new Set(nodes);
  return nodes.filter(node => {
    for (let parent = node.parentNode; parent != null; parent = parent.parentNode) {
      if (nodeSet.has(parent)) return false;
    }
    return true;
  });
};

export const exhaustMutations: ExhaustMutations = (state, mutations) => {
  if (!state.enabled) return;
  const nodes = getUniqueRootNodes(mutations);
  if (nodes.length === 0) return;

  convertNode(state, nodes);
};
