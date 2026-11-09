# Business Requirements Document (BRD)

## KaamSaathi: A Voice-First, Multilingual AI Assistant for Migrant and Frontline Workers

**Version:** 1.0 (Draft)
**Date:** 9 November 2026
**Prepared by:** Team KaamSaathi
**Context:** Great Indian AI Internship Challenge (Gnani AI), with a path to a full startup
**Status:** For team review

---

## 1. Document Control

| Item | Detail |
|---|---|
| Product name (working) | KaamSaathi ("work companion") |
| Document type | Business Requirements Document |
| Audience | Founding team, hackathon judges, mentors, prospective investors, pilot partners |
| Related inputs | Gnani AI contest brief; Gnani API docs (Prisma, Timbre, Evon) |
| Contest deadline | 10 November 2026, no extensions (confirm on the Gnani page) |
| Review cycle | After each phase gate (see Section 14) |

> **Reading note:** Statistics in this document are marked **[verify]** where they are estimates that must be checked against a primary source before being used in a pitch or post.

---

## 2. Executive Summary

Millions of workers move across language borders to find work: a Bihari worker in a Tamil Nadu factory, a Bengali worker on a Kerala construction site, a South Asian worker in a Gulf-country warehouse. On day one they often cannot read the safety signs, cannot understand the supervisor, and cannot report a problem. The result is preventable injuries, wage disputes, high attrition, and exploitation.

KaamSaathi is a hands-free, voice-first assistant with a 3D avatar. A worker speaks in their own language and dialect, including Hinglish and other code-mixed speech, in noisy environments. The assistant:

1. **Onboards** the worker in their language (safety rules, site layout, who to call, how the job works).
2. **Answers questions** with grounded, step-by-step spoken guidance drawn from the employer's approved safety and training material.
3. **Translates** two ways between worker and supervisor in real time.
4. **Captures voice reports** (injury, near-miss, unpaid wages, harassment) as structured, timestamped records.

The product is built on Gnani AI's speech stack (Prisma for speech-to-text, Timbre for text-to-speech) with an LLM reasoning layer (Gnani Evon or another hosted LLM) and a 3D avatar front end.

**Business value:** fewer accidents and less attrition for employers, better rights and safety for workers, and compliance evidence for contractors, NGOs, and governments. Over time, consented and anonymised voice data from real worksites forms a defensible dataset of workplace speech in low-resource dialects.

---

## 3. Business Context and Problem Statement

### 3.1 Background

Labour migration, both within India and across borders, is very large **[verify: use figures from the Census, the Economic Survey, ILO, and the World Bank before quoting]**. Migrant workers are concentrated in construction, manufacturing, logistics, agriculture, hospitality, and domestic work. Many have low literacy or low formal-language literacy, speak dialects that mainstream tools do not cover, and receive little or no structured onboarding.

### 3.2 Problems

| # | Problem | Who feels it | Consequence |
|---|---|---|---|
| P1 | No onboarding in the worker's language | Worker, employer | Unsafe behaviour, mistakes, early quitting |
| P2 | Language gap between worker and supervisor | Both | Miscommunication, accidents, conflict |
| P3 | Safety instructions are written, not spoken | Worker | Instructions ignored or misunderstood |
| P4 | No safe channel to report injury, wage theft, or harassment | Worker | Issues go unrecorded and unresolved |
| P5 | Employers and contractors lack evidence of training and incident handling | Employer, auditor | Compliance risk, legal exposure |
| P6 | Existing translation and assistant apps are typed, not hands-free, and fail in noise and dialect | Worker | Tools go unused |

### 3.3 Opportunity

Hands-free voice is the natural interface for people whose hands are busy, who may not read fluently, and who work in loud places. Gnani's models are built for Indian languages, code-mixing, and noisy telephonic audio, which matches these conditions.

---

## 4. Vision, Goals, and Objectives

**Vision:** Every worker, in any language, can understand their job, stay safe, and be heard.

