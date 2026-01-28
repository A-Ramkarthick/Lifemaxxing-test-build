# LifeMaxxing – Product Requirements Document (PRD)

## Product Name
**LifeMaxxing**  
**Tagline:** *Max out your life.*

## Product Type
AI-powered Personal Life Operating System

## Stage
Greenfield build → MVP → Iterative expansion

---

## 1. Problem Definition

Modern users already rely on AI for journaling, thinking through emotions, finances, relationships, and self‑improvement.  
However, current tools are stateless, forgetful, generic, and disconnected across life domains.

People repeat the same mistakes because no system:
- remembers their past,
- detects long‑term patterns,
- nudges them consistently,
- adapts advice over time.

---

## 2. Product Vision

LifeMaxxing is a **personal life OS** that understands user history, detects behavioral patterns, and helps users actively improve every major dimension of life through specialized AI agents.

Not a chatbot.  
Not therapy.  
A long‑term intelligence companion.

---

## 3. Core Value Proposition

LifeMaxxing helps users:
- understand themselves better,
- break negative cycles,
- build positive habits,
- grow financially, emotionally, and physically,
- track who they are becoming.

All powered by agents with memory and purpose.

---

## 4. Core Concepts

### 4.1 Multi‑Agent System
Each agent has:
- a defined scope,
- shared memory access,
- unique personality,
- ethical boundaries.

### 4.2 Shared Personal Memory
All agents access:
- diary logs,
- past chats,
- uploads (images, PDFs),
- progress data.

---

## 5. Agents

### FinMaxxer – Finances
- Upload bank statement PDFs
- Parse and categorize transactions
- Detect spending patterns
- Suggest saving strategies

### RomanceMaxxer – Romance
- Discuss romantic situations
- Analyze screenshots (texts/chats)
- Suggest healthy communication
- No manipulation or coercion

### StudyMaxxer – Study Goals
- Study planning
- Consistency tracking
- Burnout detection

### GoalMaxxer – Life Goals
- Break goals into steps
- Weekly motivation
- Progress tracking

### CareerMaxxer – Career
- Career path discussion
- Resume feedback
- Skill gap analysis

### SituationMaxxer – Ethical Guidance
- Non‑judgmental listening
- Ethical reframing
- Refuses harmful or unethical assistance

### LooksMaxxer – Glow‑Up Coach
- User‑consented photo uploads
- Face/physique analysis (non‑medical)
- Daily improvement roadmap
- Progress photo tracking

### FamilyMaxxer – Family Dynamics
- Conflict discussion
- Boundary guidance
- Communication scripts

### HabitMaxxer – Habits
- Habit creation
- Urge control
- Relapse analysis
- Streak tracking

---

## 6. Diary Log System

### Diary Logging
- Users write daily diary entries
- Stored securely in DB
- Indexed by date
- Full historical access

### Diary + AI
- All agents can analyze diary logs
- Used for pattern detection and personalization

### Talk to Your Diary
Users can ask:
- Why was I anxious last week?
- What patterns do you see in my days?
- Am I improving or repeating?

---

## 7. AI & Model Stack

### Text Analysis
- GPT‑OSS‑120B (OpenRouter)
  - reasoning
  - pattern detection
  - planning

### Image & OCR
- Gemma 3n‑2B
  - screenshots
  - PDFs
  - photo analysis

### Agent Routing
- User‑selected agent
- Context auto‑loaded from relevant data
- Shared memory across agents

---

## 8. Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS

### Backend & Auth
- Supabase (DB, Auth, Storage, RLS)

### Email & OTP
- Nodemailer (OTP, verification, recovery)

---

## 9. Data Stored

- User profiles
- Chat history
- Diary logs
- Images & PDFs
- Goals & habits
- Progress metrics

All data is encrypted, user‑controlled, and deletable.

---

## 10. Security & Ethics

- Explicit consent for photo analysis
- No medical or legal diagnosis
- No assistance for harmful intent
- Transparent AI behavior
- User privacy first

---

## 11. MVP Scope

### Phase 1
- Diary system
- FinMaxxer
- HabitMaxxer
- GoalMaxxer
- Shared memory
- Auth

### Phase 2
- RomanceMaxxer
- SituationMaxxer
- OCR uploads

### Phase 3
- LooksMaxxer
- CareerMaxxer
- Advanced pattern intelligence

---

## 12. Closing

LifeMaxxing is not about optimization.  
It is about **direction, awareness, and growth**.

A system users grow with.
