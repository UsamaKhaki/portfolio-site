import Image from "next/image";
import { profile } from "@/content/profile";
import { DownloadIcon, GitHubIcon, LinkedInIcon } from "./icons";

function Portrait() {
  if (profile.photo) {
    return (
      <Image
        src={profile.photo}
        alt={`Portrait of ${profile.name}`}
        fill
        priority
        sizes="(min-width: 900px) 480px, 90vw"
        className="object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="text-ink-muted/60 text-[120px] font-extrabold tracking-tighter"
    >
      UK
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-10 sm:px-8 sm:pt-16 md:grid-cols-[1.15fr_1fr]"
    >
      <div>
        <h1 className="text-[clamp(2.5rem,5.4vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance">
          Hi, I&apos;m Usama.
          <br />I build frontends for{" "}
          <span className="text-accent">data-heavy products.</span>
        </h1>
        <p className="text-ink-muted mt-6 max-w-xl text-lg leading-relaxed sm:text-[19px]">
          {profile.summary}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="bg-accent text-on-accent inline-flex h-[54px] items-center rounded-2xl px-7 font-bold transition-opacity hover:opacity-90"
          >
            See my projects
          </a>
          {profile.cvUrl ? (
            <a
              href={profile.cvUrl}
              download
              className="border-line-strong hover:border-ink inline-flex h-[54px] items-center gap-2 rounded-2xl border-[1.5px] px-6 font-bold transition-colors"
            >
              Download CV
              <DownloadIcon className="size-4" />
            </a>
          ) : (
            <a
              href="#contact"
              className="border-line-strong hover:border-ink inline-flex h-[54px] items-center rounded-2xl border-[1.5px] px-6 font-bold transition-colors"
            >
              Contact me
            </a>
          )}
          <span className="ml-1 inline-flex gap-1">
            <a
              href={profile.github}
              aria-label="GitHub"
              className="text-ink-muted hover:text-ink inline-flex size-11 items-center justify-center"
            >
              <GitHubIcon className="size-[22px]" />
            </a>
            <a
              href={profile.linkedin}
              aria-label="LinkedIn"
              className="text-ink-muted hover:text-ink inline-flex size-11 items-center justify-center"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </span>
        </div>
      </div>

      {/* Kept small on phones so the projects are not pushed a full screen down. */}
      <div className="relative mx-auto w-full max-w-[300px] pr-6 pb-6 md:max-w-[480px]">
        <div
          aria-hidden="true"
          className="bg-accent absolute right-0 bottom-0 h-[88%] w-[88%] rounded-[32px] opacity-90"
        />
        <div className="bg-surface-muted relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[32px]">
          <Portrait />
        </div>
        <div className="bg-surface shadow-lift absolute bottom-16 -left-2 rounded-2xl px-[18px] py-3.5 sm:-left-7">
          <p className="text-[26px] leading-tight font-extrabold">10+ yrs</p>
          <p className="text-ink-muted mt-0.5 text-[13px]">
            since {profile.careerStart}
          </p>
        </div>
        <p className="bg-surface shadow-lift absolute top-10 -right-2 rounded-2xl px-4 py-3 text-sm font-bold">
          {profile.location}
        </p>
      </div>
    </section>
  );
}