### 4.1 Business Goals

| ID | Goal | Measure |
|---|---|---|
| BG1 | Reduce onboarding time and cost for employers | Hours of onboarding per worker |
| BG2 | Reduce preventable incidents at pilot sites | Incident and near-miss rate |
| BG3 | Reduce early attrition | 30-day and 90-day retention |
| BG4 | Give workers a trusted reporting channel | Reports filed, resolution time |
| BG5 | Build a consented dialect speech dataset | Hours of consented, labelled audio |
| BG6 | Win and use the Gnani challenge as launchpad | Shortlist, interview, pilot interest |

### 4.2 Objectives for the Contest Build (MVP)

- **O1:** Working end-to-end voice loop (speak, understand, answer, speak) in at least Hindi plus one more language.
- **O2:** Grounded answers from a small, real safety knowledge base for one trade.
- **O3:** Two-way worker-supervisor translation demo.
- **O4:** Voice incident report converted to a structured record.
- **O5:** 3D avatar that speaks the response.
- **O6:** Public demo video (about 60 seconds) with a clear human story.

---

## 5. Scope

### 5.1 In Scope (MVP)

- Real-time speech input via Gnani Prisma (Real-time mode).
- Language identification and code-mixed speech handling.
- LLM reasoning with retrieval over an approved knowledge base.
- Spoken output via Gnani Timbre.
- 3D avatar front end (browser-based).
- Two-way translation between worker and supervisor.
- Voice incident and grievance report, saved as a structured record.
- Admin view: transcripts, reports, and training-completion log.
- One vertical to start (recommended: construction site safety).

### 5.2 Out of Scope (MVP)

- Certified safety-critical decision making (the assistant never replaces a supervisor or safety officer).
- Payroll, legal advice, or immigration case handling.
- Native mobile apps (a responsive web app is used first).
- More than 3 languages.
- Integrations with HR or ERP systems.

### 5.3 Future Scope

- Android app and WhatsApp/IVR voice access for feature phones.
- Additional verticals: factory, delivery, agriculture, domestic work, hospitality.
- Gulf, South-East Asia, and Europe corridors.
- Wage-claim and grievance workflows with NGOs and government portals.
- Dialect-improvement flywheel with community corrections.

---

## 6. Stakeholders

| Stakeholder | Role | Interest |
|---|---|---|
| Migrant and frontline workers | Primary users | Understand tasks, stay safe, be heard |
| Supervisors and site managers | Secondary users | Communicate instructions, receive reports |
| Employers, contractors, staffing agencies | Customers (B2B) | Lower incidents, lower attrition, compliance |
| NGOs and worker unions | Partners | Worker welfare, grievance support |
| Government agencies and labour departments | Potential customers and regulators | Safety compliance, welfare schemes |
| Gnani AI | Technology partner and contest organiser | Showcase of Prisma, Timbre, Evon |
| Investors | Funders | Market size, defensibility, traction |
| Founding team | Builders | Execution and learning |

---

## 7. Users and Personas

**Persona 1: Ramesh, 24, construction labourer.** From Bihar, working in Chennai. Speaks Bhojpuri-influenced Hindi, limited reading, uses a basic Android phone, works in noise and dust. *Needs:* to know which gear is mandatory, how to operate a tool safely, and whom to call.

**Persona 2: Selvam, 38, site supervisor.** Speaks Tamil and some Hindi. Manages 40 workers. *Needs:* to give instructions that are understood, and to receive reports without paperwork.

**Persona 3: Anita, 45, HR and safety manager at a contractor.** *Needs:* training records, incident logs, and audit evidence.

**Persona 4: NGO field officer.** *Needs:* a way to collect wage and safety grievances in the worker's own voice.

---

## 8. Business Requirements

