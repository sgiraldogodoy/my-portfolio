// =============================================================================
//  EDIT THIS FILE TO MAKE THE SITE YOURS.
//  Everything the visitor sees (and most of what the AI assistant knows) comes
//  from here. No other file needs to change to update your content.
// =============================================================================

export const profile = {
  name: "Your Name",
  role: "Secure Full-Stack & Web Developer",
  tagline:
    "I build fast, secure web applications end-to-end — from React frontends to hardened Node APIs on AWS.",
  location: "City, Country",
  email: "you@example.com",
  available: true, // shows an "available for work" badge
  socials: {
    github: "https://github.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
    twitter: "",
  },
  // Path to your resume in client/public — drop your PDF there.
  resumeUrl: "/resume.pdf",
};

export const about = {
  // Written in first person — also fed to the AI assistant as context.
  paragraphs: [
    "I'm a full-stack developer specializing in secure web applications. I work across the stack with React, Node/Express, and MongoDB, and I deploy on AWS.",
    "Security isn't an afterthought in my work — I bake in input validation, authentication, rate limiting, and least-privilege infrastructure from day one.",
    "Available for freelance projects: MVPs, internal tools, API development, and security hardening of existing apps.",
  ],
};

export type Skill = { name: string; level: number /* 0-100 */ };

export const skills: { category: string; items: Skill[] }[] = [
  {
    category: "Frontend",
    items: [
      { name: "React / TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Accessibility & UX", level: 75 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js / Express", level: 88 },
      { name: "MongoDB", level: 80 },
      { name: "REST / API design", level: 85 },
    ],
  },
  {
    category: "Security & DevOps",
    items: [
      { name: "AppSec (OWASP Top 10)", level: 80 },
      { name: "AWS", level: 75 },
      { name: "CI/CD & Docker", level: 75 },
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Example SaaS Dashboard",
    description:
      "A multi-tenant analytics dashboard with role-based access control and audit logging.",
    tech: ["React", "Node", "MongoDB", "AWS"],
    liveUrl: "",
    repoUrl: "",
    featured: true,
  },
  {
    title: "Secure Auth Starter",
    description:
      "An open-source authentication boilerplate: JWT rotation, rate limiting, and OWASP-aligned defaults.",
    tech: ["Express", "JWT", "Zod"],
    repoUrl: "",
  },
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Self-employed",
    period: "2023 — Present",
    points: [
      "Delivered secure web applications for clients across multiple industries.",
      "Designed and deployed MERN apps on AWS with CI/CD pipelines.",
    ],
  },
];
