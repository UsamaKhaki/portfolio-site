import { experience, formatPeriod } from "@/content/experience";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-32"
    >
      <SectionHeading
        id="experience-title"
        eyebrow="Experience"
        title="Where I have worked"
      />
      <ol className="border-line border-l-2 pl-6 sm:pl-10">
        {experience.map((role) => (
          <li
            key={`${role.company}-${role.start}`}
            className="relative pb-14 last:pb-0"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[33px] size-4 rounded-full border-2 sm:-left-[49px] ${
                role.end === null
                  ? "border-accent bg-accent ring-accent-soft ring-4"
                  : "border-line-strong bg-bg"
              }`}
            />
            <div className="grid gap-x-10 gap-y-3 md:grid-cols-[200px_1fr]">
              <p className="text-ink-muted pt-0.5 text-sm font-semibold">
                {formatPeriod(role)}
              </p>
              <div>
                <h3 className="text-[22px] font-extrabold tracking-tight">
                  {role.title}
                </h3>
                <p className="text-ink-muted mt-1">
                  <span className="text-ink font-semibold">{role.company}</span>{" "}
                  · {role.location}
                </p>
                <ul className="text-ink-muted marker:text-accent mt-4 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed">
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
                  {role.stack.map((tech) => (
                    <li
                      key={tech}
                      className="bg-surface-muted text-ink-muted rounded-lg px-2.5 py-1 text-xs font-bold"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
