import { skillGroups } from "@/content/skills";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-32"
    >
      <SectionHeading
        id="skills-title"
        eyebrow="Skills"
        title="What I work with"
      />
      <dl className="border-line bg-surface divide-line divide-y rounded-[20px] border">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid gap-3 px-6 py-5 sm:grid-cols-[200px_1fr] sm:gap-6"
          >
            <dt className="pt-1.5 font-bold">{group.name}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border-line-strong rounded-full border px-3 py-1.5 text-sm font-semibold"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
