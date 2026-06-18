// Full tech stack, grouped by category. Drives the tech-stack showcase options.
export type TechCategory = { key: string; label: string; items: string[] };

export const techStack: TechCategory[] = [
  {
    key: "frontend",
    label: "Frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Bootstrap", "HTML", "CSS"],
  },
  {
    key: "backend",
    label: "Backend & Data",
    items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Prisma", "tRPC", "REST APIs", "JWT"],
  },
  {
    key: "ai",
    label: "AI / ML",
    items: ["PyTorch", "Deep Learning", "CNNs", "RAG", "AI Agents", "Prompt Engineering"],
  },
  {
    key: "languages",
    label: "Languages",
    items: ["Java", "Python", "JavaScript", "C++", "C", "Kotlin", "Swift", "SQL"],
  },
  {
    key: "tools",
    label: "Tools & DevOps",
    items: ["Git", "GitHub", "Docker", "AWS", "VS Code", "IntelliJ", "MATLAB", "Agile / Scrum"],
  },
];

// Flat list (handy for the marquee and galaxy).
export const allTech: { name: string; category: string }[] = techStack.flatMap((c) =>
  c.items.map((name) => ({ name, category: c.label })),
);
