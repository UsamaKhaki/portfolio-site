export type Vec3 = [number, number, number];

export type GraphNode = {
  id: string;
  kind: "project" | "tech";
  position: Vec3;
};

export type StackGraph = {
  nodes: GraphNode[];
  edges: [number, number][];
  neighbours: number[][];
};

type GraphInput = { title: string; tags: string[] }[];

type LayoutOptions = {
  /** The layout is scaled so the farthest node sits at this distance from the centre. */
  radius?: number;
  iterations?: number;
  seed?: number;
};

// "Supabase (RLS)" and "Supabase" are the same technology on the graph.
export function normalizeTag(tag: string): string {
  return tag.replace(/\s*\(.*\)$/, "").trim();
}

// mulberry32: a tiny seeded PRNG so the layout is identical on every load and in tests.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a bipartite graph of projects and the technologies they use, laid out in 3D
 * with a small force simulation: every node repels every other, edges act as springs,
 * and a weak pull keeps the whole graph centred.
 */
export function buildStackGraph(
  projects: GraphInput,
  { radius = 1.3, iterations = 400, seed = 7 }: LayoutOptions = {},
): StackGraph {
  const random = seededRandom(seed);
  const nodes: GraphNode[] = [];
  const indexById = new Map<string, number>();
  const edges: [number, number][] = [];

  const addNode = (id: string, kind: GraphNode["kind"]) => {
    const existing = indexById.get(id);
    if (existing !== undefined) return existing;
    indexById.set(id, nodes.length);
    nodes.push({
      id,
      kind,
      position: [random() * 4 - 2, random() * 4 - 2, random() * 4 - 2],
    });
    return nodes.length - 1;
  };

  for (const project of projects) {
    const projectIndex = addNode(project.title, "project");
    for (const tag of new Set(project.tags.map(normalizeTag))) {
      edges.push([projectIndex, addNode(tag, "tech")]);
    }
  }

  const positions = nodes.map((node) => node.position);
  const velocities: Vec3[] = nodes.map(() => [0, 0, 0]);

  for (let step = 0; step < iterations; step++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const d = sub(positions[i], positions[j]);
        const push = scale(d, 0.06 / Math.max(lengthSq(d), 0.01));
        addTo(velocities[i], push);
        addTo(velocities[j], scale(push, -1));
      }
    }
    for (const [a, b] of edges) {
      const d = sub(positions[b], positions[a]);
      const length = Math.sqrt(lengthSq(d)) || 1;
      const pull = scale(d, ((length - 0.8) * 0.03) / length);
      addTo(velocities[a], pull);
      addTo(velocities[b], scale(pull, -1));
    }
    for (let i = 0; i < positions.length; i++) {
      addTo(velocities[i], scale(positions[i], -0.004));
      addTo(positions[i], velocities[i]);
      velocities[i] = scale(velocities[i], 0.85);
    }
  }

  const centre = scale(
    positions.reduce<Vec3>(
      (sum, p) => [sum[0] + p[0], sum[1] + p[1], sum[2] + p[2]],
      [0, 0, 0],
    ),
    1 / Math.max(positions.length, 1),
  );
  const centred = alignLongestAxisToX(positions.map((p) => sub(p, centre)));
  const farthest = Math.max(
    ...centred.map((p) => Math.sqrt(lengthSq(p))),
    1e-6,
  );
  centred.forEach((p, i) => {
    nodes[i].position = scale(p, radius / farthest);
  });

  const neighbours = nodes.map(() => [] as number[]);
  for (const [a, b] of edges) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }

  return { nodes, edges, neighbours };
}

// Rotates centred points so their main direction of spread (the first principal component,
// found by power iteration on the covariance matrix) lies along x. The graph spins around y,
// so this keeps the long side horizontal and the graph fits a wide box.
function alignLongestAxisToX(points: Vec3[]): Vec3[] {
  const cov = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const p of points) {
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) cov[r * 3 + c] += p[r] * p[c];
  }
  let axis: Vec3 = [1, 1, 1];
  for (let i = 0; i < 50; i++) {
    const next: Vec3 = [
      cov[0] * axis[0] + cov[1] * axis[1] + cov[2] * axis[2],
      cov[3] * axis[0] + cov[4] * axis[1] + cov[5] * axis[2],
      cov[6] * axis[0] + cov[7] * axis[1] + cov[8] * axis[2],
    ];
    const length = Math.sqrt(lengthSq(next));
    if (length < 1e-9) return points;
    axis = scale(next, 1 / length);
  }
  const helper: Vec3 = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [0, 0, 1];
  const side = normalize(cross(axis, helper));
  const up = cross(side, axis);
  return points.map((p) => [dot(p, axis), dot(p, up), dot(p, side)]);
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(a: Vec3): Vec3 {
  return scale(a, 1 / (Math.sqrt(lengthSq(a)) || 1));
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function lengthSq(a: Vec3): number {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}

function addTo(target: Vec3, d: Vec3) {
  target[0] += d[0];
  target[1] += d[1];
  target[2] += d[2];
}
