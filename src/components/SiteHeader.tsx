import { ThemeToggle } from "./ThemeToggle";

export const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="bg-bg/85 border-line/60 sticky top-0 z-20 border-b backdrop-blur-md">
      <a
        href="#main"
        className="bg-ink text-bg sr-only z-30 rounded-lg px-4 py-2 font-bold focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-8">
        <a href="#top" className="text-xl font-extrabold tracking-tight">
          usama<span className="text-accent">.</span>khaki
        </a>
        <nav
          aria-label="Main"
          className="hidden gap-8 text-[15px] font-semibold md:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink-muted hover:text-ink transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#contact"
            className="bg-ink text-bg inline-flex h-11 items-center rounded-xl px-5 font-bold transition-opacity hover:opacity-90"
          >
            Hire me
          </a>
        </div>
      </div>
      {/* Phones get the same sections as a scrollable row instead of a hidden menu. */}
      <nav
        aria-label="Sections"
        className="-mt-1 flex gap-6 overflow-x-auto px-4 pb-3 text-sm font-semibold md:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-ink-muted hover:text-ink shrink-0 py-1"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
