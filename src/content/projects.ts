export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  live?: boolean;
  image: { src: string; alt: string; fit?: "cover" | "contain" };
  links: ProjectLink[];
};

const GITHUB = "https://github.com/UsamaKhaki";

const repo = (name: string) => `${GITHUB}/${name}`;
const demo = (name: string, file: string) =>
  `${GITHUB}/${name}/blob/main/docs/demo/${file}`;

export const projects: Project[] = [
  {
    slug: "chat-with-db",
    title: "Chat with DB",
    description:
      "Ask a Postgres database a question in plain English and get the answer, the SQL, the rows and a chart. Every query is parsed, allow-listed and run read-only with a timeout and row cap.",
    tags: [
      "Next.js",
      "TypeScript",
      "LangChain",
      "Postgres",
      "pgvector",
      "Claude / OpenAI",
    ],
    featured: true,
    image: {
      src: "/projects/chat-with-db.jpg",
      alt: "Chat with DB answering a question with a bar chart of the result",
    },
    links: [
      { label: "Code", href: repo("chat-with-db") },
      { label: "Video", href: demo("chat-with-db", "demo.webm") },
    ],
  },
  {
    slug: "fleet-ops",
    title: "Fleet Ops Dashboard",
    description:
      "Operations console for a fleet of heavy equipment: 5,000 assets, work orders and a live vehicle map, built as React micro-frontends composed with single-spa.",
    tags: [
      "React",
      "single-spa",
      "TanStack Query",
      "TanStack Table",
      "WebSockets",
      "Vite",
    ],
    featured: true,
    image: {
      src: "/projects/fleet-ops.jpg",
      alt: "Live map of vehicles around five sites with one vehicle selected",
    },
    links: [
      { label: "Code", href: repo("fleet-ops-dashboard") },
      {
        label: "Video",
        href: demo("fleet-ops-dashboard", "fleet-ops-walkthrough.mp4"),
      },
    ],
  },
  {
    slug: "tools-hubs",
    title: "Tools Hubs",
    description:
      "Salary, tax and cost-of-living calculators for the UAE, US, Saudi Arabia and Germany, in two languages each, built as one Next.js monorepo. The UAE hub is live.",
    tags: [
      "Next.js",
      "Turborepo",
      "next-intl",
      "TypeScript",
      "Playwright",
      "Vercel",
    ],
    featured: true,
    live: true,
    image: {
      src: "/projects/tools-hubs.jpg",
      alt: "Home page of the UAE Tools Hub listing its calculators",
    },
    links: [{ label: "Live site", href: "https://uaetoolshub.com" }],
  },
  {
    slug: "cited",
    title: "Cited",
    description:
      "Finds the buyer questions AI assistants answer without naming a business, drafts answer pages to fill the gaps, and blocks thin or unsafe pages with a 20+ rule quality gate.",
    tags: ["Next.js", "Supabase (RLS)", "Postgres", "Gemini", "Zod"],
    featured: false,
    image: {
      src: "/projects/cited.jpg",
      alt: "Visibility report showing which AI answers mention the business",
    },
    links: [
      { label: "Live demo", href: "https://cited-gold.vercel.app" },
      { label: "Code", href: repo("cited") },
      { label: "Video", href: demo("cited", "cited-demo.mp4") },
    ],
  },
  {
    slug: "ledger",
    title: "Ledger",
    description:
      "Debt payoff planner: simulates every month with avalanche or snowball, shows the debt-free date and total interest, and updates as real payments are logged.",
    tags: ["Next.js", "ts-rest", "Supabase", "Stripe", "Recharts"],
    featured: false,
    image: {
      src: "/projects/ledger.jpg",
      alt: "Ledger dashboard with debt balances and the projected debt-free date",
    },
    links: [
      { label: "Live demo", href: "https://ledger-eta-teal.vercel.app" },
      { label: "Code", href: repo("ledger-core") },
      { label: "Video", href: demo("ledger-core", "ledger-demo.mp4") },
    ],
  },
  {
    slug: "flyt",
    title: "Flyt",
    description:
      "Flight metasearch on the redirect model: one search, every fare side by side, booking handed to the partner. A swappable provider interface sits between the UI and the fare source.",
    tags: ["Next.js", "Turborepo", "pnpm", "Zod", "TypeScript"],
    featured: false,
    image: {
      src: "/projects/flyt.jpg",
      alt: "Flight search results with fares from several partners side by side",
    },
    links: [
      { label: "Live demo", href: "https://flyt-beryl.vercel.app" },
      { label: "Code", href: repo("flyt") },
      { label: "Video", href: demo("flyt", "flyt-demo.mp4") },
    ],
  },
  {
    slug: "divido",
    title: "Divido",
    description:
      "Mobile app that splits group bills by line item and settles them in as few payments as possible, with receipt OCR and offline sync.",
    tags: [
      "React Native",
      "Expo",
      "Laravel",
      "PHP",
      "TanStack Query",
      "SQLite",
    ],
    featured: false,
    image: {
      src: "/projects/divido.jpg",
      alt: "Divido group screen with balances between members",
      fit: "contain",
    },
    links: [
      { label: "Code", href: repo("divido") },
      { label: "Video", href: demo("divido", "divido-demo.mp4") },
    ],
  },
  {
    slug: "waypoint",
    title: "Waypoint",
    description:
      "A keyboard-driven Chrome new tab for developers: pull requests, bookmarks, snippets and dev tools behind Cmd+K, with GitHub, Linear, Jira and Slack connectors.",
    tags: ["Chrome MV3", "React", "TypeScript", "Vite", "Zustand"],
    featured: false,
    image: {
      src: "/projects/waypoint.jpg",
      alt: "Waypoint new tab page with pull requests, bookmarks and snippets",
    },
    links: [
      {
        label: "Website",
        href: "https://usamakhaki.github.io/waypoint-chrome-ext/",
      },
      { label: "Code", href: repo("waypoint-chrome-ext") },
      {
        label: "Video",
        href: demo("waypoint-chrome-ext", "waypoint-demo.webm"),
      },
    ],
  },
  {
    slug: "postpilot",
    title: "Postpilot",
    description:
      "LinkedIn posts drafted in your voice and scheduled, published only after you approve them over WhatsApp.",
    tags: [
      "Next.js",
      "Supabase",
      "OpenAI / Anthropic",
      "Twilio",
      "Vercel Cron",
    ],
    featured: false,
    image: {
      src: "/projects/postpilot.jpg",
      alt: "Postpilot composer drafting a LinkedIn post",
    },
    links: [
      { label: "Live demo", href: "https://postpilot-ten-liard.vercel.app" },
      { label: "Code", href: repo("postpilot") },
      { label: "Video", href: demo("postpilot", "postpilot-demo.mp4") },
    ],
  },
];

export const moreOnGitHub = {
  href: `${GITHUB}?tab=repositories`,
  names: [
    "Trace URL shortener",
    "ApertureShelf for macOS",
    "a Next.js + Laravel starter kit",
  ],
};
