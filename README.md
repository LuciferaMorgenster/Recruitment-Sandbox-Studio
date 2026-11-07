# Recruitment Sandbox

> Transform unformatted, messy hiring notes into high-converting **LinkedIn Job Descriptions** and rigorous **10-Question Behavioral Interview Guides** with STAR scoring rubrics.

![Recruitment Sandbox](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80)

---

## 💖 Sponsor Recruitment Sandbox

Recruitment Sandbox is an open-source project built with passion and dedication. Want to support the continued development of this project? You can!

**Sponsor this project by making a donation via PayPal:**

<div align="center">

### ☕ [Donate via PayPal](https://paypal.me/luciferamorgenster)

📧 **PayPal:** `luciferamorgenster@gmail.com`

</div>

Every donation, big or small, helps keep Ivory Tower BBS alive, fund new features, and support ongoing development. Thank you for your generosity! 🙏

---

## 🚀 Overview

Hiring managers often have fragmented thoughts: quick Slack messages, voice note transcriptions, and rough requirement bullet points. **Recruitment Sandbox** synthesizes these raw notes into two production-grade hiring assets:

1. **LinkedIn-Optimized Job Description**: Formatted specifically for high click-through rates and reader retention on LinkedIn, featuring scannable bullet points, clear differentiation between hard and soft skills, compensation callouts, and algorithm-friendly hashtags.
2. **10-Question Behavioral Interview Guide**: Exactly 10 structured behavioral questions derived directly from the extracted competencies (5 hard skills + 5 soft skills), complete with STAR methodology context, positive indicators (green flags), warning signs (red flags), probing follow-up questions, and 1-to-5 scoring rubrics.

In addition, the sandbox features an **interactive live candidate scorecard** and an integrated **Gemini Recruitment Copilot** supporting multi-turn chat, candidate interview simulation, and **High Thinking mode** via `gemini-4-argon`.

---

## ✨ Key Features

### 1. Raw Notes Scratchpad & Presets
- **Flexible Ingestion**: Paste unstructured text, Slack dumps, recruiter intake notes, or voice transcriptions.
- **One-Click Presets**:
  - *Staff Backend / Distributed Systems Engineer*
  - *Founding Product Manager (AI & Data)*
  - *Head of Growth Marketing (B2B SaaS)*
  - *Senior Product Designer (Design Systems & UX)*
- **Customizable Tuning**: Adjust seniority level, workplace model (Remote / Hybrid / On-site), tone (Bold & High Growth, Engineering-Centric, Corporate, Culture-First), and target compensation.

### 2. Output 1: LinkedIn-Optimized Job Description
- **LinkedIn Card Preview**: Visual simulation of the actual LinkedIn job post card and feed view.
- **Structured Sections**: Clean breakdown of Hook, Mission, Key Responsibilities, Hard Skills, Soft Skills, Bonus Qualifications, and Benefits.
- **Mobile-Scannable Formatting**: Line breaks and emoji anchors prevent wall-of-text fatigue.
- **Copy & Export**: One-click formatted copy with celebration confetti, Markdown export, and live character/word count indicators.

### 3. Output 2: 10-Question Behavioral Interview Guide
- **Targeted Competency Mapping**: 5 Hard Skill questions and 5 Soft Skill questions strictly mapped to the generated JD.
- **STAR Framework**: Behavioral questions framed to elicit specific Situations, Tasks, Actions, and Results.
- **Evaluation Criteria**:
  - 🟢 **Green Flags**: Observable behaviors indicating high competency.
  - 🔴 **Red Flags**: Warning signs, defensive answers, or lack of depth.
  - 🔍 **Probing Follow-Ups**: 2–3 drill-down questions to uncover the real story.
  - 📊 **1-to-5 Rubric**: Clear criteria for *Score 1 (Below Expectations)*, *Score 3 (Meets Expectations)*, and *Score 5 (Exceeds Expectations)*.
- **Interactive Live Scorecard**:
  - Rate candidates from 1 to 5 stars per question during interviews.
  - Check off observed green and red flags.
  - Record candidate notes.
  - Automatic calculation of the candidate's average score and recommendation (*Strong Hire*, *Hire*, *Leaning No*, *Strong No Hire*).
- **AI Answer Evaluator**: Paste a candidate's response into any question to receive an instant AI score and STAR breakdown against the rubric.

