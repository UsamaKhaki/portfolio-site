"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { projects } from "@/content/projects";
import { ExternalLink } from "./ExternalLink";
import type { ProjectShowcaseScene } from "./projectShowcaseScene";

const featured = projects.filter((project) => project.featured);

// Textures go through the Next.js image optimizer, so the 3D scene gets the same
// resized, modern-format files as the rest of the page.
const textureUrl = (src: string) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;

export function ProjectShowcase() {
  const [active, setActive] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ProjectShowcaseScene | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("./projectShowcaseScene").then(
          ({ createProjectShowcaseScene }) => {
            if (cancelled) return;
            sceneRef.current = createProjectShowcaseScene(
              container,
              featured.map((project) => textureUrl(project.image.src)),
              {
                onSelect: setActive,
                onReady: () => setSceneReady(true),
                reducedMotion: window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches,
              },
            );
          },
        );
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
  }, []);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active]);

  // Arrow keys, Home and End move between tabs, following the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = featured.length - 1;
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = featured[active];

  return (
    // Three grid areas: on phones they stack as tabs, then the visual, then the panel;
    // on desktop the tabs and panel share the left column and the visual spans the right.
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8">
      <div className="relative order-1 -mx-4 [scrollbar-width:none] overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:col-start-1 lg:row-start-1 lg:self-end">
        <div
          role="tablist"
          aria-label="Featured projects"
          className="flex w-max gap-2 sm:w-auto sm:flex-wrap"
          onKeyDown={onTabKeyDown}
        >
          {featured.map((project, i) => (
            <button
              key={project.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`showcase-tab-${project.slug}`}
              aria-selected={i === active}
              aria-controls={`showcase-panel-${project.slug}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className="border-line-strong aria-selected:border-ink aria-selected:bg-ink aria-selected:text-bg hover:border-ink min-h-11 shrink-0 cursor-pointer rounded-full border-[1.5px] px-4 text-sm font-bold transition-colors"
            >
              {project.title}
            </button>
          ))}
        </div>
      </div>

      <div className="order-3 lg:col-start-1 lg:row-start-2">
        {featured.map((project, i) => (
          <div
            key={project.slug}
            role="tabpanel"
            id={`showcase-panel-${project.slug}`}
            aria-labelledby={`showcase-tab-${project.slug}`}
            hidden={i !== active}
          >
            <h3 className="flex flex-wrap items-center gap-3 text-[28px] font-extrabold tracking-tight">
              {project.title}
              {project.live && (
                <span className="bg-accent-soft text-accent-ink inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
                  <span
                    className="bg-accent size-1.5 rounded-full"
                    aria-hidden="true"
                  />
                  Live
                </span>
              )}
            </h3>
            <p className="text-ink-muted mt-3 max-w-xl leading-relaxed">
              {project.description}
            </p>
            <ul aria-label="Tech stack" className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-surface-muted text-ink-muted rounded-lg px-2.5 py-1 text-xs font-bold"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.map((link, linkIndex) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  className={
                    linkIndex === 0
                      ? "bg-accent text-on-accent inline-flex h-12 items-center rounded-2xl px-6 font-bold transition-opacity hover:opacity-90"
                      : "border-line-strong hover:border-ink inline-flex h-12 items-center rounded-2xl border-[1.5px] px-6 font-bold transition-colors"
                  }
                >
                  {link.label}{" "}
                  <span className="sr-only">for {project.title}</span>{" "}
                  <span aria-hidden="true">↗</span>
                </ExternalLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative order-2 aspect-[16/11] w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        {!sceneReady && (
          <div className="border-line shadow-lift absolute inset-x-[6%] top-[12%] aspect-[16/10] overflow-hidden rounded-2xl border">
            <Image
              src={current.image.src}
              alt={current.image.alt}
              fill
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-cover object-top"
            />
          </div>
        )}
        <div
          ref={containerRef}
          aria-hidden="true"
          className="absolute inset-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
