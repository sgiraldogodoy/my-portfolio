// =============================================================================
//  EDIT THIS FILE TO MAKE THE SITE YOURS.
//  Everything the visitor sees (and most of what the AI assistant knows) comes
//  from here. No other file needs to change to update your content.
// =============================================================================

export const profile = {
  name: "Santiago Giraldo Godoy",
  role: "Secure Full-Stack & Web Developer",
  tagline:
    "I build secure, AI-powered web apps from start to finish, from polished React frontends to solid Node and cloud backends.",
  location: "Worcester, MA, USA",
  email: "sgiraldog@gmail.com",
  phone: "+1 (774) 253-0905",
  available: true, // shows an "available for work" badge
  socials: {
    github: "https://github.com/sgiraldogodoy",
    linkedin: "https://www.linkedin.com/in/santiagogiraldog",
    twitter: "",
  },
  // Path to your resume in client/public. Drop your PDF there.
  resumeUrl: "/resume.pdf",
};

export const about = {
  // Written in first person. This also gives the AI assistant context.
  paragraphs: [
    "I'm a Computer Science graduate from Worcester Polytechnic Institute, where I earned High Distinction with a 3.83 GPA and a minor in Robotics Engineering. I focus on secure full-stack web development, working across the MERN stack (MongoDB, Express, React, and Node) with TypeScript throughout.",
    "I also really enjoy building with AI. At Oracle I improved an AI agent's responses through prompt engineering and Retrieval-Augmented Generation, and along the way I've trained deep-learning models and built fast data pipelines. Whatever I'm working on, I keep it secure and privacy-conscious, from authentication and access control to protecting sensitive user data.",
    "I'm available for freelance work, whether that's a secure full-stack web app, a quick MERN MVP, API development, or adding AI features to a product you already have.",
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
      { name: "Agile, OOD, Design Patterns", level: 85 },
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
  videoUrl?: string; // optional demo video (shows a "Watch demo" link)
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "AI for Impact: Inferring Suicidal Ideation",
    description:
        "An award-winning capstone: a Kotlin Multiplatform mental-health app with passive smartphone sensing.",
    details:
        "My Major Qualifying Project (capstone), which earned WPI's 2026 Data Science Outstanding MQP Award. It's part of the NIH-supported LEMURS app, a cross-platform tool that passively collects smartphone data to flag suicide risk from behavioral patterns and help students get support sooner.",
    highlights: [
      "Re-architected a Kotlin Multiplatform app to share about 80% of its code across Android and iOS for easier maintenance and parity.",
      "Built passive data collection (motion, app usage, Bluetooth, and surveys) for multi-modal behavioral analysis.",
      "Helped get machine-learning models to 85.7% recall when predicting suicide risk from screentime data.",
      "Ran exploratory data analysis and feature engineering to connect digital behavior with self-reported ideation.",
    ],
    tech: ["Kotlin Multiplatform", "Machine Learning", "Mobile"],
    liveUrl: "https://apps.apple.com/us/app/wpi-lemurs/id6759763937",
    repoUrl: "https://github.com/sgiraldogodoy/lemurs-kmp-app",
    featured: true,
  },
  {
    title: "School Benchmarking Web App",
    description:
      "A cloud-hosted MERN app with secure logins and a comparative analytics dashboard, built with Osprey Software.",
    details:
      "A five-person team prototype for Osprey Software: a private-school benchmarking platform that runs in the cloud. Schools enter their annual data through a clean interface and see how they compare to peers in their group or region, with data access and privacy enforced the whole way through.",
    highlights: [
      "Built the full app on the MERN stack (MongoDB, Express, React, Node) with TypeScript and Tailwind.",
      "Implemented secure logins along with enforced data access and privacy controls.",
      "Designed a dashboard for comparing schools by group and region.",
    ],
    tech: ["React", "Node", "Express", "MongoDB", "TypeScript", "Tailwind"],
    liveUrl: "https://webware-c26-team-i-term-project.onrender.com/login",
    repoUrl: "https://github.com/sgiraldogodoy/Webware_C26_Term_Project",
    featured: true,
  },
  {
    title: "Vintage Movie Vault",
    description:
      "A secure MERN app where every user keeps a private, persistent movie collection behind JWT authentication.",
    details:
      "A full-stack app for logging, editing, and deleting the movies you've watched. Each user gets their own private collection stored in MongoDB, protected end to end by token-based auth. It's a compact showcase of secure full-stack patterns.",
    highlights: [
      "JWT authentication with bcrypt-hashed credentials, verified by Express middleware on every protected route.",
      "Ownership-enforced CRUD, so users can only touch their own movies and ownership can't be faked from the frontend.",
      "Component-based React (Vite) frontend with hooks, plus an Express API that serves the built client as a single Render web service.",
    ],
    tech: ["React", "Express", "MongoDB", "JWT", "Bootstrap"],
    liveUrl: "https://a4-sgiraldogodoy.onrender.com",
    repoUrl: "https://github.com/sgiraldogodoy/movieVault",
  },
  {
    title: "Hospital App Prototype (Brigham & Women's)",
    description:
      "Backend technical lead on a 10-person Agile team building hospital pathfinding, a map editor, and an EMR.",
    details:
      "A software-engineering studio project for Brigham and Women's Hospital. I led the backend subgroup and owned the data model along with the API layer that connects the frontend and backend.",
    highlights: [
      "Wrote about 90% of the database schema (ERD and Prisma) and the tRPC routes.",
      "Built hospital pathfinding, a map editor, and a working EMR input.",
      "Applied Agile methods and software design patterns across the team.",
    ],
    tech: ["React", "TypeScript", "tRPC", "Prisma", "PostgreSQL"],
    repoUrl: "https://github.com/sgiraldogodoy/Soft-Eng-App",
  },
  {
    title: "Spreadsheet Application",
    description:
      "A full-stack spreadsheet engine (Spring Boot and React) with a custom formula parser and dependency tracking.",
    details:
      "A spreadsheet built from scratch around clean architecture and classic design patterns, with a focus on getting the details right and keeping it easy to extend.",
    highlights: [
      "Followed MVC to keep the frontend, backend, and business logic separate.",
      "Custom expression parser using the Shunting Yard algorithm for arithmetic and aggregates (SUM, COUNT, AVE).",
      "Evaluation engine built with the Composite, Factory, and Observer patterns, supporting cell and range references, dependency tracking, and circular-reference detection.",
      "Thorough JUnit tests covering parsing logic and edge cases.",
    ],
    tech: ["Java", "Spring Boot", "React", "Design Patterns"],
    repoUrl: "https://github.com/sgiraldogodoy/spreadsheetApp",
  },
  {
    title: "Traffic Sign Recognition (CNN)",
    description:
      "A custom CNN that reaches 99.50% accuracy on traffic-sign classification, plus fine-tuned transfer models.",
    details:
      "A machine-learning project that puts a custom convolutional network up against fine-tuned pretrained models for classifying traffic signs.",
    highlights: [
      "Custom CNN reaching 99.50% classification accuracy.",
      "Fine-tuned ResNet50 and VGG16 from 70% up to 95% and higher.",
      "Data preprocessing and augmentation to help the models generalize.",
    ],
    tech: ["Python", "PyTorch", "Deep Learning"],
  },
  {
    title: "Robotic Manipulation System",
    description:
      "A vision-guided 4-DOF robotic arm in MATLAB that sorts objects on its own.",
    details:
      "I designed and programmed a four-degree-of-freedom manipulator that detects, locates, and sorts objects autonomously.",
    highlights: [
      "Forward and inverse kinematics for precise end-effector positioning.",
      "Trajectory generation and velocity kinematics for smooth, continuous motion.",
      "Computer vision, with intrinsic and extrinsic calibration, to map what the camera sees into robot coordinates.",
    ],
    tech: ["MATLAB", "Robotics", "Computer Vision"],
    repoUrl: "https://github.com/sgiraldogodoy/RBE3001",
    videoUrl: "https://drive.google.com/file/d/1K2bYxy8yyqGpD3NZKcGv09LNBELLAxYI/view",
  },
  {
    title: "Hawaiian Seed Gardens Digital Tools",
    description:
      "AR, GIS, and web tools that encourage rain-garden adoption for stormwater management, made with Protect and Preserve Hawaiʻi.",
    details:
      "A project for Protect and Preserve Hawaiʻi (PPH) supporting ecosystem restoration in the Ala Wai Watershed. We shaped the tools around homeowner surveys and volunteer conversations to make rain gardens easier and more appealing to adopt. It was published in Punawai, Vol. 1 (see the Papers section).",
    highlights: [
      "Built an augmented reality tool to preview rain-garden designs right where they would go.",
      "Created an ArcGIS StoryMap for education and community outreach.",
      "Developed SeedSync, a platform for tracking and monitoring garden conditions.",
    ],
    tech: ["Augmented Reality", "ArcGIS / GIS", "Web"],
    liveUrl: "https://www.protectpreservehi.org/satellite-rain-garden-initiative",
    repoUrl: "https://github.com/sgiraldogodoy/pphar",
  },
  {
    title: "Personal Website (from scratch)",
    description:
      "A hand-built personal site with semantic HTML, a custom palette, and a photography gallery, deployed on Render.",
    details:
      "An earlier personal site built without any framework, focused on web fundamentals and a clean deployment workflow.",
    highlights: [
      "Semantic HTML and a Flexbox navigation bar for accessible, well-structured markup.",
      "Custom color palette with CSS variables and a serif and sans-serif type pairing.",
      "A photography page with a form and a responsive CSS Grid gallery, served by a Node and Express app on Render.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "Node.js"],
    liveUrl: "https://santiago-giraldo-godoy.onrender.com",
    repoUrl: "https://github.com/sgiraldogodoy/photography",
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
    venue: "WPI Major Qualifying Project (Capstone), advised by Prof. Elke Rundensteiner",
    date: "Aug 2025 - May 2026",
    authors:
      "S. Giraldo Godoy, J. Buwembo, E. Mastrangelo, J. Murphy, M. El Chalfoun, E. Li",
    description:
      "The NIH-supported LEMURS app passively collects smartphone signals (motion, app usage, Bluetooth, and surveys) to infer suicide risk from behavioral patterns. The team's machine-learning models reached 85.7% recall predicting risk from screentime data, with the goal of helping students get support sooner on both Android and iOS.",
    award: "WPI 2026 Data Science Outstanding MQP Award",
    tags: ["Machine Learning", "Digital Health", "Mobile Sensing"],
    link: "https://digital.wpi.edu/concern/student_works/hx11xk99f",
  },
  {
    title: "Digital Tools for Making and Monitoring of Hawaiian Seed Gardens",
    venue: "Punawai, Vol. 1, WPI Hawaiʻi Project Center",
    date: "Jan 2025 - Mar 2025",
    authors: "K. Brown, J. De La Cruz, S. Giraldo, P. Gupta, S. Wiernik",
    description:
      "Working with Protect and Preserve Hawaiʻi, we built digital tools to encourage rain-garden adoption for stormwater management and ecosystem restoration in the Ala Wai Watershed: an augmented reality visualization tool, an ArcGIS StoryMap for outreach, and SeedSync, a platform for garden monitoring. We shaped the design around homeowner surveys and volunteer conversations.",
    tags: ["Augmented Reality", "GIS", "Web Tools", "Sustainability"],
    pdfUrl: "https://wp.wpi.edu/hawaii/files/2025/05/Punawai-Vol-1.pdf#page=55",
    link: "https://wp.wpi.edu/hawaii/digital-tools-for-making-and-monitoring-of-hawaiian-seed-gardens/",
  },
  {
    title: "Robotic Manipulation: A Vision-Guided 4-DOF Manipulator",
    venue: "WPI RBE 3001, Unified Robotics III",
    date: "Aug 2025 - Oct 2025",
    description:
      "A technical report on designing and programming a 4-DOF robotic manipulator with forward and inverse kinematics, trajectory generation, and computer vision for autonomous pick-and-place sorting. A demo video goes along with the report.",
    tags: ["Robotics", "Kinematics", "Computer Vision"],
    pdfUrl:
      "https://docs.google.com/document/d/1wSgJTY_EX0tSnPjlOE8QADEPLxz5poUZT6myrqJQp3g/edit?usp=sharing",
    link: "https://drive.google.com/file/d/1K2bYxy8yyqGpD3NZKcGv09LNBELLAxYI/view",
  },
  // Add more papers here following the same shape.
];

export type Experience = {
  role: string;
  org: string;
  period: string; // human-readable label
  start: string; // "YYYY-MM" — used to place/size the timeline bar
  end: string; // "YYYY-MM"
  points: string[];
  highlight?: boolean;
};

// Listed most recent first.
export const experience: Experience[] = [
  {
    role: "Residential Advisor",
    org: "WPI Housing & Residential Services",
    period: "Aug 2024 - May 2026",
    start: "2024-08",
    end: "2026-05",
    points: [
      "Built a welcoming, inclusive community by running events, mediating conflicts, and supporting residents.",
      "Kept residents safe by responding to crises and documenting incidents during on-call shifts.",
      "Worked with Residential Services staff on programming, move-ins and move-outs, and health and safety checks.",
    ],
  },
  {
    role: "Peer Tutor",
    org: "WPI Academic Resource Center",
    period: "Aug 2023 - May 2026",
    start: "2023-08",
    end: "2026-05",
    points: [
      "Helped students become independent learners by breaking down tough concepts in C++ and Java.",
      "Reinforced material from 10 courses, including calculus and computer science, with about 25% of students coming back for more sessions.",
    ],
  },
  {
    role: "Peer Learning Assistant",
    org: "WPI Physics Department",
    period: "Aug 2023 - Present",
    start: "2023-08",
    end: "2026-05",
    points: [
      "Assisted physics professors in labs by teaching, guiding, explaining concepts, and grading, which improved student understanding and lab performance.",
      "Guided students through physics labs using LoggerPro, circuit boards, capacitors, and inductors, strengthening their practical skills and grasp of the concepts.",
      "Graded lab reports against a detailed rubric to give consistent evaluation and feedback that helped students improve their work.",
    ],
  },
  {
    role: "Software Engineer Intern",
    org: "Oracle",
    period: "May 2025 - Aug 2025",
    start: "2025-05",
    end: "2025-08",
    points: [
      "Boosted an AI agent's response quality with prompt engineering and Retrieval-Augmented Generation, lifting human-like response rates by 50%.",
      "Rebuilt how data was unified across sources using SQL and Java endpoints, cutting migration from 6 seconds to 0.2 seconds per entry (about 97% faster).",
      "Wrote Java endpoints for data filtering, error handling, and storage that improved accuracy by 25%.",
      "Helped ship a beta troubleshooting agent aimed at cutting expert workload and resource use by 60%.",
    ],
    highlight: true,
  },
  {
    role: "AI Project Worker",
    org: "Worcester Polytechnic Institute",
    period: "Jan 2023 - Dec 2024",
    start: "2023-01",
    end: "2024-12",
    points: [
      "Trained machine-vision models on 300+ images a week to sharpen the AI's recognition.",
      "Built AI software that protected confidential information for more than 1,000 fifth-grade students.",
    ],
  },
  {
    role: "Chief Operating Officer",
    org: "Universal Education Initiative (UEI)",
    period: "Sep 2023 - Sep 2024",
    start: "2023-09",
    end: "2024-09",
    points: [
      "Ran day-to-day operations and kept five teams in sync, which improved overall efficiency.",
      "Set timelines, roles, and company objectives to align everyone around shared goals.",
      "Tracked team performance and wrote biweekly reports for the CEO to support decision-making.",
    ],
  },
  {
    role: "Lead Instructor",
    org: "iDTech (Bentley Camp)",
    period: "Jun 2024 - Jul 2024",
    start: "2024-06",
    end: "2024-07",
    points: [
      "Taught 80+ students across seven week-long classes how to design, build, program, and pilot VEX V5 battle bots.",
      "Led a team of 10 instructors, keeping things running smoothly for 800+ campers aged 7 to 17.",
      "Handled medical situations in the health director's absence, administering medication safely.",
    ],
  },
];
