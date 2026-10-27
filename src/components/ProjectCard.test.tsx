import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const bySlug = (slug: string) => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`No project ${slug}`);
  return project;
};

describe("ProjectCard", () => {
  it("shows the title, description, tags and screenshot", () => {
    const project = bySlug("chat-with-db");
    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("heading", { name: "Chat with DB" }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: project.image.alt }),
    ).toBeInTheDocument();
    const tags = within(
      screen.getByRole("list", { name: "Tech stack" }),
    ).getAllByRole("listitem");
    expect(tags.map((tag) => tag.textContent)).toEqual(project.tags);
  });

  it("opens code and demo links in a new tab and names the project for screen readers", () => {
    render(<ProjectCard project={bySlug("fleet-ops")} />);

    const code = screen.getByRole("link", {
      name: /Code for Fleet Ops Dashboard/,
    });
    expect(code).toHaveAttribute(
      "href",
      "https://github.com/UsamaKhaki/fleet-ops-dashboard",
    );
    expect(code).toHaveAttribute("target", "_blank");
    expect(code).toHaveAttribute("rel", "noreferrer");
    expect(code).toHaveAccessibleName(/opens in a new tab/);
    expect(
      screen.getByRole("link", { name: /Video for Fleet Ops Dashboard/ }),
    ).toBeInTheDocument();
  });

  it("marks only the live project with a Live badge", () => {
    const { unmount } = render(<ProjectCard project={bySlug("tools-hubs")} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    unmount();

    render(<ProjectCard project={bySlug("cited")} />);
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });

  it("puts the live demo first for projects deployed as demos", () => {
    render(<ProjectCard project={bySlug("cited")} />);

    const links = screen.getAllByRole("link");
    expect(
      links.map((link) => link.textContent?.split(" for ")[0].trim()),
    ).toEqual(["Live demo", "Code", "Video"]);
    expect(links[0]).toHaveAttribute("href", "https://cited-gold.vercel.app");
  });
});
