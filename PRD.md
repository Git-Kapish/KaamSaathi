# Product Requirements Document (PRD)

**Product:** KaamSaathi: A Voice-First, Multilingual AI Assistant for Migrant and Frontline Workers
**Version:** 1.0 (Draft)
**Date:** 9 November 2026
**Prepared by:** Team KaamSaathi
**Companion document:** [BRD.md](BRD.md) (Sections 1-21)

> The BRD says why we build and what the business needs. This document says what the product does, screen by screen and behaviour by behaviour, and then how the project is organised so the team can start building. Section numbering continues from the BRD (22 onward).

---

## 22. Product Overview

**Product:** KaamSaathi, a voice-first web app with a 3D avatar for migrant and frontline workers.

**Platform (MVP):** Responsive web app, Android Chrome first, desktop browser for the admin.

**Core promise:** "Speak in your language. Understand your work. Be heard."

### 22.1 Product Principles

1. **Voice first, screen second.** Every action must be possible without reading.
2. **Short and spoken.** Answers are 1 to 3 short sentences or numbered steps, in plain spoken language.
3. **Never guess on safety.** No grounded answer means "ask your supervisor".
4. **One big button.** The main screen has a single primary action.
5. **Consent before capture.** Nothing is stored until the worker agrees, in their language.
6. **Fail soft.** If anything breaks, the app says so in voice and offers a fallback.

### 22.2 Goals and Non-Goals

| Goals | Non-goals (MVP) |
|---|---|
| End-to-end voice loop in 2 languages | Certified safety decisions |
| Grounded answers from a curated knowledge base | Open-ended chatbot behaviour |
| Two-way translation | More than 3 languages |
| Voice incident reports | Native apps, offline mode |
| Admin dashboard (basic) | HR or payroll integration |
| 3D avatar with lip-sync | Realistic facial animation or custom avatar creation |

---

## 23. User Stories and Acceptance Criteria

| ID | As a... | I want to... | So that... | Acceptance criteria |
|---|---|---|---|---|
| US01 | Worker | tap one button and speak in my language | I do not need to type or read | Transcript appears within about 2 seconds of speaking; language is detected |
| US02 | Worker | hear the rules of my site in my language | I know how to stay safe | Avatar plays onboarding; completion is logged with timestamp |
| US03 | Worker | ask "how do I use this tool?" | I can work safely | Answer is from the knowledge base; spoken; under about 30 seconds |
| US04 | Worker | be told when the assistant does not know | I do not follow a wrong instruction | Out-of-scope question returns "I am not sure, please ask your supervisor" |
| US05 | Worker | talk to my supervisor through the app | we understand each other | Each side hears the other in their own language; both transcripts shown |
| US06 | Worker | report an injury or unpaid wages by voice | someone knows about it | Structured report created; read back; confirmed by the worker |
| US07 | Worker | get help instantly in an emergency | I get care quickly | Emergency phrase triggers supervisor alert and shows the emergency number |
| US08 | Worker | choose whether my voice is used to improve the product | I control my data | Consent is spoken, recorded, and can be changed |
| US09 | Supervisor | see reports and who has completed training | I can act on issues | Dashboard lists workers, training status, and open reports |
| US10 | Admin | upload safety documents and add terms | answers match our site | Uploaded files are indexed; glossary edits take effect on the next session |
| US11 | Admin | export a training and incident report | I can show compliance | Export downloads as PDF or CSV |

---

## 24. Feature Specification

### 24.1 Feature List with Priority

| ID | Feature | Priority | MVP? |
|---|---|---|---|
| F1 | Voice conversation loop (Prisma, LLM, Timbre) | P0 | Yes |
| F2 | Language detection and language hint | P0 | Yes |
| F3 | Spoken consent | P0 | Yes |
| F4 | Grounded Q&A over knowledge base | P0 | Yes |
| F5 | 3D avatar with lip-sync | P1 | Yes (simple) |
| F6 | Two-way translation | P1 | Yes |
| F7 | Onboarding script and check questions | P1 | Yes (short) |
| F8 | Voice incident and grievance report | P1 | Yes (basic) |
| F9 | Emergency phrase handling | P1 | Yes |
| F10 | Admin dashboard | P2 | Basic |
| F11 | Glossary editor | P2 | Optional |
| F12 | Export compliance report | P2 | Optional |
| F13 | WhatsApp or IVR access | P3 | No |
| F14 | Offline mode | P3 | No |

### 24.2 Screen Inventory

