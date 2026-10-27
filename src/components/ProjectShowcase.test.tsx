import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { ProjectShowcase } from "./ProjectShowcase";

const featured = projects.filter((project) => project.featured);

// jsdom has no WebGL, so these tests cover the tabs and panels, which carry all the content.
describe("ProjectShowcase", () => {
  it("has one tab per featured project, with the first selected", () => {
    render(<ProjectShowcase />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(
      featured.map((p) => p.title),
    );
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName(
      featured[0].title,
    );
  });

  it("shows the picked project's panel and screenshot", () => {
    render(<ProjectShowcase />);

    fireEvent.click(screen.getByRole("tab", { name: "Fleet Ops Dashboard" }));

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAccessibleName("Fleet Ops Dashboard");
    expect(panel).toHaveTextContent(featured[1].description);
    expect(
      screen.getByRole("img", { name: featured[1].image.alt }),
    ).toBeInTheDocument();
  });

  it("moves between tabs with the arrow, Home and End keys", () => {
    render(<ProjectShowcase />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(tabs[2]).toHaveFocus();

    fireEvent.keyDown(tabs[2], { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(tabs[2]).toHaveFocus();

    fireEvent.keyDown(tabs[2], { key: "Home" });
    expect(tabs[0]).toHaveFocus();
  });

  it("keeps every featured project in the page, with only the active panel shown", () => {
    const { container } = render(<ProjectShowcase />);

    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels).toHaveLength(featured.length);
    expect(
      [...panels].filter((panel) => !panel.hasAttribute("hidden")),
    ).toHaveLength(1);
  });

  it("gives Tools Hubs a Live badge and a live site link instead of a repo link", () => {
    render(<ProjectShowcase />);

    fireEvent.click(screen.getByRole("tab", { name: "Tools Hubs" }));

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Live");
    expect(
      screen.getByRole("link", { name: /Live site for Tools Hubs/ }),
    ).toHaveAttribute("href", "https://uaetoolshub.com");
  });
});
