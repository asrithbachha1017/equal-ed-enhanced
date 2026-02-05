import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AccessibilityProvider } from "@/contexts/accessibility-context";
import { VoiceAssistantProvider } from "@/contexts/voice-assistant-context";
import { SignLanguageProvider } from "@/contexts/sign-language-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import VoiceControlOverlay from "@/components/voice-control-overlay";
import { AITutor } from "@/components/ai-tutor";
import { SignLanguageListener, SignLanguagePlayer, VrAvatarPanel } from "@/components/sign-language";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScreenNarrationProvider } from "@/components/accessibility/screen-narration-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EqualEd | Access to Learning for Everyone",
  description: "An accessible, AI-powered learning platform designed for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AccessibilityProvider>
                <ScreenNarrationProvider>
                  <SignLanguageProvider>
                    <a
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border-2 focus:border-primary top-0 left-0"
                    >
                      Skip to main content
                    </a>
                    <div id="main-content" className="flex-1">
                      {children}
                    </div>
                    <VoiceAssistantProvider>
                      {/* Global Voice Control Overlay - Floating above all content */}
                      <Suspense fallback={null}>
                        <VoiceControlOverlay />
                        <AITutor />
                        {/* Sign Language Translation Feature */}
                        <SignLanguageListener />
                        <SignLanguagePlayer />
                        <VrAvatarPanel />
                      </Suspense>
                      <Toaster />
                    </VoiceAssistantProvider>
                  </SignLanguageProvider>
                </ScreenNarrationProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