| Screen | Purpose | Key elements |
|---|---|---|
| S1 Welcome | Language choice and consent | Avatar greeting, flag or script buttons, "Start" mic button |
| S2 Home | Main interaction | Avatar, large mic button, live transcript strip, mode buttons (Ask, Talk to Supervisor, Report) |
| S3 Ask | Q&A | Avatar speaking, transcript, "Repeat" and "Slower" buttons |
| S4 Translate | Two-way conversation | Two-sided transcript, language pair selector, mic buttons per side |
| S5 Report | Guided incident report | Step prompts by voice, summary card, confirm and cancel buttons |
| S6 Emergency | Fast help | Red button, supervisor call action, emergency number |
| S7 Admin login | Admin access | Email and password |
| S8 Admin dashboard | Overview | Workers, training status, open reports, filters |
| S9 Admin knowledge base | Content management | Upload, document list, glossary table |
| S10 Admin report detail | Review | Transcript, audio, structured fields, status |

### 24.3 Core User Flows

**Flow A: First use**
Open app, avatar greets in the default language, worker picks language, avatar explains recording and asks for spoken consent, consent saved, onboarding begins, check questions, completion logged, Home screen.

**Flow B: Ask a question**
Tap mic, speak, Prisma transcribes, intent classified as question, retrieval finds passages, LLM drafts a short answer, guardrail checks it, Timbre speaks it, avatar plays it, worker can say "repeat".

**Flow C: Translate with supervisor**
Open Talk mode, set language pair, worker speaks, supervisor hears translation in their language, supervisor replies, worker hears it. Both sides see transcripts.

**Flow D: Report an issue**
Worker says "I want to report...", avatar asks the guided questions (what happened, when, where, who, how serious), summary is read back, worker confirms, record saved, supervisor notified.

**Flow E: Emergency**
Worker says an emergency phrase or taps the red button, supervisor alert sent, emergency number shown and spoken, a report is started in the background.

---

## 25. Conversation and AI Behaviour Specification

### 25.1 Intents

| Intent | Examples (illustrative) | Handler |
|---|---|---|
| onboarding | "start training" | Onboarding module |
| question | "how do I wear the harness?" | Retrieval and answer |
| translate | "talk to supervisor" | Translation mode |
| report | "I got hurt", "salary not paid" | Report flow |
| emergency | "help", "fire", "accident" | Emergency flow |
| smalltalk or unknown | anything else | Polite redirect to supported actions |

### 25.2 Answer Rules (system prompt requirements)

- Answer only from the retrieved passages.
- If passages do not answer the question, say so and refer to the supervisor.
- Use the worker's language and simple words; no jargon unless in the glossary.
- Give at most 5 steps; each step under 15 words.
- For high-risk topics (electrical, height, chemicals, heavy machinery), end with a supervisor-confirm line.
- Never give medical, legal, or immigration advice; refer to the proper person.
- Never invent numbers, regulations, or procedures.

### 25.3 Report Extraction Schema

```json
{
  "report_type": "injury | near_miss | unpaid_wages | harassment | other",
  "occurred_at": "ISO datetime or null",
  "location": "string or null",
  "people_involved": ["string"],
  "description": "string",
  "severity": "low | medium | high | emergency",
  "language": "string",
  "worker_confirmed": true
}
```

### 25.4 Guardrails

1. Retrieval confidence threshold: below it, the assistant refuses to answer.
2. Output check: the answer must cite at least one retrieved passage internally.
3. Blocked topics list (legal, medical, immigration): redirect.
4. Rate limit per session to protect credits.
5. Log every refusal for review.

---

## 26. UX and Design Requirements

- Large tap targets (at least 48 px), high contrast, minimal text.
- Icons plus voice labels; avoid text-only instructions.
- Visible "listening", "thinking", and "speaking" states on the avatar and mic button.
- A persistent "Repeat" and "Slower" control.
- Calm, respectful tone; no jargon.
- Works in portrait mode on small screens.
- Avatar mouth moves with audio loudness (simple lip-sync is enough for MVP).

---

## 27. Data Model (Logical)

| Entity | Key fields |
|---|---|
| Employer | id, name, contact |
| Site | id, employer_id, name, city, languages |
| Worker | id, site_id, name or alias, preferred_language, phone (optional), consent_status |
| Session | id, worker_id, started_at, ended_at, mode |
| Transcript | id, session_id, speaker, language, text, audio_ref, created_at |
| KnowledgeDocument | id, site_id, title, file_ref, status |
| KnowledgeChunk | id, document_id, text, embedding |
| GlossaryTerm | id, site_id, term, language, translation |
| TrainingRecord | id, worker_id, module, completed_at, score |
| IncidentReport | id, worker_id, type, severity, fields_json, status, created_at |
| ConsentRecord | id, worker_id, scope, language, given_at, audio_ref |

---

## 28. API Specification (Internal)

Exact request formats for Gnani Prisma and Timbre must follow the Gnani API docs. The routes below are our own backend.

