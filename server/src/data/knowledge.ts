// =============================================================================
//  KNOWLEDGE BASE FOR THE AI ASSISTANT
//  These are the facts the assistant is allowed to use when answering questions
//  about you. Keep each entry to one focused topic — retrieval works best with
//  small, self-contained chunks. Add as many as you like.
// =============================================================================

export const knowledge: string[] = [
  // --- Identity & contact ---
  "Name: Santiago Giraldo Godoy. Role: Secure Full-Stack & Web Developer, available for freelance work.",
  "Location: Worcester, Massachusetts, USA. Contact email: sgiraldog@gmail.com. Phone: +1 (774) 253-0905. LinkedIn: linkedin.com/in/santiagogiraldog. GitHub: github.com/sgiraldog18.",
  "Summary: Computer Science graduate specializing in secure full-stack web development across the MERN stack (MongoDB, Express, React, Node) with TypeScript, plus strong AI/ML experience (RAG, AI agents, deep learning).",

  // --- Education ---
  "Education: Bachelor of Science in Computer Science with a minor in Robotics Engineering from Worcester Polytechnic Institute (WPI), graduating May 2026. Graduated with High Distinction, GPA 3.83/4.0, and is a member of the Upsilon Pi Epsilon (UPE) computer science honor society.",
  "Award: Recipient of WPI's 2026 Data Science Outstanding MQP Award for the project 'AI for Impact: Inferring Suicidal Ideation via Smartphones'.",

  // --- Skills ---
  "Programming languages: Java, TypeScript, C++, C, JavaScript, Python, Kotlin, Swift, HTML, CSS, PL/SQL, PostgreSQL.",
  "Frontend skills: React.js, TypeScript, Tailwind CSS, Shadcn UI, Bootstrap, responsive UI/UX.",
  "Backend & data skills: Node.js, Express, MongoDB, PostgreSQL, JWT auth, REST APIs, tRPC, Prisma ORM, the MERN stack.",
  "AI / Machine Learning skills: PyTorch, deep learning, CNNs, model training, prompt engineering, Retrieval-Augmented Generation (RAG), and AI agents.",
  "Engineering practices: Agile development, Scrum, object-oriented design, and design patterns. Tools: Git, GitHub, VS Code, WebStorm, IntelliJ, Android Studio, Unix command line.",
  "Languages spoken: Spanish (native) and English (bilingual proficiency).",
  "Services offered to freelance clients: secure full-stack web apps, MERN MVPs, API development, AI-powered features, and security/privacy hardening.",

  // --- Experience ---
  "Experience — Software Engineer Intern at Oracle (Redwood Shores, May 2025–Aug 2025): improved AI-agent response quality through prompt engineering and RAG, raising human-like response rates by 50%; optimized data unification with SQL and Java endpoints, cutting migration from 6s to 0.2s per entry (~97% faster); built Java endpoints for data filtration, error handling, and storage, improving accuracy by 25%.",
  "Experience — AI Project Worker at WPI (Jan 2023–Dec 2024): trained machine-vision models on 300+ images per week; built AI software safeguarding 5th-grade students' confidential information, ensuring data privacy for over 1,000 students.",
  "Experience — Chief Operating Officer at Universal Education Initiative (UEI) (Worcester, Sep 2023–Sep 2024): coordinated 5 teams and daily operations, set timelines/roles/objectives, and produced biweekly performance reports for the CEO.",
  "Experience — Peer Tutor at WPI Academic Resource Center (Aug 2023–May 2026): tutored students across 10 courses including calculus and computer science (C++ and Java); 25% of students returned for additional support.",
  "Experience — Residential Advisor at WPI Housing & Residential Services (Aug 2024–May 2026): built inclusive community through events and mediation, responded to crises, and handled health-and-safety and administrative duties.",
  "Experience — Lead Instructor at iDTech Bentley Camp (Waltham, Jun 2024–Jul 2024): taught 80+ students to build and program VEX V5 battle bots and managed a team of 10 instructors serving 800+ students.",

  // --- Projects ---
  "Project — School Benchmarking Web App (with Osprey Software, 2026): a cloud-hosted MERN app (MongoDB, Express, React, Node, TypeScript, Tailwind) with secure logins, enforced data access and privacy, and a dashboard for private schools to compare annual data against peers in their group or region.",
  "Project — AI for Impact: Inferring Suicidal Ideation via Smartphones (WPI MQP, 2025–2026, award-winning): re-architected a Kotlin Multiplatform mental-health app to ~80% shared iOS/Android code; implemented passive multi-modal smartphone data collection (motion, app usage, Bluetooth, surveys) for an active medical research trial; performed exploratory data analysis and feature engineering.",
  "Project — Hospital App Prototype for Brigham & Women's Hospital (WPI, 2024): backend technical lead on a 10-person Agile team; built hospital pathfinding, a map editor, and an EMR using React, TypeScript, Shadcn UI, Express, Prisma, and PostgreSQL; authored ~90% of the schema and the tRPC routes connecting frontend and backend.",
  "Project — Spreadsheet Application (WPI, 2026): full-stack app in Java (Spring Boot) and React using the MVC pattern; custom expression parser via the Shunting Yard algorithm, an evaluation engine using Composite/Factory/Observer patterns, cell/range references with dependency tracking and circular-reference detection, validated with JUnit tests.",
  "Project — Traffic Sign Recognition Models (WPI, 2024): a custom CNN reaching 99.50% accuracy; fine-tuned ResNet50 and VGG16 from 70% to 95%+ via data preprocessing, augmentation, and hyperparameter tuning.",
  "Project — Robotic Manipulation System (WPI, 2025): programmed a 4-DOF robotic manipulator in MATLAB with forward/inverse kinematics, trajectory generation, and computer vision for a vision-guided pick-and-place sorting system.",
  "Project — Computer Networks (WPI, 2023): implemented a TCP-based HTTP/1.1 client and server in C/C++ with Unix sockets, a reliable data-transfer protocol (Alternating Bit Protocol), and a distributed distance-vector routing algorithm.",

  // --- Publications / papers ---
  "Publication — 'AI for Impact: Inferring Suicidal Ideation via Smartphones' (WPI Major Qualifying Project / capstone, 2025–2026): Santiago's award-winning capstone thesis (WPI 2026 Data Science Outstanding MQP Award).",
  "Publication — 'Digital Tools for Making and Monitoring of Hawaiian Seed Gardens', published in Punawai, Vol. 1 (WPI Hawaiʻi Project Center, May 2025). Co-authored by Kyra Brown, Jeremy De La Cruz, Santiago Giraldo, Pranav Gupta, and Skyler Wiernik. In collaboration with Protect and Preserve Hawaiʻi (PPH), the team built an Augmented Reality visualization tool, an ArcGIS StoryMap, and SeedSync (a garden-monitoring platform) to promote rain-garden adoption for stormwater management in the Ala Wai Watershed. Read at https://wp.wpi.edu/hawaii/files/2025/05/Punawai-Vol-1.pdf#page=55",
];
