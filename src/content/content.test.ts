import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { experience, formatPeriod } from "./experience";
import { liveProducts } from "./products";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";

const allCopy = JSON.stringify({
  profile,
  projects,
  liveProducts,
  experience,
  skillGroups,
});

describe("live products", () => {
  it("links each product to its own https site, matching its domain", () => {
    for (const product of liveProducts) {
      const url = new URL(product.url);
      expect(url.protocol, product.slug).toBe("https:");
      expect(url.hostname.replace(/^www\./, ""), product.slug).toBe(
        product.domain,
      );
    }
  });

  it("has unique slugs and no overlap with the code projects", () => {
    const slugs = liveProducts.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(projects.some((project) => project.slug === slug)).toBe(false);
    }
  });

  it("has a screenshot file for every product", () => {
    for (const product of liveProducts) {
      expect(
        existsSync(join(process.cwd(), "public", product.image.src)),
        product.image.src,
      ).toBe(true);
    }
  });

  it("keeps traffic in its own rounded field, in one consistent format", () => {
    for (const product of liveProducts) {
      if (product.traffic === undefined) continue;
      expect(product.traffic, product.slug).toMatch(
        /^\d+K\+ monthly visitors$/,
      );
    }
  });

  it("does not put traffic numbers in the descriptions", () => {
    for (const product of liveProducts) {
      expect(product.description, product.slug).not.toMatch(
        /\b\d[\d,.]*\s*[KkMm]?\+?\s*(users|visits|visitors|downloads)\b/,
      );
    }
  });
});

describe("projects", () => {
  it("features exactly three projects, shown first", () => {
    const featured = projects.filter((project) => project.featured);
    expect(featured.map((project) => project.slug)).toEqual([
      "chat-with-db",
      "fleet-ops",
      "tools-hubs",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links every public project to its repo on the personal GitHub account", () => {
    for (const project of projects.filter((p) => p.slug !== "tools-hubs")) {
      const code = project.links.find((link) => link.label === "Code");
      expect(code?.href, project.slug).toMatch(
        /^https:\/\/github\.com\/UsamaKhaki\/[\w-]+$/,
      );
    }
  });

  it("only links Tools Hubs to its live site, because its repo is private", () => {
    const toolsHubs = projects.find((project) => project.slug === "tools-hubs");
    expect(toolsHubs?.links).toEqual([
      { label: "Live site", href: "https://uaetoolshub.com" },
    ]);
    expect(
      projects.filter((project) => project.live).map((project) => project.slug),
    ).toEqual(["tools-hubs"]);
  });

  it("has a screenshot file in /public for every card", () => {
    for (const project of projects) {
      expect(
        existsSync(join(process.cwd(), "public", project.image.src)),
        project.image.src,
      ).toBe(true);
      expect(project.image.alt.length, project.slug).toBeGreaterThan(10);
    }
  });

  it("keeps 4 to 6 tags per card", () => {
    for (const project of projects) {
      expect(project.tags.length, project.slug).toBeGreaterThanOrEqual(4);
      expect(project.tags.length, project.slug).toBeLessThanOrEqual(6);
    }
  });
});

describe("experience", () => {
  it("lists roles newest first, with only the current role open-ended", () => {
    expect(experience.filter((role) => role.end === null)).toHaveLength(1);
    expect(experience[0].end).toBeNull();
  });

  it("starts the career at the same date the hero shows", () => {
    expect(experience.at(-1)?.start).toBe(profile.careerStart);
  });

  it("formats open and closed periods", () => {
    expect(formatPeriod({ start: "Jun 2023", end: null })).toBe(
      "Jun 2023 – Present",
    );
    expect(formatPeriod({ start: "May 2016", end: "Jul 2018" })).toBe(
      "May 2016 – Jul 2018",
    );
  });
});

describe("copy", () => {
  it("contains no em dashes", () => {
    expect(allCopy).not.toContain("—");
  });

  it("does not carry over the template's made-up metrics", () => {
    for (const claim of [
      "99.9%",
      "1M+ daily users",
      "millions of events",
      "20+ packages",
    ]) {
      expect(allCopy).not.toContain(claim);
    }
  });

  it("does not mention the agency", () => {
    expect(allCopy.toLowerCase()).not.toContain("devigners");
  });
});