| ID | Business requirement | Priority |
|---|---|---|
| BR-01 | The solution must let workers interact entirely by voice in their own language. | Must |
| BR-02 | The solution must work in noisy, low-bandwidth, low-end-device conditions. | Must |
| BR-03 | The solution must give safety and job guidance that is grounded in approved employer material. | Must |
| BR-04 | The solution must enable two-way spoken translation between worker and supervisor. | Must |
| BR-05 | The solution must capture incident and grievance reports by voice as structured records. | Must |
| BR-06 | The solution must provide employers with training-completion and incident visibility. | Should |
| BR-07 | The solution must obtain and record worker consent for data use. | Must |
| BR-08 | The solution must use Gnani speech models (contest requirement). | Must |
| BR-09 | The solution must provide an engaging avatar-based interface that suits low-literacy users. | Should |
| BR-10 | The solution must be demonstrable publicly with a short video. | Must |
| BR-11 | The solution should support additional languages and verticals without redesign. | Should |
| BR-12 | The solution should support a path to a paid B2B model. | Should |

---

## 9. Functional Requirements

### 9.1 Voice Interaction (FR-1x)

| ID | Requirement | Linked BR |
|---|---|---|
| FR-11 | The user can start a conversation with one tap or a wake phrase. | BR-01 |
| FR-12 | The system streams audio to Gnani Prisma and displays a live transcript. | BR-01, BR-08 |
| FR-13 | The system detects the spoken language automatically, with an optional language hint (2 to 4 expected languages). | BR-01 |
| FR-14 | The system handles code-mixed speech (for example Hinglish). | BR-01 |
| FR-15 | The system plays the answer in the user's language using Gnani Timbre. | BR-01, BR-08 |
| FR-16 | The user can interrupt the assistant or ask it to repeat or slow down. | BR-01 |

### 9.2 Onboarding Module (FR-2x)

| ID | Requirement |
|---|---|
| FR-21 | The avatar delivers a spoken onboarding covering site rules, protective equipment, emergency exits, and contacts. |
| FR-22 | The system asks short spoken check questions and records understanding. |
| FR-23 | The system stores a timestamped training-completion record per worker. |

### 9.3 Grounded Q&A (FR-3x)

| ID | Requirement |
|---|---|
| FR-31 | The employer uploads approved documents (safety manuals, SOPs, site rules) into a knowledge base. |
| FR-32 | Answers are generated only from the knowledge base using retrieval. |
| FR-33 | If the knowledge base does not contain the answer, the assistant says so and directs the worker to the supervisor. It never guesses on safety. |
| FR-34 | High-risk questions (for example electrical, working at height, chemicals) always include a "confirm with your supervisor" line. |
| FR-35 | Answers are short, in simple spoken language, and step by step. |

### 9.4 Two-Way Translation (FR-4x)

| ID | Requirement |
|---|---|
| FR-41 | The worker speaks in language A and the supervisor hears language B, and the reverse. |
| FR-42 | A transcript of both sides is shown in both languages. |
| FR-43 | Domain terms (tool names, trade vocabulary) are handled through a configurable glossary. |

### 9.5 Voice Reporting (FR-5x)

| ID | Requirement |
|---|---|
| FR-51 | The worker can say "I am injured", "I was not paid", or similar, and the assistant starts a guided report. |
| FR-52 | The system extracts structured fields: type, date and time, location, people involved, description, and severity. |
| FR-53 | The assistant reads the summary back and asks the worker to confirm. |
| FR-54 | Emergency phrases trigger an immediate alert to the supervisor and display the emergency contact. |
| FR-55 | The original audio and the transcript are stored, with consent, as evidence. |

### 9.6 Avatar Interface (FR-6x)

| ID | Requirement |
|---|---|
| FR-61 | A 3D avatar renders in the browser and lip-syncs to the spoken audio. |
| FR-62 | The interface uses large icons, minimal text, and a single primary action. |
| FR-63 | The interface works on low-end Android browsers. |

### 9.7 Admin Dashboard (FR-7x)