### 4. Multi-Turn Recruitment Copilot Chatbot
- **Scrollable Conversation History**: Maintains full context of the active role, JD, and questions.
- **Role Switcher**:
  - 🧑‍💼 **Recruitment Copilot**: Refines JDs, writes cold LinkedIn InMails, and benchmarks compensation.
  - 🎭 **Candidate Interview Simulator**: Roleplays as a candidate answering the 10 questions to help hiring managers calibrate their interviewing team.
  - ⚖️ **Scorecard Auditor**: Analyzes candidate interview notes and checks for unconscious bias.
- **Model Switcher**:
  - ⚡ `gemini-3.1-flash-lite`: Ultra-fast replies.
  - 🎯 `gemini-3.8-flash`: Balanced general engine.
  - 🧠 `gemini-4-argon`: Deep reasoning with **High Thinking** enabled.

---

## 🧠 High Thinking Mode

When enabled, the app routes queries through `gemini-4-argon` with:

```typescript
config: {
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.HIGH,
  },
}
```

This mode maximizes analytical depth for nuanced talent calibration, executive role synthesis, and rigorous rubric drafting without output token constraints.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend**: Node.js, Express, tsx.
- **AI Engine**: `@google/genai` TypeScript SDK (server-side only, keeping API keys secure).
- **Design System**: Dark slate theme, typography powered by *Plus Jakarta Sans* and *JetBrains Mono*.

---

## 📁 Project Structure

```
├── server.ts                    # Express server mounting Vite middleware & Gemini endpoints
├── index.html                   # HTML entry point with synchronized metadata & Google fonts
├── metadata.json                # AI Studio applet configuration & server-side Gemini capability
├── package.json                 # Dependencies and npm run scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── src/
│   ├── main.tsx                 # React client entry point
│   ├── index.css                # Global CSS with Tailwind CSS v4 import
│   ├── App.tsx                  # Primary workspace orchestrator & state manager
│   ├── types.ts                 # TypeScript interfaces for recruitment models
│   ├── data/
│   │   └── presets.ts           # 4 Realistic role templates for quick start
│   └── components/
│       ├── Header.tsx           # Navigation tabs, model indicator, and copilot toggle
│       ├── RoleInputPanel.tsx   # Notes scratchpad, presets, parameters, model controls
│       ├── JobDescriptionView.tsx# LinkedIn feed preview, section view, markdown export
│       ├── InterviewGuideView.tsx# 10 behavioral questions, rubrics, live candidate scorecard
│       └── ChatbotDrawer.tsx    # Multi-turn Gemini chatbot with role switcher
```

---

## 🔌 API Endpoints

### 1. `POST /api/generate-recruitment`
Synthesizes raw notes into the LinkedIn JD and 10-question behavioral guide.
- **Request Body**:
  ```json
  {
    "rawNotes": "string (required)",
    "roleTitle": "string",
    "seniority": "string",
    "workplaceType": "string",
    "tone": "string",
    "compensation": "string",
    "companyInfo": "string",
    "model": "gemini-3.8-flash | gemini-4-argon | gemini-3.1-flash-lite",
    "enableHighThinking": boolean
  }
  ```
- **Response**: Returns structured `roleSummary`, `jobDescription`, and an array of 10 `interviewGuide` questions.

### 2. `POST /api/chat`
Multi-turn recruitment copilot chat endpoint.
- **Request Body**:
  ```json
  {
    "messages": [{ "role": "user" | "model", "content": "string" }],
    "systemInstruction": "string",
    "model": "string",
    "enableHighThinking": boolean,
    "context": { "roleSummary": {}, "jobDescription": {}, "interviewGuide": [] }
  }
  ```
- **Response**: `{ "success": true, "reply": "string", "modelUsed": "string" }`

### 3. `POST /api/evaluate-answer`
Grades candidate interview answers against a specific question's 1-5 rubric.
- **Request Body**:
  ```json
  {
    "question": "string",
    "skillName": "string",
    "rubric": { "score1": "string", "score3": "string", "score5": "string" },
    "candidateAnswer": "string"
  }
  ```
- **Response**: `{ "score": 1-5, "hiringRecommendation": "string", "starBreakdown": {}, "strengths": [], "areasForImprovement": [] }`

---

## 🏃 Getting Started

1. **Environment Variables**:
   Ensure `GEMINI_API_KEY` is present in your environment (configured in `.env` or injected via Google AI Studio).

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The full-stack application will launch on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

Apache-2.0

---

<div align="center">

### 💖 Support Recruitment Sandbox Studio

This project is open-source and built with love.\
Help keep the project alive and fund its continued development!

**[☕ Donate via PayPal — luciferamorgenster@gmail.com](https://paypal.me/luciferamorgenster)**

Thank you for your support! 🙏

</div>
