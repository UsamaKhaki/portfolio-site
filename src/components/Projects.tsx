import { moreOnGitHub, projects } from "@/content/projects";
import { ExternalLink } from "./ExternalLink";
import { LiveProducts } from "./LiveProducts";
import { ProjectCard } from "./ProjectCard";
import { ProjectShowcase } from "./ProjectShowcase";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const others = projects.filter((project) => !project.featured);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-32"
    >
      <SectionHeading
        id="projects-title"
        eyebrow="Featured projects"
        title="Recent work"
        aside={
          <p className="text-ink-muted max-w-sm text-[15px] leading-relaxed">
            Open-source projects link to their code on GitHub. Tools Hubs and
            the live products run in production.
          </p>
        }
      />
      <ProjectShowcase />
      <LiveProducts />

      <div className="mt-16 mb-6 flex items-baseline justify-between gap-4 sm:mt-20">
        <h3
          id="more-projects"
          className="text-2xl font-extrabold tracking-tight"
        >
          More projects
        </h3>
        <p
          className="text-ink-muted text-sm font-semibold sm:hidden"
          aria-hidden="true"
        >
          Swipe →
        </p>
      </div>
      {/* Phones get a swipeable row with the next card peeking in; larger screens a grid. */}
      <div
        role="region"
        aria-labelledby="more-projects"
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {others.map((project) => (
          <div
            key={project.slug}
            className="flex w-[85%] shrink-0 snap-start sm:w-auto"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <ExternalLink
        href={moreOnGitHub.href}
        className="border-line-strong hover:border-ink mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-dashed px-6 py-5 transition-colors"
      >
        <span>
          <strong className="font-bold">More on GitHub</strong>
          <span className="text-ink-muted">
            : {moreOnGitHub.names.join(", ")}
          </span>
        </span>
        <span className="text-accent-ink font-bold" aria-hidden="true">
          github.com/UsamaKhaki ↗
        </span>
      </ExternalLink>
    </section>
  );
}
