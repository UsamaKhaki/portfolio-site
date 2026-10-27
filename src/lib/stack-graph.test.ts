import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { buildStackGraph, normalizeTag } from "./stack-graph";

const sample = [
  { title: "Alpha", tags: ["React", "Next.js", "Supabase (RLS)"] },
  { title: "Beta", tags: ["React", "Supabase", "Laravel"] },
];

describe("normalizeTag", () => {
  it("drops a trailing qualifier in brackets", () => {
    expect(normalizeTag("Supabase (RLS)")).toBe("Supabase");
    expect(normalizeTag("Claude / OpenAI")).toBe("Claude / OpenAI");
  });
});

describe("buildStackGraph", () => {
  it("creates one node per project and per distinct technology", () => {
    const graph = buildStackGraph(sample);

    expect(
      graph.nodes.filter((n) => n.kind === "project").map((n) => n.id),
    ).toEqual(["Alpha", "Beta"]);
    expect(
      graph.nodes
        .filter((n) => n.kind === "tech")
        .map((n) => n.id)
        .sort(),
    ).toEqual(["Laravel", "Next.js", "React", "Supabase"]);
    expect(graph.edges).toHaveLength(6);
  });

  it("links each project to exactly its technologies", () => {
    const graph = buildStackGraph(sample);
    const idOf = (i: number) => graph.nodes[i].id;
    const beta = graph.nodes.findIndex((n) => n.id === "Beta");
    const react = graph.nodes.findIndex((n) => n.id === "React");

    expect(graph.neighbours[beta].map(idOf).sort()).toEqual([
      "Laravel",
      "React",
      "Supabase",
    ]);
    expect(graph.neighbours[react].map(idOf).sort()).toEqual(["Alpha", "Beta"]);
  });

  it("lays out the same graph on every run", () => {
    const first = buildStackGraph(projects).nodes.map((n) => n.position);
    const second = buildStackGraph(projects).nodes.map((n) => n.position);

    expect(second).toEqual(first);
  });

  it("scales the layout so the farthest node sits exactly on the radius", () => {
    const graph = buildStackGraph(projects, { radius: 2 });
    const distances = graph.nodes.map((n) => Math.hypot(...n.position));

    expect(Math.max(...distances)).toBeCloseTo(2, 6);
    for (const d of distances) expect(Number.isFinite(d)).toBe(true);
  });

  it("centres the layout and puts its widest spread along x", () => {
    const { nodes } = buildStackGraph(projects);
    const spread = (axis: 0 | 1 | 2) =>
      nodes.reduce((sum, n) => sum + n.position[axis] ** 2, 0);
    const mean = (axis: 0 | 1 | 2) =>
      nodes.reduce((sum, n) => sum + n.position[axis], 0) / nodes.length;

    for (const axis of [0, 1, 2] as const)
      expect(Math.abs(mean(axis))).toBeLessThan(1e-9);
    expect(spread(0)).toBeGreaterThanOrEqual(spread(1));
    expect(spread(0)).toBeGreaterThanOrEqual(spread(2));
  });

  it("keeps linked nodes closer together than unlinked ones on average", () => {
    const { nodes, edges } = buildStackGraph(projects);
    const distance = (a: number, b: number) =>
      Math.hypot(...nodes[a].position.map((v, k) => v - nodes[b].position[k]));
    const linked =
      edges.reduce((sum, [a, b]) => sum + distance(a, b), 0) / edges.length;

    let unlinkedSum = 0;
    let unlinkedCount = 0;
    const isEdge = new Set(edges.map(([a, b]) => `${a}-${b}`));
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        if (isEdge.has(`${a}-${b}`) || isEdge.has(`${b}-${a}`)) continue;
        unlinkedSum += distance(a, b);
        unlinkedCount++;
      }
    }

    expect(linked).toBeLessThan(unlinkedSum / unlinkedCount);
  });
});
