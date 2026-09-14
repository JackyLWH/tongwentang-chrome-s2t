import { TARGET_NODE_ATTRIBUTES } from 'tongwen-core/walker';
import { getStorage } from '../service/storage/storage';
import type { S2TConverter } from './converter/s2t';
import { ConversionHistory } from './convert/conversion-history';

const mutationOpt: MutationObserverInit = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
  attributeFilter: TARGET_NODE_ATTRIBUTES as string[],
};

type QueryableNode = Node & Pick<ParentNode, 'querySelectorAll'>;

export interface CtState {
  enabled: boolean;
  word: unknown;
  converter: S2TConverter;
  conversionHistory: ConversionHistory;
  mutationOpt: MutationObserverInit;
  mutationObserver?: MutationObserver;
  shadowRoots: Set<ShadowRoot>;
}

const getShadowRoots = (node: Node): ShadowRoot[] => {
  const shadowRoots: ShadowRoot[] = [];
  const isQueryableNode = (target: Node): target is QueryableNode => 'querySelectorAll' in target;
  const collect = (element: Element) => {
    if (element.shadowRoot != null) {
      shadowRoots.push(element.shadowRoot, ...getShadowRoots(element.shadowRoot));
    }
  };

  node instanceof Element && collect(node);
  isQueryableNode(node) && node.querySelectorAll('*').forEach(collect);

  return shadowRoots;
};

export const registerShadowRoots = (state: CtState, nodes: Node[]): Node[] => {
  const knownNodes = new Set<Node>(nodes);

  nodes.flatMap(getShadowRoots).forEach(shadowRoot => {
    knownNodes.add(shadowRoot);

    if (!state.shadowRoots.has(shadowRoot)) {
      state.shadowRoots.add(shadowRoot);
      state.mutationObserver?.observe(shadowRoot, state.mutationOpt);
    }
  });

  return Array.from(knownNodes);
};

export const observeMutationTargets = (state: CtState): void => {
  state.mutationObserver?.observe(document, state.mutationOpt);

  state.shadowRoots.forEach(shadowRoot => {
    if (!shadowRoot.host.isConnected) {
      state.shadowRoots.delete(shadowRoot);
      return;
    }

    state.mutationObserver?.observe(shadowRoot, state.mutationOpt);
  });
};

export const pruneDisconnectedShadowRoots = (state: CtState, mutations: MutationRecord[]): void => {
  if (!mutations.some(mutation => mutation.type === 'childList' && mutation.removedNodes.length > 0)) return;

  for (const shadowRoot of state.shadowRoots) {
    if (shadowRoot.host.isConnected) continue;
    state.mutationObserver?.disconnect();
    observeMutationTargets(state);
    return;
  }
};

export async function createCtState(): Promise<CtState> {
  return getStorage().then(({ general, word }) => {
    return {
      enabled: typeof general?.enabled === 'boolean' ? general.enabled : true,
      word,
      converter: text => text,
      conversionHistory: new ConversionHistory(),
      mutationOpt,
      shadowRoots: new Set<ShadowRoot>(),
    };
  });
}
