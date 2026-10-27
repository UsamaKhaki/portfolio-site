"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { buildStackGraph } from "@/lib/stack-graph";
import type { StackGraphScene } from "./stackGraphScene";

export function StackGraph() {
  const graph = useMemo(() => buildStackGraph(projects), []);
  const [focus, setFocus] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<StackGraphScene | null>(null);

  const projectNodes = graph.nodes
    .map((node, index) => ({ ...node, index }))
    .filter((node) => node.kind === "project");

  // Load three.js and build the scene only when the graph is about to scroll into view.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("./stackGraphScene").then(({ createStackGraphScene }) => {
          if (cancelled) return;
          sceneRef.current = createStackGraphScene(container, graph, {
            onHover: setFocus,
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches,
          });
        });
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [graph]);

  useEffect(() => {
    sceneRef.current?.setFocus(focus);
  }, [focus]);

  const focused = focus === null ? null : graph.nodes[focus];
  const related =
    focus === null ? [] : graph.neighbours[focus].map((i) => graph.nodes[i].id);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <ul
          aria-label="Projects"
          className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1"
          onMouseLeave={() => setFocus(null)}
        >
          {projectNodes.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                aria-pressed={focus === node.index}
                onMouseEnter={() => setFocus(node.index)}
                onFocus={() => setFocus(node.index)}
                onClick={() => setFocus(node.index)}
                className="hover:bg-accent-soft hover:text-accent-ink aria-pressed:bg-accent-soft aria-pressed:text-accent-ink border-line-strong min-h-11 cursor-pointer rounded-full border px-3.5 py-2 text-left text-sm font-bold transition-colors aria-pressed:border-transparent lg:w-full lg:rounded-xl lg:border-0 lg:py-2.5 lg:text-base"
              >
                {node.id}
                {/* On phones the list is a row of chips; the counts only fit the desktop column. */}
                <span className="text-ink-muted hidden text-[13px] font-medium lg:block">
                  {graph.neighbours[node.index].length} technologies
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div
          ref={containerRef}
          aria-hidden="true"
          className="border-line bg-surface relative h-[360px] cursor-grab touch-pan-y overflow-hidden rounded-[20px] border active:cursor-grabbing sm:h-[460px]"
        />
        <p
          aria-live="polite"
          className="text-ink-muted mt-4 min-h-12 leading-relaxed"
        >
          {focused === null ? (
            "Projects in teal, technologies in grey. Pick a project to see its stack, or drag the graph to turn it."
          ) : focused.kind === "project" ? (
            <>
              <strong className="text-ink">{focused.id}</strong> uses{" "}
              {related.join(", ")}.
            </>
          ) : (
            <>
              <strong className="text-ink">{focused.id}</strong> is used in{" "}
              {related.join(", ")}.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
