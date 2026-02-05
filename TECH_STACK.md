# EqualEd Platform - Complete Technology Stack Analysis

---

## 1. Languages Used

| Language | Version | Usage |
|----------|---------|-------|
| **TypeScript** | 5.x | Primary language - full-stack type safety |
| **JavaScript** | ES2022+ | Runtime, npm scripts |
| **CSS** | CSS4 / Tailwind | Styling with utility classes |
| **SQL** | PostgreSQL | Database queries via Prisma |
| **HTML** | JSX/TSX | React component templates |

---

## 2. AI & Machine Learning Tools

### Computer Vision
| Tool | Purpose | Location |
|------|---------|----------|
| **TensorFlow.js** `@tensorflow/tfjs` | Browser-based ML runtime | Sign language recognition |
| **TensorFlow Handpose** `@tensorflow-models/handpose` | 21-point hand landmark detection | Real-time hand tracking |
| **Fingerpose** | Gesture classification from landmarks | ASL letter recognition |
| **MediaPipe Tasks Vision** `@mediapipe/tasks-vision` | On-device CV solutions | Gesture recognition fallback |

### Natural Language Processing
| Tool | Purpose | Location |
|------|---------|----------|
| **OpenAI GPT-4o** | Text simplification, Q&A, quiz generation | `src/lib/ai/openai.ts` |
| **OpenAI Whisper** | Speech-to-text transcription | `src/lib/ai/whisper.ts` |

### Speech Synthesis
| Tool | Purpose |
|------|---------|
| **Google Cloud TTS** `@google-cloud/text-to-speech` | High-quality voice narration |
| **Web Speech API** | Browser-native TTS fallback |

---

## 3. LLMs Used

| Model | Provider | Use Cases |
|-------|----------|-----------|
| **GPT-4o** | OpenAI | Text simplification, quiz generation, Q&A tutoring, content chat |
| **Whisper** | OpenAI | Speech-to-text transcription |
| **Google Neural Voices** | Google Cloud | Text-to-speech narration |

### LLM Integration Points
```
src/lib/ai/openai.ts     → simplifyText(), generateQuiz(), answerQuestion(), chatWithContent()
src/lib/ai/whisper.ts    → Speech-to-text API
src/lib/ai/tts.ts        → Text-to-speech synthesis
src/lib/ai/prompts.ts    → System prompts for LLM tasks
```

---

## 4. Terminology / Key Concepts

| Term | Definition |
|------|------------|
| **ASL** | American Sign Language - target alphabet for recognition |
| **Handpose** | TensorFlow model detecting 21 hand landmarks |
| **Fingerpose** | Library estimating gesture from landmark positions |
| **Prediction Smoother** | Temporal filtering for stable gesture predictions |
| **NextAuth** | Authentication library for session management |
| **Prisma** | Type-safe ORM for database operations |
| **XP (Experience Points)** | Gamification metric for student progress |
| **Accessibility Profile** | User preferences for visual/hearing/motor accommodations |
| **Content Simplification** | AI-powered text rewriting for readability |
| **Voice Navigation** | Hands-free app control via speech commands |

---

## 5. Utilities & Tools

### Frontend Framework
| Tool | Version | Purpose |
|------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.3 | UI component library |
| **Tailwind CSS** | 4.x | Utility-first styling |

### UI Components
| Tool | Purpose |
|------|---------|
| **Radix UI** | Accessible primitives (Dialog, Switch, Tabs, Select, etc.) |
| **Lucide React** | Icon library |
| **Three.js** + **React Three Fiber** | 3D graphics for avatar |
| **Recharts** | Data visualization charts |
| **Sonner** | Toast notifications |
| **Canvas Confetti** | Celebration animations |

### Backend & Data
| Tool | Purpose |
|------|---------|
| **Prisma** | Database ORM with PostgreSQL |
| **NextAuth.js** | JWT-based authentication |
| **bcryptjs** | Password hashing |
| **pdf-parse** | PDF content extraction |

### State & Data Fetching
| Tool | Purpose |
|------|---------|
| **TanStack Query** `@tanstack/react-query` | Server state management |
| **next-themes** | Dark/light mode toggle |

### Development Tools
| Tool | Purpose |
|------|---------|
| **TypeScript** | Static type checking |
| **ESLint** | Code linting |
| **tsx** | TypeScript execution for scripts |
| **Prisma CLI** | Database migrations & seeding |

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  React 19 + Tailwind CSS + Radix UI + Three.js              │
│  TensorFlow.js (Handpose + Fingerpose) - Browser ML         │
│  Web Speech API - Voice input/output                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER (Next.js API Routes)            │
├─────────────────────────────────────────────────────────────┤
│  /api/ai/simplify   → OpenAI GPT-4o                         │
│  /api/ai/qa         → OpenAI GPT-4o                         │
│  /api/tutor         → OpenAI GPT-4o                         │
│  /api/speech-to-text → OpenAI Whisper                       │
│  /api/auth          → NextAuth.js                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM - User, Course, Module, Assessment, Progress    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  OpenAI API     - GPT-4o, Whisper                           │
│  Google Cloud   - Text-to-Speech                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Key File Locations

| Category | Path |
|----------|------|
| AI/ML Integration | `src/lib/ai/` |
| Sign Language | `src/components/sign-language-view.tsx`, `src/lib/asl-gestures.ts` |
| Authentication | `src/lib/auth.ts`, `src/app/login/` |
| Database Schema | `prisma/schema.prisma` |
| Voice Features | `src/lib/voice/` |
| UI Components | `src/components/ui/` |
