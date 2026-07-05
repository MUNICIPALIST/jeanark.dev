import { stack } from "@/lib/content";
import { container } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function Stack() {
  return (
    <section id="stack" className="border-t border-border py-24 md:py-32">
      <div className={container}>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Stack</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight md:text-4xl">
            Tools I build with
          </h2>
        </Reveal>

        <div className="mt-12 border-t border-border">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-12 md:gap-8">
                <h3 className="font-display text-lg font-medium md:col-span-3">
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
