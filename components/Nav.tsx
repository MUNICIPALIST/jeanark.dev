"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SmartLink } from "@/components/ui/SmartLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled && "border-b border-border bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 md:px-8">
        <SmartLink
          href="#top"
          className="font-display text-base font-medium tracking-tight"
        >
          {site.name}
        </SmartLink>

        <div className="flex items-center gap-4 sm:gap-6">
          <SmartLink
            href="#about"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            About
          </SmartLink>
          <SmartLink
            href="#work"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            Work
          </SmartLink>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
