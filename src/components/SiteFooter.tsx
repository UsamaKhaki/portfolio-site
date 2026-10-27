import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="text-ink-muted mx-auto mt-24 flex max-w-6xl flex-wrap justify-between gap-3 px-4 pb-10 text-sm sm:px-8">
      <p>
        {profile.name} · {profile.location}
      </p>
      <p>Built with Next.js and Tailwind CSS</p>
    </footer>
  );
}
