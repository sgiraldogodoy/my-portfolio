// =============================================================================
//  EDIT THIS FILE TO MAKE THE SITE YOURS.
//  Everything the visitor sees (and most of what the AI assistant knows) comes
//  from here. No other file needs to change to update your content.
// =============================================================================

export const profile = {
  name: "Santiago Giraldo Godoy",
  role: "Secure Full-Stack & Web Developer",
  tagline:
    "I build secure, AI-powered web applications end-to-end — from polished React frontends to robust Node & cloud backends.",
  location: "Worcester, MA, USA",
  email: "sgiraldog@gmail.com",
  phone: "+1 (774) 253-0905",
  available: true, // shows an "available for work" badge
  socials: {
    github: "https://github.com/sgiraldog18",
    linkedin: "https://www.linkedin.com/in/santiagogiraldog",
    twitter: "",
  },
  // Path to your resume in client/public — drop your PDF there.
  resumeUrl: "/resume.pdf",
};

export const about = {
  // Written in first person — also fed to the AI assistant as context.
  paragraphs: [
    "I'm a Computer Science graduate from Worcester Polytechnic Institute (High Distinction, 3.83 GPA, minor in Robotics Engineering), specializing in secure full-stack web development. I work across the MERN stack — MongoDB, Express, React, and Node — with TypeScript end to end.",
    "I pair that with hands-on AI experience: at Oracle I raised AI-agent response quality through prompt engineering and Retrieval-Augmented Generation, and I've trained deep-learning models and built fast data pipelines. I build software that's not just functional but secure and privacy-conscious — from authentication and access control to protecting sensitive user data.",
    "I'm available for freelance work: secure full-stack web apps, MERN MVPs, API development, and AI-powered features.",
  ],
};

export type Skill = { name: string; level: number /* 0-100 */ };

export const skills: { category: string; items: Skill[] }[] = [
  {
    category: "Frontend",
    items: [
      { name: "React.js / TypeScript", level: 90 },
      { name: "Tailwind & Shadcn UI", level: 85 },
      { name: "Responsive UI / UX", level: 80 },
    ],
  },
  {
    category: "Backend & Data",
    items: [
      { name: "Node.js / Express", level: 88 },
      { name: "MongoDB & PostgreSQL", level: 82 },
      { name: "REST / tRPC APIs", level: 80 },
    ],
  },
  {
    category: "AI / Machine Learning",
    items: [
      { name: "RAG & AI Agents", level: 85 },
      { name: "Prompt Engineering", level: 85 },
      { name: "PyTorch / CNNs", level: 78 },
    ],
  },
  {
    category: "Security & Practices",
    items: [
      { name: "Secure Auth & JWT", level: 80 },
      { name: "Data Privacy & Access Control", level: 78 },
      { name: "Agile · OOD · Design Patterns", level: 85 },
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
    title: "School Benchmarking Web App",
    description:
      "A cloud-hosted MERN application built with Osprey Software: secure logins, enforced data access and privacy, and a dashboard for comparing private schools' annual data against peers in their group or region.",
    tech: ["React", "Node", "Express", "MongoDB", "TypeScript", "Tailwind"],
    featured: true,
  },
  {
    title: "AI for Impact: Inferring Suicidal Ideation",
    description:
      "Award-winning MQP (WPI's 2026 Data Science Outstanding MQP Award). Re-architected a Kotlin Multiplatform mental-health app to ~80% shared iOS/Android code and built passive multi-modal smartphone data collection for an active medical research trial.",
    tech: ["Kotlin Multiplatform", "Data Science", "Mobile"],
    featured: true,
  },
  {
    title: "Hospital App Prototype (Brigham & Women's)",
    description:
      "Backend technical lead on a 10-person Agile team. Built hospital pathfinding, a map editor, and an EMR with React, TypeScript, Shadcn UI, Express, Prisma, and PostgreSQL — authoring ~90% of the schema and the tRPC routes.",
    tech: ["React", "TypeScript", "tRPC", "Prisma", "PostgreSQL"],
  },
  {
    title: "Traffic Sign Recognition (CNN)",
    description:
      "A custom convolutional neural network for traffic-sign classification reaching 99.50% accuracy, plus fine-tuned ResNet50 / VGG16 models improved from 70% to 95%+ through data augmentation and hyperparameter tuning.",
    tech: ["Python", "PyTorch", "Deep Learning"],
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
    role: "Software Engineer Intern",
    org: "Oracle",
    period: "May 2025 — Aug 2025",
    points: [
      "Improved AI-agent response quality via prompt engineering and Retrieval-Augmented Generation (RAG) workflows, raising human-like response rates by 50%.",
      "Re-engineered data unification across sources with SQL and Java endpoints, cutting per-entry migration from 6s to 0.2s (≈97% faster).",
      "Built Java endpoints for data filtration, error handling, storage, and retrieval, improving accuracy by 25%.",
    ],
  },
  {
    role: "AI Project Worker",
    org: "Worcester Polytechnic Institute",
    period: "Jan 2023 — Dec 2024",
    points: [
      "Trained machine-vision models on 300+ images/week to enhance the AI's recognition capabilities.",
      "Built AI software safeguarding 5th-grade students' confidential information, ensuring data privacy for 1,000+ students.",
    ],
  },
  {
    role: "Chief Operating Officer",
    org: "Universal Education Initiative (UEI)",
    period: "Sep 2023 — Sep 2024",
    points: [
      "Coordinated 5 teams and day-to-day operations, improving operational efficiency and goal alignment.",
      "Set timelines, roles, and objectives, and produced biweekly performance reports for the CEO to guide strategic decisions.",
    ],
  },
];
