import type { ParsedResult } from 'tongwen-core/walker';

interface ConversionChange {
  original: string;
  converted: string;
}

export class ConversionHistory {
  private changes = new WeakMap<Node, Map<string | null, ConversionChange>>();
  private trackedNodes = new WeakSet<Node>();
  private readonly nodes = new Set<WeakRef<Node>>();
  private readonly finalizer = new FinalizationRegistry<WeakRef<Node>>(ref => this.nodes.delete(ref));

  record(parsed: ParsedResult, converted: string): void {
    const node = parsed.node;
    let nodeChanges = this.changes.get(node);
    if (!nodeChanges) {
      nodeChanges = new Map();
      this.changes.set(node, nodeChanges);
    }

    const key = parsed.type === 'TEXT' ? null : parsed.attr;
    const previous = nodeChanges.get(key);
    nodeChanges.set(key, {
      original: previous?.converted === parsed.text ? previous.original : parsed.text,
      converted,
    });
    if (this.trackedNodes.has(node)) return;

    const ref = new WeakRef(node);
    this.trackedNodes.add(node);
    this.nodes.add(ref);
    this.finalizer.register(node, ref, ref);
  }

  invalidate(mutations: MutationRecord[]): void {
    mutations.forEach(mutation => {
      const key = mutation.type === 'characterData' ? null : mutation.attributeName;
      if (mutation.type !== 'characterData' && mutation.type !== 'attributes') return;

      const nodeChanges = this.changes.get(mutation.target);
      if (!nodeChanges) return;
      nodeChanges.delete(key);
      if (nodeChanges.size === 0) this.changes.delete(mutation.target);
    });
  }

  restore(): void {
    this.nodes.forEach(ref => {
      const node = ref.deref();
      const nodeChanges = node && this.changes.get(node);
      if (node?.isConnected && nodeChanges) {
        nodeChanges.forEach(({ original, converted }, attr) => {
          if (attr === null) {
            if (node.nodeValue === converted) node.nodeValue = original;
          } else if (node instanceof Element && node.getAttribute(attr) === converted) {
            node.setAttribute(attr, original);
          }
        });
      }
      this.finalizer.unregister(ref);
    });

    this.nodes.clear();
    this.changes = new WeakMap();
    this.trackedNodes = new WeakSet();
  }
}
