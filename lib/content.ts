/**
 * Single source of truth for everything written on the page.
 * Edit this file to update your portfolio — no need to touch the components.
 */

export const site = {
  name: "Arkinov Jean",
  role: "Software Engineer",
  location: "Remote",

  // The statement headline, split across two lines.
  headlineLine1: "Reliable software,",
  headlineLine2: "engineered simply.",

  // One short supporting line under the headline.
  tagline:
    "A developer who cares about clean, dependable systems — and is always growing into the next thing.",

  // Short bio for the About section (2–4 sentences).
  about:
    "I'm Arkinov Jean — a software engineer who designs and builds fast, reliable web products end to end. Over the last few years I've shipped real platforms for businesses across Kazakhstan, from a bus-ticketing system to B2B and booking products. I care about clean architecture, simple UX, and shipping things that last.",

  email: "zhan@topmdhealth.com",

  // Drop your PDF at /public/cv.pdf (or change this path).
  resumeUrl: "/cv.pdf",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/municipalist" },
  // Add more when you have them, e.g.:
  // { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
];

/** What I work with right now (the longer roadmap lives in future_skills.md). */
export const now = ["Docker", "Python", "Nginx", "Git"];

/**
 * Selected work. Previews are auto-generated screenshots (WordPress mShots).
 * To use your own image instead, drop a file in /public and set `image`,
 * e.g. image: "/projects/beket.png".
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
    name: "Re-gix",
    url: "https://re-gix.tech/",
    blurb: "Technology product & platform.", // TODO: refine
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
    name: "Beket",
    url: "https://beket.kz/",
    blurb: "Intercity bus-ticket booking across Kazakhstan.",
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
  { group: "DevOps", items: ["Docker", "Nginx", "Git", "CI/CD"] },
];