| ID | Requirement |
|---|---|
| FR-71 | Admins can view the worker list, training status, and reports. |
| FR-72 | Admins can search transcripts and filter by language, site, and severity. |
| FR-73 | Admins can edit the glossary and the knowledge base. |
| FR-74 | Admins can export a compliance report. |

### 9.8 Consent and Privacy (FR-8x)

| ID | Requirement |
|---|---|
| FR-81 | At first use, the avatar explains in the worker's language what is recorded and why, and asks for spoken consent. |
| FR-82 | The worker can decline data use for model improvement and still use the assistant. |
| FR-83 | The worker can request deletion of their data. |

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | End-to-end response (end of speech to start of audio) targeted under 3 seconds on a normal connection. Measure and report the real figure. |
| Accuracy | Word error rate and answer correctness measured on a test set of real, noisy recordings. Report the measured numbers, do not assume them. |
| Robustness | Works with background noise typical of sites (machinery, traffic). Test with recorded site audio. |
| Availability | Graceful degradation: if streaming fails, fall back to recorded-clip transcription. |
| Accessibility | Voice-first, low-literacy friendly, large tap targets, high contrast. |
| Security | Encrypted transport and storage, role-based access, API keys held server-side only. |
| Privacy | Consent-based, data minimisation, anonymisation for any dataset use, deletion on request. |
| Compliance | Align with India's Digital Personal Data Protection Act, 2023 and applicable labour and safety laws **[verify with a legal advisor]**. |
| Scalability | Stateless services and queue-based processing so more sites and languages can be added. |
| Maintainability | Modular components so speech, LLM, and avatar providers can be swapped. |
| Cost | Stay within the 5,000 Gnani programme credits for the contest build. Track credit use per feature. |

---

## 11. Solution Overview and Pipeline

### 11.1 End-to-End Pipeline

1. **Capture:** the browser or app captures microphone audio.
2. **Transcribe:** audio streams to Gnani Prisma, which returns text and detected language.
3. **Understand:** an orchestration service classifies intent: onboarding, question, translation, report, or emergency.
4. **Reason:** for questions, the LLM retrieves from the knowledge base and generates a short, grounded answer. For reports, it extracts structured fields. For translation, it translates and applies the glossary.
5. **Safety check:** a guardrail layer checks for ungrounded or high-risk content and adds the supervisor line where needed.
6. **Speak:** the answer goes to Gnani Timbre for audio.
7. **Present:** the avatar plays the audio with lip-sync, and the transcript appears on screen.
8. **Store:** transcripts, reports, and consent records go to the database. The admin dashboard reads from it.

### 11.2 Components

| Component | Technology (proposed) | Notes |
|---|---|---|
| Speech-to-text | Gnani Prisma (V3.0 multilingual; V2.5 per-language option) | Required by contest |
| Text-to-speech | Gnani Timbre (beta) | Test voice quality early per language |
| Reasoning LLM | Gnani Evon (30B, Hugging Face) or a hosted LLM | Compare quality and latency |
| Knowledge retrieval | Vector store with document chunks | Small, curated corpus for MVP |
| Avatar | three.js with a ready-made avatar (for example Ready Player Me), mouth driven by audio loudness | Do not over-invest in animation |
| Backend | Node.js or Python (FastAPI) with WebSocket streaming | Keeps API keys server-side |
| Database | PostgreSQL or Firebase | Reports, consent, training logs |
| Front end | Responsive web app (React) | Android-browser first |
| Hosting | Any cloud with HTTPS | Microphone needs HTTPS |

### 11.3 Key Data Entities

Worker, Site, Employer, Session, Transcript, Knowledge Document, Training Record, Incident Report, Consent Record, Glossary Term.

---

## 12. Business Model and Go-to-Market

### 12.1 Revenue Model

