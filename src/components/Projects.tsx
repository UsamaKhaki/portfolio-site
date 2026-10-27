import { moreOnGitHub, projects } from "@/content/projects";
import { ExternalLink } from "./ExternalLink";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const featured = projects.filter((project) => project.featured);
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
            Source code for each project is on GitHub. Tools Hubs is the one
            running in production.
          </p>
        }
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <h3 className="mt-20 mb-6 text-2xl font-extrabold tracking-tight">
        More projects
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((project) => (
          <ProjectCard key={project.slug} project={project} />
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
