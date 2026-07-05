import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { site } from "@/lib/content";
import { container } from "@/lib/utils";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
      </main>
      <footer className="border-t border-border py-8">
        <div
          className={`${container} flex flex-col items-start justify-between gap-2 text-xs text-muted sm:flex-row sm:items-center`}
        >
          <span>
            © {year} {site.name}
          </span>
          <span>Built with Next.js &amp; Tailwind</span>
        </div>
      </footer>
    </>
  );
}
