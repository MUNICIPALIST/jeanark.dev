"use client";

import { motion } from "framer-motion";
import { now, site, socials } from "@/lib/content";
import { container } from "@/lib/utils";
import { SmartLink } from "@/components/ui/SmartLink";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fade-up entrance with a per-block delay. */
function up(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  };
}

export function Hero() {
  return (
    <section id="top" className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center pt-24">
        <div className={container}>
          <motion.div {...up(0.05)}>
            <p className="font-display text-lg font-medium tracking-tight">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-muted">
              {site.role} &middot; {site.location}
            </p>
          </motion.div>

          <motion.h1
            {...up(0.12)}
            className="mt-10 font-display text-[clamp(2.25rem,6.5vw,4.75rem)] font-medium leading-[1.05]"
          >
            <span className="block">{site.headlineLine1}</span>
            <span className="block">{site.headlineLine2}</span>
          </motion.h1>

          <motion.p
            {...up(0.22)}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted"
          >
            {site.tagline}
          </motion.p>

          <motion.div {...up(0.32)} className="mt-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Currently
            </p>
            <p className="mt-2 text-base font-medium">{now.join("  ·  ")}</p>
          </motion.div>

          <motion.div
            {...up(0.42)}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          >
            <a
              href={`mailto:${site.email}`}
              className="text-accent underline decoration-accent/30 decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {site.email}
            </a>
            <span aria-hidden className="text-border">
              ·
            </span>
            {socials.map((s, i) => (
              <span key={s.label} className="flex items-center gap-5">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {s.label}
                </a>
                {i < socials.length - 1 && (
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                )}
              </span>
            ))}
            <span aria-hidden className="text-border">
              ·
            </span>
            <a
              href={site.resumeUrl}
              download
              className="text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Download CV ↓
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...up(0.55)}
        className="pb-10"
      >
        <div className={container}>
          <SmartLink
            href="#about"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Scroll
            <span
              aria-hidden
              className="transition-transform group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </SmartLink>
        </div>
      </motion.div>
    </section>
  );
}
