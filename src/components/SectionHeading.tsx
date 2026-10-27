import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-accent-ink mb-2.5 font-bold">{eyebrow}</p>
        <h2
          id={id}
          className="text-4xl font-extrabold tracking-[-0.03em] sm:text-[44px]"
        >
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
