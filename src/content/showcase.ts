import { liveProducts } from "./products";
import { projects, type ProjectLink } from "./projects";

/** One window in the Projects showcase: a featured open-source project or a live product. */
export type ShowcaseItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Products list features, because their stack is not public. */
  tagsLabel: "Tech stack" | "Features";
  live: boolean;
  codePrivate: boolean;
  traffic?: string;
  image: { src: string; alt: string };
  links: ProjectLink[];
};

export const showcaseItems: ShowcaseItem[] = [
  ...projects
    .filter((project) => project.featured)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      tags: project.tags,
      tagsLabel: "Tech stack" as const,
      live: project.live ?? false,
      // Tools Hubs links only to its live site because its repo is private.
      codePrivate: !project.links.some((link) => link.label === "Code"),
      image: project.image,
      links: project.links,
    })),
  ...liveProducts.map((product) => ({
    slug: product.slug,
    title: product.name,
    description: product.description,
    tags: product.highlights,
    tagsLabel: "Features" as const,
    live: true,
    codePrivate: true,
    traffic: product.traffic,
    image: product.image,
    links: [{ label: "Live site", href: product.url }],
  })),
];
