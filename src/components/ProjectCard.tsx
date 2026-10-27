import Image from "next/image";
import type { Project } from "@/content/projects";
import { ExternalLink } from "./ExternalLink";

export function ProjectCard({ project }: { project: Project }) {
  const { image } = project;

  return (
    <article className="group border-line bg-surface hover:shadow-lift flex flex-col overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="bg-accent-soft relative aspect-[16/10] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className={
            image.fit === "contain"
              ? "object-contain p-3"
              : "object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          }
        />
        {project.live && (
          <span className="bg-surface text-accent-ink shadow-lift absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <span
              className="bg-accent size-1.5 rounded-full"
              aria-hidden="true"
            />
            Live
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-[22px] font-extrabold tracking-tight">
          {project.title}
        </h3>
        <p className="text-ink-muted text-[15px] leading-relaxed">
          {project.description}
        </p>
        <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="bg-surface-muted text-ink-muted rounded-lg px-2.5 py-1 text-xs font-bold"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-6 pt-2">
          {project.links.map((link) => (
            <ExternalLink
              key={link.href}
              href={link.href}
              className="text-accent-ink inline-flex min-h-11 items-center gap-1 font-bold hover:underline hover:underline-offset-4"
            >
              {link.label}
              <span className="sr-only"> for {project.title}</span>{" "}
              <span aria-hidden="true">↗</span>
            </ExternalLink>
          ))}
        </div>
      </div>
    </article>
  );
}
