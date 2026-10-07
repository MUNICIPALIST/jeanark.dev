/**
 * Single source of truth for everything written on the page.
 * Edit this file to update your portfolio — no need to touch the components.
 */

export const site = {
  name: "Arkinov Jean",
  role: "Infrastructure Engineer (ML/Data)",
  location: "Remote",

  // The statement headline, split across two lines.
  headlineLine1: "Scalable infrastructure,",
  headlineLine2: "powered by data.",

  // One short supporting line under the headline.
  tagline:
    "I build and maintain infrastructure that makes machine learning and data systems work — from training pipelines to production deployment.",

  // Short bio for the About section (2–4 sentences).
  about:
    "I'm Arkinov Jean — an infrastructure engineer specializing in ML and data systems. Over the last few years I've built and shipped production platforms end to end, from booking platforms to B2B products. Today I focus on designing reliable infrastructure for machine learning pipelines, data processing, and production deployment — with additional experience across the full stack.",

  email: "zhan@topmdhealth.com",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/municipalist" },
  // Add more when you have them, e.g.:
  // { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
];

/** What I work with right now (the longer roadmap lives in future_skills.md). */
export const now = ["Docker", "Kubernetes", "Python", "PyTorch", "SQL"];

/**
 * Selected work. Previews are screenshots in /public/projects/<slug>.webp
 * (slug = the project's domain, e.g. "unchina.study.webp"); refresh them with
 * `npm run screenshots`. Set `image` to override the path for a project.
 */
export type Project = {
  name: string;
  url: string;
  blurb: string;
  role: string;
  year: string;
  stack: string[];
  image?: string;
};

// TODO: set the real role / year / stack for each project.
export const projects: Project[] = [
  {
    name: "TopMD Health",
    url: "https://www.topmdhealth.com/",
    blurb:
      "Clinical AI for real-time diagnostic support, documentation & protocol validation.",
    role: "Full-stack",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Python", "AI"],
  },
  {
    name: "UniChina",
    url: "https://unchina.study/",
    blurb:
      "Admissions to Chinese universities for students from Kazakhstan — programs, grants, visas & mentoring.",
    role: "Full-stack",
    year: "2026",
    stack: ["SvelteKit", "Cloudflare Workers"],
  },
  {
    name: "Re-gix",
    url: "https://re-gix-landing.jeanark.workers.dev/",
    blurb: "Game studio site — Dark & Silent, a survival-horror game in development.",
    role: "Full-stack",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Uiren Go",
    url: "https://uirengo.kz/",
    blurb: "B2B platform connecting schools & educators with students.",
    role: "Full-stack",
    year: "2024",
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    name: "Uniroom",
    url: "https://uniroom.online/",
    blurb: "Student housing & rooms, online.", // TODO: refine
    role: "Full-stack",
    year: "2023",
    stack: ["React", "Node.js", "PostgreSQL"],
  },
  {
    name: "Goodrest",
    url: "https://goodrest.kz/",
    blurb: "Getaways & recreation booking.", // TODO: refine
    role: "Frontend",
    year: "2023",
    stack: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "LI Technology",
    url: "https://litechnology.kz/",
    blurb: "Technology studio & web work.", // TODO: refine
    role: "Frontend",
    year: "2023",
    stack: ["Next.js", "Tailwind CSS"],
  },
];

/** Grouped tech stack shown in the Stack section. TODO: tune to your real stack. */
export const stack = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Backend", items: ["Python", "Node.js", "PostgreSQL", "REST APIs"] },
  { group: "DevOps", items: ["Docker", "Kubernetes", "Nginx", "Git", "CI/CD"] },
  { group: "ML/Data", items: ["Python", "PyTorch", "scikit-learn", "SQL", "MLflow"] },
];
