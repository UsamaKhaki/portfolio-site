import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { liveProducts } from "@/content/products";
import { projects } from "@/content/projects";
import Home from "./page";

describe("Home page", () => {
  it("shows every live product as a tab in the showcase", () => {
    render(<Home />);

    for (const product of liveProducts) {
      expect(
        screen.getByRole("tab", { name: product.name }),
      ).toBeInTheDocument();
    }
  });

  it("has one h1 and a heading for every section", () => {
    render(<Home />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of [
      "Recent work",
      "Where I have worked",
      "What I work with",
      /Hiring a senior/,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("shows featured projects as tabs and the rest as cards", () => {
    render(<Home />);

    for (const project of projects) {
      if (project.featured) {
        expect(
          screen.getByRole("tab", { name: project.title }),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.getByRole("heading", { level: 3, name: project.title }),
        ).toBeInTheDocument();
      }
    }
  });

  it("lets keyboard users skip the header", () => {
    render(<Home />);

    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("points every in-page link at a section that exists", () => {
    const { container } = render(<Home />);

    const targets = [
      ...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    ].map((link) => link.getAttribute("href")!.slice(1));
    for (const id of new Set(targets)) {
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it("offers email, LinkedIn and GitHub as contact options", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute(
      "href",
      "mailto:khakiu.uk@gmail.com",
    );
    expect(
      screen.getAllByRole("link", { name: /LinkedIn/ }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /GitHub/ }).length,
    ).toBeGreaterThan(0);
  });
});
