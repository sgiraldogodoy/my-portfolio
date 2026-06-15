# Portfolio — Secure Full-Stack Developer

A creative, animated portfolio with a contact form, downloadable resume, and an
**AI assistant** that answers questions about you. Built as a **MERN** monorepo
and designed to deploy on **AWS**.

```
portfolio/
├── client/   # React 19 + Vite + TypeScript + Tailwind v4 + Framer Motion
└── server/   # Express + Mongoose (MongoDB) + Claude AI + security middleware
```

---

## 1. Run it locally

Prereqs: Node 20+ (you have 24) and npm.

```bash
# from the repo root — installs both workspaces
npm install

# create your env files
cp server/.env.example server/.env      # then edit values (see below)
cp client/.env.example client/.env.local

# start client (5173) + server (4000) together
npm run dev
```

Open http://localhost:5173. The site runs **without** a database or API key —
the contact form logs to the console and the chat widget reports the assistant
is "not configured" until you add a key. Add them when ready:

| Variable             | Where           | What it does                                  |
| -------------------- | --------------- | --------------------------------------------- |
| `MONGODB_URI`        | `server/.env`   | Persists contact messages (MongoDB Atlas).    |
| `ANTHROPIC_API_KEY`  | `server/.env`   | Enables the Claude-powered AI assistant.      |
| `CORS_ORIGIN`        | `server/.env`   | Frontend origin(s) allowed to call the API.   |
| `VITE_API_URL`       | `client/.env.local` | Backend URL in production builds.         |

---

## 2. Make it yours

| To change…            | Edit…                                             |
| --------------------- | ------------------------------------------------- |
| Your name, bio, links, projects, skills, experience | `client/src/data/content.ts` |
| What the AI knows about you | `server/src/data/knowledge.ts` (keep in sync) |
| Your resume PDF       | drop `resume.pdf` into `client/public/`           |
| Colors / theme        | the `@theme` block in `client/src/index.css`      |

---

## 3. Security (your selling point)

The backend already includes: `helmet` (secure headers), `cors` (origin
allow-list), `express-rate-limit` (global + stricter on the AI route), `zod`
input validation, a JSON body-size cap, secrets via env vars, and a non-root
Docker user. The Claude API key lives **only** on the server — never shipped to
the browser. See [`server/src/app.ts`](server/src/app.ts).

---

## 4. Deploy to AWS (managed & simple)

**Database — MongoDB Atlas**
1. Create a free M0 cluster at mongodb.com/atlas.
2. Add a database user + allow your backend's IP (or 0.0.0.0/0 to start).
3. Copy the connection string into the backend's `MONGODB_URI`.

**Backend — AWS App Runner** (containerized)
1. Push this repo to GitHub.
2. App Runner → Create service → from source or from the `server/Dockerfile`.
3. Set env vars (`MONGODB_URI`, `ANTHROPIC_API_KEY`, `CORS_ORIGIN`=your frontend URL).
4. Note the service URL (e.g. `https://xxx.awsapprunner.com`).

**Frontend — AWS Amplify Hosting**
1. Amplify → Host web app → connect the GitHub repo.
2. Build settings: base directory `client`, build `npm run build`, output `client/dist`.
3. Add env var `VITE_API_URL` = your App Runner URL.
4. Update the backend's `CORS_ORIGIN` to the Amplify domain.

**CI/CD** — both Amplify and App Runner auto-deploy on push to `main`. A
`.github/workflows/` pipeline for tests/linting is a great next step.

---

## 5. Roadmap / next steps

- [ ] Add your real content, resume PDF, and project screenshots
- [ ] Email notifications on contact (AWS SES) — see TODO in `routes/contact.ts`
- [ ] Upgrade AI retrieval to semantic search (Voyage AI embeddings) — see `services/retrieval.ts`
- [ ] Add a GitHub Actions workflow (lint + typecheck + build)
- [ ] Custom domain + HTTPS (Route 53 / Amplify domains)
- [ ] Analytics + SEO meta/OpenGraph tags
