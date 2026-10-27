import type { ComponentPropsWithoutRef } from "react";

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel">;

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