| Method | Route | Purpose |
|---|---|---|
| WS | `/ws/stt` | Stream microphone audio, receive live transcript |
| POST | `/api/chat` | Send transcript, receive grounded answer text |
| POST | `/api/tts` | Send text and language, receive audio |
| POST | `/api/translate` | Translate text between languages with glossary |
| POST | `/api/report` | Create a structured report from a transcript |
| POST | `/api/consent` | Save consent record |
| GET | `/api/workers` | List workers (admin) |
| GET | `/api/reports` | List reports (admin) |
| POST | `/api/knowledge` | Upload and index a document (admin) |
| GET/POST | `/api/glossary` | Read or edit glossary (admin) |
| GET | `/api/export` | Export compliance report (admin) |

All admin routes require authentication. API keys for Gnani and the LLM stay on the server and are never sent to the browser.

---

## 29. Analytics and Instrumentation

| Event | Why |
|---|---|
| `session_started`, `session_ended` | Usage |
| `consent_given`, `consent_declined` | Trust |
| `stt_latency_ms`, `llm_latency_ms`, `tts_latency_ms` | Performance |
| `answer_refused_no_context` | Knowledge base gaps |
| `answer_repeated` | Clarity of answers |
| `report_created`, `report_confirmed`, `report_cancelled` | Reporting funnel |
| `emergency_triggered` | Safety |
| `credits_used_per_feature` | Budget control |

---

## 30. Test and Quality Plan

| Area | Test | Pass criterion |
|---|---|---|
| Speech accuracy | 20 to 30 recorded clips per language, including noisy ones | Record measured error rate; no unreported claims |
| Answer correctness | 30 safety questions reviewed against the source document | Reviewer marks answers correct or acceptable |
| Refusal behaviour | 15 out-of-scope questions | At least 95% correctly refused or redirected |
| Translation | 20 sentence pairs per language pair | Reviewed by a native speaker |
| Report extraction | 10 scripted reports | All required fields extracted or flagged missing |
| Latency | 20 runs on mobile network | Median and worst case recorded |
| Consent | Decline path | App works and stores nothing beyond the session |
| Device | Low-end Android Chrome | Core flows complete |

---

## 31. Release Plan and MVP Cut Line

| Milestone | Content |
|---|---|
| M0 Skeleton | Repo, environment, health check, mic capture, Prisma streaming test |
| M1 Voice loop | Prisma, LLM, Timbre working in one language with transcript on screen |
| M2 Grounding | Knowledge base ingest, retrieval, refusal behaviour, second language |
| M3 Avatar | 3D avatar with lip-sync, state animations |
| M4 Modes | Translation and report flows |
| M5 Admin and polish | Basic dashboard, consent, error handling |
| M6 Demo | Test pass, recording, public post |

**Cut line for a one-to-two-day contest build:** deliver M0 to M3 plus a minimal version of translation. Report flow and admin are shown as short clips or mock screens only if working code does not exist. Say clearly in the video what is working and what is planned.

---

# Project Structure

## 32. Repository Layout (Monorepo)

```text
kaamsaathi/
├── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml            # optional: db + backend + frontend
├── docs/
│   ├── BRD.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── api.md
│   ├── test-plan.md
│   └── demo-script.md
├── frontend/                     # React web app
│   ├── package.json
│   ├── public/
│   │   └── avatars/              # .glb avatar model
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       │   ├── Welcome.jsx
│       │   ├── Home.jsx
│       │   ├── Ask.jsx
│       │   ├── Translate.jsx
│       │   ├── Report.jsx
│       │   ├── Emergency.jsx
│       │   └── admin/
│       │       ├── Login.jsx
│       │       ├── Dashboard.jsx
│       │       ├── Knowledge.jsx
│       │       └── ReportDetail.jsx
│       ├── components/
│       │   ├── Avatar3D.jsx      # three.js avatar and lip-sync
│       │   ├── MicButton.jsx
│       │   ├── TranscriptStrip.jsx
│       │   ├── StatusIndicator.jsx
│       │   └── ConsentPrompt.jsx
│       ├── hooks/
│       │   ├── useAudioCapture.js
│       │   ├── useSttSocket.js
│       │   └── useAudioPlayback.js
│       ├── services/
│       │   └── api.js
│       ├── i18n/
│       │   └── strings.json      # UI labels per language
│       └── styles/
├── backend/                      # FastAPI or Node service
│   ├── requirements.txt          # or package.json
│   └── app/
│       ├── main.py
│       ├── config.py             # reads environment variables
│       ├── routes/
│       │   ├── stt_ws.py
│       │   ├── chat.py
│       │   ├── tts.py
│       │   ├── translate.py
│       │   ├── report.py
│       │   ├── consent.py
│       │   ├── knowledge.py
│       │   └── admin.py
│       ├── services/
│       │   ├── gnani_stt.py      # Prisma client wrapper
│       │   ├── gnani_tts.py      # Timbre client wrapper
│       │   ├── llm.py            # Evon or hosted LLM wrapper
│       │   ├── retrieval.py      # chunking, embeddings, search
│       │   ├── intent.py         # intent classification
│       │   ├── guardrails.py     # grounding and blocked topics
│       │   ├── translation.py    # translation and glossary
│       │   └── reporting.py      # structured extraction
│       ├── prompts/
│       │   ├── system_answer.txt
│       │   ├── intent.txt
│       │   ├── translate.txt
│       │   └── report_extract.txt
│       ├── models/               # database models and schemas
│       ├── db/
│       │   └── migrations/
│       └── utils/
│           ├── audio.py
│           └── logging.py
├── knowledge-base/
│   ├── sample-safety-manual.pdf  # curated, reviewed source documents
│   └── glossary.csv
├── data/
│   └── test-audio/               # recorded noisy clips with transcripts
├── eval/
│   ├── run_stt_eval.py           # measures speech error rate
│   ├── run_qa_eval.py            # grounded-answer checks
│   ├── questions.csv
│   └── results/
├── scripts/
│   ├── ingest_docs.py            # chunk and index knowledge base
│   └── seed_demo_data.py
└── tests/
    ├── backend/
    └── frontend/
```

