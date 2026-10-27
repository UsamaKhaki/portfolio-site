import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { showcaseItems } from "@/content/showcase";
import { ProjectShowcase } from "./ProjectShowcase";

const featured = showcaseItems;

// jsdom has no WebGL, so these tests cover the tabs and panels, which carry all the content.
describe("ProjectShowcase", () => {
  it("has one tab per showcase item, with the first selected", () => {
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

    const last = tabs[tabs.length - 1];
    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: "Home" });
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

  it("shows live products with their traffic, a live link and no code link", () => {
    render(<ProjectShowcase />);

    fireEvent.click(screen.getByRole("tab", { name: "downloadvideo.cc" }));

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("10K+ monthly visitors · Code is private");
    expect(
      screen.getByRole("link", { name: /Live site for downloadvideo.cc/ }),
    ).toHaveAttribute("href", "https://downloadvideo.cc");
    expect(screen.queryByRole("link", { name: /^Code/ })).toBeNull();
    expect(screen.getByRole("list", { name: "Features" })).toBeInTheDocument();
  });

  it("does not show a traffic line for products without a confirmed figure", () => {
    render(<ProjectShowcase />);

    fireEvent.click(screen.getByRole("tab", { name: "W-Meet" }));

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Code is private");
    expect(panel).not.toHaveTextContent(/visitors/);
  });
});
