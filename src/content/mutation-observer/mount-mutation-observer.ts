import { observeMutationTargets, pruneDisconnectedShadowRoots, type CtState } from '../state';
import { exhaustMutations } from './exhaust-mutations';

type ObserverFn = (s: CtState) => (m: MutationRecord[]) => void;
const observerFn: ObserverFn = state => mutations => {
  state.conversionHistory.invalidate(mutations);
  pruneDisconnectedShadowRoots(state, mutations);
  exhaustMutations(state, mutations);
};

export const setConversionObserver = (state: CtState, enabled: boolean): void => {
  if (enabled) {
    state.mutationObserver ??= new MutationObserver(observerFn(state));
    observeMutationTargets(state);
    return;
  }

  if (state.mutationObserver) {
    state.conversionHistory.invalidate(state.mutationObserver.takeRecords());
    state.mutationObserver.disconnect();
  }
  state.mutationObserver = undefined;
};
