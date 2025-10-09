export interface FlowEdge {
  source: string;
  target: string;
  capacity: number;
}

export interface MaxFlowOptions {
  nodes: ReadonlyArray<string>;
  edges: ReadonlyArray<FlowEdge>;
  source: string;
  sink: string;
}

export interface MaxFlowResult {
  maxFlow: number;
  flows: Array<{ source: string; target: string; flow: number }>;
}

interface EdgeInternal {
  to: number;
  rev: number;
  capacity: number;
}

export function computeMaximumFlowDinic(options: MaxFlowOptions): MaxFlowResult {
  validateOptions(options);
  const indexByNode = new Map<string, number>();
  options.nodes.forEach((id, idx) => indexByNode.set(id, idx));
  const n = options.nodes.length;
  const graph: EdgeInternal[][] = Array.from({ length: n }, () => []);

  function addEdge(uIdx: number, vIdx: number, cap: number): void {
    const a: EdgeInternal = { to: vIdx, rev: graph[vIdx].length, capacity: cap };
    const b: EdgeInternal = { to: uIdx, rev: graph[uIdx].length, capacity: 0 };
    graph[uIdx].push(a);
    graph[vIdx].push(b);
  }

  for (const e of options.edges) {
    const u = indexByNode.get(e.source)!;
    const v = indexByNode.get(e.target)!;
    addEdge(u, v, e.capacity);
  }

  const s = indexByNode.get(options.source)!;
  const t = indexByNode.get(options.sink)!;

  let maxFlow = 0;
  const level = new Array<number>(n).fill(-1);
  const it = new Array<number>(n).fill(0);

  function bfs(): boolean {
    level.fill(-1);
    const queue: number[] = [s];
    level[s] = 0;
    for (let qi = 0; qi < queue.length; qi += 1) {
      const v = queue[qi];
      for (const e of graph[v]) {
        if (e.capacity > 0 && level[e.to] < 0) {
          level[e.to] = level[v] + 1;
          queue.push(e.to);
        }
      }
    }
    return level[t] >= 0;
  }

  function dfs(v: number, f: number): number {
    if (v === t) return f;
    for (let i = it[v]; i < graph[v].length; i += 1) {
      it[v] = i;
      const e = graph[v][i];
      if (e.capacity <= 0 || level[v] + 1 !== level[e.to]) continue;
      const d = dfs(e.to, Math.min(f, e.capacity));
      if (d > 0) {
        e.capacity -= d;
        graph[e.to][e.rev].capacity += d;
        return d;
      }
    }
    return 0;
  }

  while (bfs()) {
    it.fill(0);
    let flow;
    // eslint-disable-next-line no-cond-assign
    while ((flow = dfs(s, Number.POSITIVE_INFINITY)) > 0) {
      maxFlow += flow;
    }
  }

  // Extract flows on original directed edges
  const flows: Array<{ source: string; target: string; flow: number }> = [];
  for (const e of options.edges) {
    const u = indexByNode.get(e.source)!;
    const v = indexByNode.get(e.target)!;
    // Residual capacity back edge holds the flow pushed
    let pushed = 0;
    for (const edge of graph[v]) {
      if (edge.to === u) {
        pushed += edge.capacity; // this is the accumulated back capacity
      }
    }
    const flowValue = Math.max(0, pushed);
    flows.push({ source: e.source, target: e.target, flow: flowValue });
  }

  return { maxFlow, flows };
}

function validateOptions(options: MaxFlowOptions): void {
  if (!Array.isArray(options.nodes) || options.nodes.length === 0) {
    throw new Error('nodes must contain at least one node.');
  }
  const seen = new Set(options.nodes);
  if (!seen.has(options.source) || !seen.has(options.sink)) {
    throw new Error('source and sink must be present in nodes.');
  }
  for (const { source, target, capacity } of options.edges) {
    if (!seen.has(source) || !seen.has(target)) {
      throw new Error(`Edge references unknown node: ${source}-${target}`);
    }
    if (capacity < 0 || !Number.isFinite(capacity)) {
      throw new Error('capacity must be a finite non-negative number.');
    }
  }
}

