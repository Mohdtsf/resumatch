# ResuMatch — AI-Powered Resume Analyzer & ATS Score Checker

> Upload your resume and a job description — get an instant ATS compatibility score with detailed keyword analysis, formatting checks, and AI-powered improvement suggestions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

## ✨ Features

- **📄 Resume Upload** — Supports PDF and DOCX files (up to 3MB)
- **🎯 Keyword Matching** — Compares resume keywords against job description requirements
- **📊 ATS Score (0-100)** — Weighted score across 5 categories: keywords, formatting, structure, completeness, AI enhancement
- **🤖 AI-Powered Suggestions** — Google Gemini provides specific, actionable improvement recommendations
- **📋 Section Detection** — Checks for essential resume sections (contact, experience, education, skills, etc.)
- **⚠️ Format Checker** — Identifies ATS-unfriendly formatting (tables, columns, special characters)
- **🔗 Shareable Reports** — Each analysis generates a unique, shareable URL
- **🌙 Dark Mode** — System-aware with manual toggle
- **📱 Fully Responsive** — Works perfectly on mobile devices

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + Custom CSS |
| AI Engine | Google Gemini API (Flash) |
| Database | Neon (Serverless Postgres) |
| ORM | Drizzle ORM |
| Rate Limiting | Upstash Redis |
| File Parsing | pdf-parse + mammoth |
| Validation | Zod |
| Deployment | Vercel (Hobby Plan) |

## 🔒 Security

- **Magic-byte file validation** — Validates files by binary header, not extension
- **Prompt injection defense** — Resume text is XML-delimited as data, not instructions
- **PII stripping** — Emails, phones, addresses removed before AI API calls
- **Rate limiting** — 5 analyses per IP per 10 minutes
- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **No PII in database** — Only scores and suggestions stored, never resume text
- **Unguessable share links** — UUID v4 prevents enumeration attacks
- **Input sanitization** — Zod schemas validate all API inputs server-side

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key (free from [Google AI Studio](https://aistudio.google.com/))
- Neon Postgres database (free at [neon.tech](https://neon.tech))
- Upstash Redis (free at [upstash.com](https://upstash.com))

### Installation

```bash
git clone https://github.com/Mohdtsf/resumatch.git
cd resumatch
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
npx drizzle-kit push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The tool works without Gemini/Neon/Upstash configured — it gracefully degrades to rule-based scoring with inline reports.

## 📐 Architecture

```
Browser → POST /api/analyze (multipart)
  → Validate file (magic bytes) + Validate JD (Zod)
  → Extract text (pdf-parse / mammoth)
  → Rule-based analysis (keywords, format, structure, completeness)
  → AI enhancement (Gemini, de-identified text, prompt-injection hardened)
  → Save to Neon Postgres (via Drizzle ORM)
  → Return report UUID → Redirect to /report/[id]
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with upload form
│   ├── layout.tsx            # Root layout with SEO metadata
│   ├── globals.css           # Design system
│   ├── report/[id]/page.tsx  # Shareable report page
│   └── api/
│       ├── analyze/route.ts  # POST: Main analysis endpoint
│       └── report/[id]/route.ts  # GET: Fetch report
├── components/
│   ├── file-upload.tsx       # Drag-and-drop upload
│   ├── report-dashboard.tsx  # Full report view
│   ├── footer.tsx            # Footer with DH link
│   ├── theme-provider.tsx    # Dark mode provider
│   └── ui/
│       ├── score-ring.tsx    # Animated circular score
│       └── progress-bar.tsx  # Color-coded progress bar
├── lib/
│   ├── analyzer/             # Rule-based analysis engine
│   ├── ai/                   # Gemini integration
│   ├── db/                   # Drizzle ORM schema + queries
│   ├── security/             # Validation, PII, rate limiting
│   └── utils/                # Types + constants
└── middleware.ts             # Request tracing
```

## 👤 Developer

**Mohd Tauseef Ansari** — [mohdtauseefansari34@gmail.com]

