# Lumina - Multimodal Learning Assistant

> **Hackathon Submission**: Multimodal AI for Accessible Education

**Lumina** is an AI-powered learning platform designed to make educational content accessible to everyone, specifically targeting students with cognitive, visual, and auditory disabilities.

![Dashboard Preview](./public/dashboard-preview.png)

## 🌟 Key Features

### 1. **Multimodal Content Transformation**
- **Automated Simplification**: Uses GPT-4o to rewrite complex text to a Grade 5-6 reading level for cognitive accessibility.
- **Audio Generation**: Converts text to high-quality speech using Google Cloud TTS Studio voices.
- **Transcription**: (Planned/Mocked) Uploaded audio is transcribed using OpenAI Whisper.

### 2. **AI Teaching Assistant**
- **Context-Aware Q&A**: A floating chat assistant grounded in the specific lesson content.
- **Explain Like I'm 5**: Ask follow-up questions to break down difficult concepts.

### 3. **Accessibility First Design**
- **Learner Preferences**:
  - **Font Size**: Adjustable typography toggles.
  - **High Contrast Mode**: WCAG AAA compliant yellow-on-black theme.
  - **Reduced Motion**: Disables non-essential animations.
  - **Vegetable**: (Just kidding - Voice Navigation support is prepared).
- **Compliance**: Built with Radix UI primitives for full keyboard navigation and screen reader support (ARIA landmarks, Live Regions).

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: SQLite (Dev) / Prisma ORM
- **AI Services**:
  - OpenAI (GPT-4o, Whisper)
  - Google Cloud (Text-to-Speech)

## 🛠️ Setup & Running Locally

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd IASF-2K26
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and add your keys:
   ```env
   OPENAI_API_KEY=sk-...
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed data
   # npx ts-node prisma/seed.ts
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🧪 Deployment

This project is optimized for deployment on **Vercel**.
See `DEPLOYMENT.md` for detailed instructions.

## 📄 License

MIT License. Built for the IASF 2026 Hackathon.
