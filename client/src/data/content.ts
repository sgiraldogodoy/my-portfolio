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
  description: string; // short line shown on the card
  details?: string; // longer paragraph shown in the detail modal
  highlights?: string[]; // bullet points shown in the detail modal
  tech: string[];
  image?: string; // optional screenshot: put the file in client/public and use "/shot.png"
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "School Benchmarking Web App",
    description:
      "Cloud-hosted MERN app with secure logins and a comparative analytics dashboard, built with Osprey Software.",
    details:
      "A 5-person team prototype for Osprey Software: a private-school benchmarking platform running in the cloud. Private schools submit annual data through an improved UI and compare themselves against peers in their group or region — with enforced data access and privacy throughout.",
    highlights: [
      "Built the full app on the MERN stack (MongoDB, Express, React, Node) with TypeScript and Tailwind.",
      "Implemented secure logins and enforced data access/privacy controls.",
      "Designed a dashboard for comparative analyses across schools by group and region.",
    ],
    tech: ["React", "Node", "Express", "MongoDB", "TypeScript", "Tailwind"],
    liveUrl: "https://webware-c26-team-i-term-project.onrender.com/login",
    repoUrl: "https://github.com/sgiraldogodoy/Webware_C26_Term_Project",
    featured: true,
  },
  {
    title: "Vintage Movie Vault",
    description:
      "A secure MERN app where each user keeps a private, persistent movie collection behind JWT authentication.",
    details:
      "A full-stack web app for logging, editing, and deleting movies you've watched. Every user gets their own private collection stored in MongoDB, protected end-to-end by token-based auth — a compact demonstration of secure full-stack patterns.",
    highlights: [
      "JWT authentication with bcrypt-hashed credentials; tokens verified by Express middleware on every protected route.",
      "Ownership-enforced CRUD — users can only read or modify their own movies, so ownership can't be spoofed from the frontend.",
      "Component-based React (Vite) frontend with hooks; Express API serving the built client as a single Render web service.",
    ],
    tech: ["React", "Express", "MongoDB", "JWT", "Bootstrap"],
    liveUrl: "https://a4-sgiraldogodoy.onrender.com",
    repoUrl: "https://github.com/sgiraldogodoy/MovieVault",
  },
  {
    title: "AI for Impact: Inferring Suicidal Ideation",
    description:
      "Award-winning MQP: a Kotlin Multiplatform mental-health app with passive multi-modal smartphone sensing.",
    details:
      "My Major Qualifying Project (capstone), recipient of WPI's 2026 Data Science Outstanding MQP Award. Part of the NIH-supported LEMURS app — a cross-platform tool that passively collects smartphone data to flag suicide risk from behavioral patterns and support early intervention for students.",
    highlights: [
      "Re-architected a Kotlin Multiplatform app to ~80% shared Android/iOS code for maintainability and cross-platform parity.",
      "Built passive data collection (motion, app usage, Bluetooth, surveys) for multi-modal behavioral analysis.",
      "Machine-learning models reached 85.7% recall predicting suicide risk from screentime data.",
      "Ran exploratory data analysis and feature engineering to correlate digital behavior with self-reported ideation.",
    ],
    tech: ["Kotlin Multiplatform", "Machine Learning", "Mobile"],
    featured: true,
  },
  {
    title: "Hospital App Prototype (Brigham & Women's)",
    description:
      "Backend technical lead on a 10-person Agile team building hospital pathfinding, a map editor, and an EMR.",
    details:
      "A software-engineering studio project for Brigham & Women's Hospital. I led the backend subgroup, owning the data model and the API layer connecting frontend and backend.",
    highlights: [
      "Authored ~90% of the database schema (ERD + Prisma) and the tRPC routes.",
      "Built hospital pathfinding, a map editor, and a functional EMR input.",
      "Applied Agile methodologies and software design patterns across the team.",
    ],
    tech: ["React", "TypeScript", "tRPC", "Prisma", "PostgreSQL"],
  },
  {
    title: "Spreadsheet Application",
    description:
      "A full-stack spreadsheet engine (Spring Boot + React) with a custom formula parser and dependency tracking.",
    details:
      "A from-scratch spreadsheet built around clean architecture and classic design patterns, with a focus on correctness and extensibility.",
    highlights: [
      "Followed MVC to separate frontend, backend, and business logic.",
      "Custom expression parser using the Shunting Yard algorithm for arithmetic and aggregates (SUM, COUNT, AVE).",
      "Evaluation engine using Composite, Factory, and Observer patterns with cell/range references, dependency tracking, and circular-reference detection.",
      "Comprehensive JUnit tests covering parsing and edge cases.",
    ],
    tech: ["Java", "Spring Boot", "React", "Design Patterns"],
  },
  {
    title: "Traffic Sign Recognition (CNN)",
    description:
      "A custom CNN reaching 99.50% accuracy for traffic-sign classification, plus fine-tuned transfer models.",
    details:
      "A machine-learning project comparing a custom convolutional network against fine-tuned pretrained backbones for traffic-sign classification.",
    highlights: [
      "Custom CNN achieving 99.50% classification accuracy.",
      "Fine-tuned ResNet50 and VGG16 from 70% to 95%+ accuracy.",
      "Data preprocessing and augmentation to improve generalization.",
    ],
    tech: ["Python", "PyTorch", "Deep Learning"],
  },
  {
    title: "Robotic Manipulation System",
    description:
      "A vision-guided 4-DOF robotic arm in MATLAB performing autonomous pick-and-place sorting.",
    details:
      "Designed and programmed a 4-degree-of-freedom manipulator that detects, localizes, and sorts objects autonomously.",
    highlights: [
      "Forward and inverse kinematics for precise end-effector positioning in task space.",
      "Trajectory generation and velocity kinematics for smooth, continuous motion.",
      "Integrated computer vision (intrinsic & extrinsic calibration) to map image space to robot coordinates.",
    ],
    tech: ["MATLAB", "Robotics", "Computer Vision"],
  },
  {
    title: "Personal Website (from scratch)",
    description:
      "A hand-built personal site with semantic HTML, a custom palette, and a photography gallery — deployed on Render.",
    details:
      "An earlier personal website built without a framework, focused on web fundamentals and a clean deployment workflow.",
    highlights: [
      "Semantic HTML and a Flexbox navigation bar for accessible, well-structured markup.",
      "Custom color palette via CSS variables and a serif/sans-serif type pairing.",
      "Photography page with a form and a responsive CSS Grid image gallery; served by a Node/Express app on Render.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "Node.js"],
    liveUrl: "https://santiago-giraldo-godoy.onrender.com",
    repoUrl: "https://github.com/sgiraldogodoy/Personal-Page",
  },
];

