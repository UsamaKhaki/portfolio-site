import { liveProducts } from "@/content/products";
import { ExternalLink } from "./ExternalLink";

export function LiveProducts() {
  return (
    <div className="mt-16 sm:mt-20">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3
          id="live-products"
          className="text-2xl font-extrabold tracking-tight"
        >
          Live products
        </h3>
        <p className="text-ink-muted text-[15px]">
          Sites I build and run in production. The code is private.
        </p>
      </div>
      <ul aria-labelledby="live-products" className="grid gap-4 sm:grid-cols-2">
        {liveProducts.map((product) => (
          <li
            key={product.slug}
            className="border-line bg-surface flex gap-4 rounded-[20px] border p-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="bg-accent-soft text-accent-ink flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold"
            >
              {product.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h4 className="text-lg font-extrabold tracking-tight">
                  {product.name}
                </h4>
                <span className="text-accent-ink inline-flex items-center gap-1.5 text-xs font-bold">
                  <span
                    className="bg-accent size-1.5 rounded-full"
                    aria-hidden="true"
                  />
                  Live
                </span>
              </div>
              <p className="text-ink-muted text-[15px] leading-relaxed">
                {product.description}
              </p>
              <ul aria-label="Highlights" className="flex flex-wrap gap-1.5">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="bg-surface-muted text-ink-muted rounded-lg px-2.5 py-1 text-xs font-bold"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
              <ExternalLink
                href={product.url}
                className="text-accent-ink mt-auto inline-flex min-h-11 items-center gap-1 self-start font-bold hover:underline hover:underline-offset-4"
              >
                {product.domain} <span aria-hidden="true">↗</span>
              </ExternalLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
