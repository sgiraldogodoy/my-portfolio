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

## 4. Deploy (free stack: Amplify + Render + Atlas + SES)

Frontend on **AWS Amplify** (static, CDN), backend on **Render Free**, database on
**MongoDB Atlas**, contact email via **AWS SES**. Total cost: $0. (Render Free
sleeps after 15 min idle; the frontend warms it via `/api/health` on page load.)

Deploy in this order so each piece has the URL it needs:

**1. Database — MongoDB Atlas** (already set up for local dev)
- Reuse your M0 cluster. Under Network Access, allow `0.0.0.0/0` (Render's free
  outbound IPs aren't fixed). Keep the `MONGODB_URI` handy.

**2. Backend — Render** (config in `render.yaml`)
- Render → New → Blueprint → pick this repo. It reads `render.yaml`.
- Fill the dashboard secrets: `MONGODB_URI`, `ANTHROPIC_API_KEY`, plus the SES
  vars below. Leave `CORS_ORIGIN` for now (set it after step 4).
- Deploy, then copy the service URL, e.g. `https://portfolio-api.onrender.com`.

**3. Email — AWS SES**
- SES → Verified identities → verify your `SES_FROM` email and your `SES_TO`
  email (sandbox mode can only send to verified addresses — fine here).
- IAM → create a user with a policy allowing only `ses:SendEmail`; create an
  access key. Put `AWS_REGION`, `SES_FROM`, `SES_TO`, `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY` into Render's env.

**4. Frontend — AWS Amplify** (config in `amplify.yml`)
- Amplify → Host web app → connect this GitHub repo. It detects `amplify.yml`.
- Set env var `VITE_API_URL` = your Render URL from step 2.
- Deploy, then copy the Amplify URL, e.g. `https://main.xxxx.amplifyapp.com`.

**5. Wire CORS**
- Back in Render, set `CORS_ORIGIN` = your Amplify URL and let it redeploy.

Both Amplify and Render auto-redeploy on push to `main`.

---

## 5. Roadmap / next steps

- [x] Email notifications on contact (AWS SES) — see `services/email.ts`
- [ ] Upgrade AI retrieval to semantic search (Voyage AI embeddings) — see `services/retrieval.ts`
- [ ] Add a GitHub Actions workflow (lint + typecheck + build)
- [ ] Custom domain + HTTPS (Route 53 / Amplify domains)
- [ ] Analytics + SEO meta/OpenGraph tags