export type Paper = {
  title: string;
  venue: string; // where it was written/published, e.g. "WPI Major Qualifying Project"
  date: string;
  description: string;
  authors?: string; // e.g. "S. Giraldo Godoy, et al."
  award?: string; // optional award/recognition line
  tags?: string[];
  pdfUrl?: string; // a PDF in client/public (e.g. "/papers/mqp.pdf") or an external link
  link?: string; // external link: DOI, repository, project page, etc.
};

export const papers: Paper[] = [
  {
    title: "AI for Impact: Inferring Suicidal Ideation via Smartphones",
    venue: "WPI Major Qualifying Project (Capstone) · advised by Prof. Elke Rundensteiner",
    date: "Aug 2025 — May 2026",
    authors:
      "S. Giraldo Godoy, J. Buwembo, E. Mastrangelo, J. Murphy, M. El Chalfoun, E. Li",
    description:
      "The NIH-supported LEMURS app passively collects smartphone signals (motion, app usage, Bluetooth, surveys) to infer suicide risk from behavioral patterns. Machine-learning models reached 85.7% recall predicting risk from screentime data, with the goal of enabling early intervention for students on both Android and iOS.",
    award: "WPI 2026 Data Science Outstanding MQP Award",
    tags: ["Machine Learning", "Digital Health", "Mobile Sensing"],
    link: "https://digital.wpi.edu/concern/student_works/hx11xk99f",
  },
  {
    title: "Digital Tools for Making and Monitoring of Hawaiian Seed Gardens",
    venue: "Punawai, Vol. 1 — WPI Hawaiʻi Project Center",
    date: "Aug 2025 — Mar 2025",
    authors: "K. Brown, J. De La Cruz, S. Giraldo, P. Gupta, S. Wiernik",
    description:
      "In collaboration with Protect and Preserve Hawaiʻi, we built digital tools to promote rain-garden adoption for stormwater management and ecosystem restoration in the Ala Wai Watershed: an Augmented Reality visualization tool, an ArcGIS StoryMap for outreach, and SeedSync, a platform for garden monitoring — designed from homeowner surveys and volunteer consultations.",
    tags: ["Augmented Reality", "GIS", "Web Tools", "Sustainability"],
    pdfUrl: "https://wp.wpi.edu/hawaii/files/2025/05/Punawai-Vol-1.pdf#page=55",
    link: "https://wp.wpi.edu/hawaii/digital-tools-for-making-and-monitoring-of-hawaiian-seed-gardens/",
  },
  // Add more papers here following the same shape.
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
