"use client";

import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { container } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function domainOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function previewSrc(p: Project) {
  // Free, no-account screenshot service (WordPress mShots). First load may show
  // a gray "generating" placeholder, then it caches the real screenshot.
  return (
    p.image ??
    `https://s.wordpress.com/mshots/v1/${encodeURIComponent(p.url)}?w=1200&h=750`
  );
}

export function Work() {
  return (
    <section id="work" className="border-t border-border py-24 md:py-32">
      <div className={container}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Work</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight md:text-4xl">
            Selected projects
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {projects.map((p, i) => {
            const domain = domainOf(p.url);
            return (
              <motion.a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease }}
              >
                {/* browser-frame mockup */}
                <div className="overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent">
                  <div className="flex items-center gap-1.5 border-b border-border px-3.5 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="ml-3 truncate rounded-md bg-background px-2.5 py-1 text-[11px] text-muted">
                      {domain}
                    </span>
                  </div>
                  <div className="aspect-[16/10] overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewSrc(p)}
                      alt={`${p.name} — website preview`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                  </div>
                </div>

                {/* meta */}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {p.blurb}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {p.role} &middot; {p.year}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="whitespace-nowrap pt-1 text-xs text-muted">
                    {domain} ↗
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
