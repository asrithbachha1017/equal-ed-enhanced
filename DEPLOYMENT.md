# Deployment Guide

This application is built with Next.js 14 and is designed to be deployed to **Vercel**.

## Prerequisites

1.  **Vercel Account**: [Sign up here](https://vercel.com/signup).
2.  **GitHub Repository**: Push your code to a GitHub repository.
3.  **API Keys**:
    *   OpenAI API Key
    *   Google Cloud Service Account JSON (Base64 encoded recommended for Env Vars)

## Steps

### 1. Database (PostgreSQL)
For production, you should switch from SQLite to PostgreSQL.
1.  Provision a Postgres database (e.g., Vercel Postgres, Neon, or Supabase).
2.  Update `schema.prisma`:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
3. Update `.env`:
    ```bash
    DATABASE_URL="postgres://user:pass@host:5432/db"
    ```

### 2. Environment Variables (Vercel)
Go to your Vercel Project Settings > Environment Variables and add:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL |
| `OPENAI_API_KEY` | Your OpenAI API Key |
| `GOOGLE_CREDENTIALS_JSON` | **CRITICAL**: Paste the *content* of your Google JSON file here. You will need to update `src/lib/ai/tts.ts` to parse this env var instead of reading a file path if deploying to Vercel (since it has no filesystem). |

### 3. Update Build Command
Vercel automatically detects Next.js.
- **Build Command**: `npx prisma generate && next build`
- **Output Directory**: `.next`

### 4. Deploy
1.  Connect your GitHub repo to Vercel.
2.  Click **Deploy**.
3.  Watch the build logs.

## Troubleshooting

-   **Google Credentials**: If you see "No credential found", ensure you updated the code to read from `process.env.GOOGLE_CREDENTIALS_JSON` or that you included the `google-credentials.json` file in the repo (NOT RECOMMENDED for security).
-   **Prisma Errors**: Ensure `npx prisma generate` runs before the build.
