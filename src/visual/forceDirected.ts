const EPSILON = 1e-6;

export interface ForceDirectedNodeInput {
  id: string;
  x?: number;
  y?: number;
  fixed?: boolean;
}

export interface ForceDirectedNode extends ForceDirectedNodeInput {
  x: number;
  y: number;
}

export interface ForceDirectedEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface ForceDirectedLayoutOptions {
  nodes: ReadonlyArray<ForceDirectedNodeInput>;
  edges: ReadonlyArray<ForceDirectedEdge>;
  width?: number;
  height?: number;
  iterations?: number;
  repulsion?: number;
  attraction?: number;
  damping?: number;
  gravity?: number;
  initialTemperature?: number;
  random?: () => number;
}

export interface ForceDirectedLayoutResult {
  nodes: ForceDirectedNode[];
}

export function computeForceDirectedLayout(options: ForceDirectedLayoutOptions): ForceDirectedLayoutResult {
  validateOptions(options);
  const random = options.random ?? Math.random;
  const width = options.width ?? 1;
  const height = options.height ?? 1;
  const iterations = Math.max(1, Math.floor(options.iterations ?? 100));
  const repulsion = options.repulsion ?? 600;
  const attraction = options.attraction ?? 0.1;
  const damping = clamp(options.damping ?? 0.9, 0.01, 1);
  const gravity = options.gravity ?? 0.1;
  const temperatureStart = options.initialTemperature ?? Math.min(width, height) / 10;

  const nodeCount = options.nodes.length;
  const area = Math.max(width * height, EPSILON);
  const optimalDistance = Math.sqrt(area / Math.max(nodeCount, 1));

  const nodes: ForceDirectedNode[] = options.nodes.map((node) => ({
    id: node.id,
    fixed: node.fixed,
    x: node.x ?? random() * width,
    y: node.y ?? random() * height,
  }));

  const nodeIndex = new Map<string, number>();
  nodes.forEach((node, index) => {
    if (nodeIndex.has(node.id)) {
      throw new Error(`Duplicate node id: ${node.id}`);
    }
    nodeIndex.set(node.id, index);
  });

  const edges = options.edges.map((edge) => {
    if (!nodeIndex.has(edge.source)) {
      throw new Error(`Edge references unknown node: ${edge.source}`);
    }
    if (!nodeIndex.has(edge.target)) {
      throw new Error(`Edge references unknown node: ${edge.target}`);
    }
    return {
      source: nodeIndex.get(edge.source)!,
      target: nodeIndex.get(edge.target)!,
      weight: edge.weight ?? 1,
    };
  });

  const displacements = new Array(nodeCount).fill(0).map(() => ({ x: 0, y: 0 }));
  let temperature = temperatureStart;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let i = 0; i < nodeCount; i += 1) {
      displacements[i].x = 0;
      displacements[i].y = 0;
    }

    // Repulsive forces
    for (let i = 0; i < nodeCount; i += 1) {
      for (let j = i + 1; j < nodeCount; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy) + EPSILON;
        const force = (repulsion * repulsion) / distance;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        displacements[i].x += fx;
        displacements[i].y += fy;
        displacements[j].x -= fx;
        displacements[j].y -= fy;
      }
    }

    // Attractive forces along edges
    for (const edge of edges) {
      const source = nodes[edge.source];
      const target = nodes[edge.target];
      const dx = source.x - target.x;
      const dy = source.y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy) + EPSILON;
      const force = ((distance * distance) / optimalDistance) * (edge.weight ?? 1) * attraction;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      displacements[edge.source].x -= fx;
      displacements[edge.source].y -= fy;
      displacements[edge.target].x += fx;
      displacements[edge.target].y += fy;
    }

    // Gravity towards center
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < nodeCount; i += 1) {
      const node = nodes[i];
      const dx = node.x - centerX;
      const dy = node.y - centerY;
      displacements[i].x -= dx * gravity;
      displacements[i].y -= dy * gravity;
    }

    // Update positions
    for (let i = 0; i < nodeCount; i += 1) {
      const node = nodes[i];
      if (node.fixed) {
        continue;
      }
      const disp = displacements[i];
      const dispLength = Math.sqrt(disp.x * disp.x + disp.y * disp.y);
      if (dispLength > EPSILON) {
        const limited = Math.min(dispLength, temperature);
        node.x += (disp.x / dispLength) * limited;
        node.y += (disp.y / dispLength) * limited;
      }
      node.x = clamp(node.x, 0, width);
      node.y = clamp(node.y, 0, height);
    }

    temperature *= damping;
    if (temperature < EPSILON) {
      break;
    }
  }

  return { nodes };
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function validateOptions(options: ForceDirectedLayoutOptions): void {
  if (!Array.isArray(options.nodes) || options.nodes.length === 0) {
    throw new Error('nodes must contain at least one entry.');
  }
  if (!Array.isArray(options.edges)) {
    throw new Error('edges must be an array.');
  }
  if (options.width !== undefined && (!Number.isFinite(options.width) || options.width <= 0)) {
    throw new Error('width must be a positive number when provided.');
  }
  if (options.height !== undefined && (!Number.isFinite(options.height) || options.height <= 0)) {
    throw new Error('height must be a positive number when provided.');
  }
  if (options.iterations !== undefined && (!Number.isFinite(options.iterations) || options.iterations <= 0)) {
    throw new Error('iterations must be a positive number when provided.');
  }
  if (options.repulsion !== undefined && options.repulsion <= 0) {
    throw new Error('repulsion must be positive when provided.');
  }
  if (options.attraction !== undefined && options.attraction <= 0) {
    throw new Error('attraction must be positive when provided.');
  }
  if (options.damping !== undefined && (options.damping <= 0 || options.damping > 1)) {
    throw new Error('damping must be between 0 and 1 when provided.');
  }
  if (options.gravity !== undefined && options.gravity < 0) {
    throw new Error('gravity must be non-negative when provided.');
  }
  if (options.initialTemperature !== undefined && options.initialTemperature <= 0) {
    throw new Error('initialTemperature must be positive when provided.');
  }
}
