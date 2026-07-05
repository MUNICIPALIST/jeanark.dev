"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/**
 * Anchor that scrolls smoothly to in-page sections via Lenis (falling back to
 * native scroll), while behaving like a normal link for external URLs.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return;
    e.preventDefault();

    const target = href === "#top" ? 0 : href;
    if (lenis) {
      lenis.scrollTo(target, { offset: -72, immediate: Boolean(reduce) });
    } else if (href === "#top") {
      window.scrollTo({ top: 0 });
    } else {
      document.querySelector(href)?.scrollIntoView();
    }
  }

  return (
    <a href={href} onClick={handleClick} data-cursor {...rest}>
      {children}
    </a>
  );
}
