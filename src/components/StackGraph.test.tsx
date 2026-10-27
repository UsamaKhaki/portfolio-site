import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { normalizeTag } from "@/lib/stack-graph";
import { StackGraph } from "./StackGraph";

// jsdom has no WebGL or IntersectionObserver, so these tests cover the accessible layer:
// the project list and the caption that describe the same data as the 3D graph.
describe("StackGraph", () => {
  it("lists every project with its number of technologies", () => {
    render(<StackGraph />);

    for (const project of projects) {
      expect(
        screen.getByRole("button", { name: new RegExp(`^${project.title}`) }),
      ).toHaveTextContent(
        `${new Set(project.tags.map(normalizeTag)).size} technologies`,
      );
    }
  });

  it("describes a project's stack when it is focused", () => {
    render(<StackGraph />);
    const fleetOps = screen.getByRole("button", {
      name: /^Fleet Ops Dashboard/,
    });

    fireEvent.focus(fleetOps);

    expect(fleetOps).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(/uses React, single-spa, TanStack Query/),
    ).toBeInTheDocument();
  });

  it("returns to the overview when the pointer leaves the list", () => {
    render(<StackGraph />);
    const cited = screen.getByRole("button", { name: /^Cited/ });

    fireEvent.mouseEnter(cited);
    expect(cited).toHaveAttribute("aria-pressed", "true");

    fireEvent.mouseLeave(screen.getByRole("list", { name: "Projects" }));
    expect(cited).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByText(/Pick a project to see its stack/),
    ).toBeInTheDocument();
  });

  it("keeps the canvas container out of the accessibility tree", () => {
    const { container } = render(<StackGraph />);

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