| Stream | Description |
|---|---|
| B2B subscription | Per-site or per-worker monthly fee for contractors, factories, and staffing agencies |
| Compliance add-on | Audit-ready training and incident reports |
| NGO and government licences | Discounted or grant-funded deployments |
| Data partnerships (later) | Consented, anonymised, aggregated dialect data for speech research, only with explicit worker consent and legal review |

### 12.2 Go-to-Market

1. **Phase 0, contest:** public demo, engagement, and Gnani visibility.
2. **Phase 1, pilots:** 2 to 3 construction contractors or staffing agencies in one city, free or low-cost, to gather measured outcomes.
3. **Phase 2, expansion:** more verticals, more languages, WhatsApp and IVR access.
4. **Phase 3, corridors:** Gulf and other migrant corridors through recruitment agencies and NGOs.

### 12.3 Competitive Position

Already existing categories include general translation apps, enterprise training platforms, and voice assistants. Before claiming differentiation, the team must complete a competitor scan. Intended differentiators:

- Voice-first and hands-free, built for low literacy and noise.
- Dialect and code-mixed speech support through Gnani models.
- Grounded in the employer's own safety material, not generic answers.
- A worker-side reporting channel with consent and evidence, not just a manager tool.
- Potential data moat from consented dialect speech.

---

## 13. Success Metrics (KPIs)

| Area | Metric | Target for pilot (to be agreed) |
|---|---|---|
| Usage | Workers completing onboarding | To be set |
| Quality | Transcription accuracy on noisy test set | Measured and reported |
| Quality | Answer correctness on a safety question set, reviewed by a safety professional | Measured and reported |
| Trust | Share of workers who say they understood the instructions | Survey-based |
| Safety | Change in incidents and near-misses | Compared with baseline |
| Retention | 30-day retention vs. baseline | Compared with baseline |
| Reporting | Reports filed and time to resolution | Tracked |
| Contest | Post engagement, shortlist, interview | Tracked |

---

## 14. Roadmap and Phase Gates

### 14.1 Contest Phase (deadline: 10 November 2026)

The Gnani email states the contest closes on 10 November 2026 with no extensions. If that is accurate, the build is a vertical slice, not the full product.

| Priority | Deliverable |
|---|---|
| P1 (must demo) | Voice loop: Prisma, LLM, Timbre, with transcript on screen |
| P1 | Grounded answers from a small safety knowledge base, in Hindi plus one more language |
| P2 | 3D avatar with simple lip-sync |
| P2 | Two-way translation demo |
| P3 | Voice incident report to structured record |
| P3 | Basic admin view |
| P1 | 60-second demo video and public post with #GnaniAI and #GreatIndianAIInternshipChallenge |

**Fallback:** if live streaming is unstable, use Prisma Transcribe mode on recorded clips so the demo still looks live.

### 14.2 Post-Contest Phases

| Phase | Window (indicative) | Outcome |
|---|---|---|
| 1. Validation | Weeks 1 to 4 | Interviews with workers, supervisors, contractors; competitor scan; refine requirements |
| 2. Pilot build | Weeks 4 to 12 | Hardened MVP, admin dashboard, consent flow, 3 languages |
| 3. Pilot | Months 3 to 6 | 2 to 3 sites, measured outcomes, case studies |
| 4. Commercial launch | Months 6 to 12 | Paid subscriptions, WhatsApp/IVR access, second vertical |
| 5. Scale | Year 2 onward | New corridors, partnerships, data programme |

---

## 15. Assumptions, Dependencies, and Constraints

### Assumptions

- Workers have access to a basic smartphone with a browser and a microphone.
- Employers are willing to share safety material and pilot the tool.
- Gnani APIs remain available and within credit limits.

### Dependencies

- Gnani Prisma, Timbre (beta), and Evon availability and quality in target languages.
- Network connectivity at sites (or an offline-tolerant fallback in later phases).
- Legal review for recording and data use.

### Constraints

- 5,000 programme credits for the contest build.
- Contest deadline of 10 November 2026.
- Contest rule: Gnani models must be used.
- Team size and skills (to be recorded in Section 19).

