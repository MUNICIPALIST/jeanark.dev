import { site } from "@/lib/content";
import { container } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <div className={container}>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">About</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-10 max-w-3xl text-balance font-display text-2xl font-medium leading-snug md:text-[2rem] md:leading-[1.3]">
            {site.about}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