## 33. Module Responsibilities

| Module | Responsibility | Suggested owner |
|---|---|---|
| gnani_stt, stt_ws | Streaming audio to Prisma, live transcript, language detection | Voice backend |
| gnani_tts, tts | Text to audio through Timbre, caching repeated phrases | Voice backend |
| llm, intent, guardrails | Reasoning, intent routing, safety rules | AI and prompts |
| retrieval, ingest_docs | Knowledge base indexing and search | AI and prompts |
| translation, reporting | Two-way translation and structured reports | AI and prompts |
| Avatar3D, hooks | Avatar rendering, lip-sync, mic and playback | Frontend |
| pages, components | Screens, flows, accessibility | Frontend |
| admin pages, admin routes | Dashboard and content management | Full stack |
| eval, test-audio | Accuracy measurement and test sets | QA and demo lead |
| demo-script, video | Story, recording, posting | Demo and content lead |

If the team has two people, merge these into two roles: **voice and AI backend**, and **frontend, avatar, and demo**.

## 34. Configuration (`.env.example`)

```env
GNANI_API_KEY=
GNANI_STT_ENDPOINT=        # from Gnani docs
GNANI_TTS_ENDPOINT=        # from Gnani docs
LLM_PROVIDER=              # evon | hosted
LLM_API_KEY=
EMBEDDING_MODEL=
DATABASE_URL=
ADMIN_JWT_SECRET=
DEFAULT_LANGUAGE=hi
SUPPORTED_LANGUAGES=hi,ta
CREDIT_LIMIT_PER_SESSION=
```

Never commit real keys. Gnani provides 3 free API keys per account; use one per environment.

## 35. Local Setup (Outline)

1. Clone the repository and copy `.env.example` to `.env`.
2. Add Gnani and LLM keys.
3. Install backend dependencies and start the server.
4. Run `scripts/ingest_docs.py` to index the sample safety manual.
5. Install frontend dependencies and start the dev server.
6. Open the app over HTTPS or localhost (microphone access needs a secure context).
7. Run `eval/run_stt_eval.py` to record baseline accuracy.

## 36. Suggested Work Split and Order

Build in this order so that, if time runs out, you still have a working voice loop to demo.

| Order | Task | Output |
|---|---|---|
| 1 | Mic capture and Prisma streaming test | Live transcript in browser |
| 2 | LLM answer with a fixed prompt | Text answer from transcript |
| 3 | Timbre playback | Spoken answer |
| 4 | Knowledge base ingest and retrieval | Grounded answers and refusals |
| 5 | Avatar and lip-sync | Talking avatar |
| 6 | Translation mode | Two-way demo |
| 7 | Report extraction | Structured report card |
| 8 | Consent and error states | Trust and stability |
| 9 | Evaluation and recorded results | Honest numbers for the pitch |
| 10 | Demo recording and post | Public submission |

## 37. Updated Open Items

| # | Item |
|---|---|
| 1 | Decide the backend language (Python or Node) based on who is writing it |
| 2 | Confirm Prisma, Timbre, and Evon request formats from the Gnani docs and update Section 28 |
| 3 | Pick the avatar asset and check its licence |
| 4 | Pick the two demo languages and test Timbre voice quality in both |
| 5 | Prepare one real or realistic safety document for the knowledge base |
| 6 | Rename or split this document into separate BRD and PRD files in `docs/` once finalised |