---

## 16. Risks and Mitigations

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | LLM gives a wrong or invented safety instruction | High | Medium | Retrieval-only answers, "I don't know" behaviour, supervisor-confirm line, safety-professional review, prototype disclaimer |
| R2 | Poor accuracy on rare dialects | Medium | High | Language hints, domain glossary, record the limits honestly, correction loop later |
| R3 | Timbre (beta) voice quality is weak in some languages | Medium | Medium | Test early, pick best-supported languages for the demo |
| R4 | High latency breaks the experience | Medium | Medium | Stream audio, keep answers short, measure and optimise |
| R5 | Privacy or consent failure | High | Low to Medium | Spoken consent, minimal data, deletion on request, legal review |
| R6 | Worker fear of retaliation for reporting | High | Medium | Anonymous or NGO-routed reporting option in later phases |
| R7 | Employers do not adopt | High | Medium | Free pilots, measurable ROI, start with safety-driven buyers |
| R8 | Contest deadline too tight | High | High | Vertical-slice scope, fallback mode, early recording of demo |
| R9 | Similar products already exist | Medium | Medium | Competitor scan, sharpen the niche (hands-free, grounded, worker-side reporting) |
| R10 | Credits run out | Medium | Medium | Track usage, cache repeat audio, limit test runs |

---

## 17. Acceptance Criteria (MVP)

1. A user can speak a question in Hindi and in one other supported language and hear a correct, spoken answer drawn from the knowledge base.
2. When the knowledge base lacks the answer, the assistant says it does not know and refers to the supervisor.
3. A two-way translation exchange completes with both transcripts visible.
4. A spoken injury or wage report produces a structured record that the user confirms.
5. Consent is requested and recorded before any storage of audio.
6. The avatar speaks the answer with visible mouth movement.
7. A tested sample of noisy audio is transcribed, and the measured accuracy is recorded in the document.
8. A public 60-second demo is posted with the required hashtags.

---

## 18. Demo and Communication Plan

**Story (60 seconds):**

1. A worker in a noisy site asks in Hindi how to use a machine safely.
2. The avatar answers in Hindi, step by step.
3. The supervisor, speaking Tamil, gives an instruction and the worker hears it in Hindi.
4. The worker reports an injury by voice and sees the confirmed record.
5. Closing line: the problem, the number (verified), and the call to action.

**Engagement tips:** lead with the human problem, post on LinkedIn and X, tag Gnani, end with a question, share in college and community groups early.

**Honesty rules:** call it a prototype, quote only measured accuracy, state that real deployment needs consent, privacy safeguards, and safety-professional review.

---

## 19. Open Items and Decisions Needed

| # | Item | Owner |
|---|---|---|
| 1 | Confirm the real contest deadline and submission format | Team |
| 2 | Choose the first vertical (construction, factory, or delivery) | Team |
| 3 | Choose the two demo languages | Team |
| 4 | Record team roles and skills (voice backend, LLM and retrieval, front end and avatar, demo and content) | Team |
| 5 | Complete the competitor scan | Team |
| 6 | Source and verify statistics for the pitch | Team |
| 7 | Obtain real, consented sample audio and safety documents | Team |
| 8 | Seek a safety professional to review the knowledge base and sample answers | Team |

---

## 20. Glossary

| Term | Meaning |
|---|---|
| ASR / STT | Automatic speech recognition, speech-to-text |
| TTS | Text-to-speech |
| Prisma | Gnani's speech-to-text model |
| Timbre | Gnani's text-to-speech model (beta) |
| Evon | Gnani's 30B-parameter reasoning model |
| RAG | Retrieval-augmented generation: answers built from retrieved documents |
| Code-mixing | Mixing languages in one sentence, such as Hinglish |
| SOP | Standard operating procedure |
| BRD | Business requirements document |

---

## 21. Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| Product owner | | | |
| Technical lead | | | |
| Reviewer or mentor | | | |
