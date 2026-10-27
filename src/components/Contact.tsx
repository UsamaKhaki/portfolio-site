import { profile } from "@/content/profile";
import { ExternalLink } from "./ExternalLink";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const channels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    Icon: MailIcon,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "in/usamakhaki",
    href: profile.linkedin,
    Icon: LinkedInIcon,
    external: true,
  },
  {
    label: "GitHub",
    value: "UsamaKhaki",
    href: profile.github,
    Icon: GitHubIcon,
    external: true,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-32"
    >
      <div className="bg-ink text-bg grid gap-12 rounded-[28px] p-8 sm:p-14 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 font-bold opacity-70">Contact</p>
          <h2
            id="contact-title"
            className="text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            {/* Non-breaking hyphen keeps "full-stack" on one line. */}
            Hiring a senior frontend or full‑stack engineer?
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-80">
            I am open to senior and lead roles from December 2026, in Dubai or
            remote. Email is the fastest way to reach me.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="bg-accent text-on-accent mt-8 inline-flex h-[54px] items-center rounded-2xl px-7 font-bold transition-opacity hover:opacity-90"
          >
            Email me
          </a>
        </div>
        <ul className="self-end">
          {channels.map(({ label, value, href, Icon, external }) => {
            const content = (
              <>
                <span className="flex items-center gap-3 font-semibold opacity-80">
                  <Icon className="size-5" />
                  {label}
                </span>
                <span className="font-bold break-all">{value}</span>
              </>
            );
            const className =
              "flex items-center justify-between gap-4 border-b border-current/15 py-5 transition-opacity hover:opacity-80";
            return (
              <li key={label}>
                {external ? (
                  <ExternalLink href={href} className={className}>
                    {content}
                  </ExternalLink>
                ) : (
                  <a href={href} className={className}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
