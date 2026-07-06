import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AccessibilityProvider } from "@/contexts/accessibility-context";
import { VoiceAssistantProvider } from "@/contexts/voice-assistant-context";
import { SignLanguageProvider } from "@/contexts/sign-language-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScreenNarrationProvider } from "@/components/accessibility/screen-narration-provider";
import { SiteFooter } from "@/components/layout/footer";
import { AccessibilityFeaturesWrapper } from "@/components/providers/accessibility-features-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EqualEd | Accessible Learning Platform for Everyone",
  description: "An accessible, AI-powered learning platform designed for everyone. EqualEd features a real-time sign language interpreter, voice navigation assistant, interactive math lab, and custom readability adjustments.",
  metadataBase: new URL("https://equal-ed.vercel.app"),
  openGraph: {
    title: "EqualEd | Accessible Learning Platform for Everyone",
    description: "An accessible, AI-powered learning platform designed for everyone. EqualEd features a real-time sign language interpreter, voice navigation assistant, interactive math lab, and custom readability adjustments.",
    url: "https://equal-ed.vercel.app",
    siteName: "EqualEd",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EqualEd | Accessible Learning Platform for Everyone",
    description: "An accessible, AI-powered learning platform designed for everyone. Features real-time sign language interpreter, voice assistant, and adaptive learning.",
  },
  keywords: ["accessibility", "special education", "inclusive learning", "sign language", "AI tutor", "voice navigation", "WCAG 2.1", "math drills"],
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
                    <SiteFooter />
                    <VoiceAssistantProvider>
                      {/* Global Voice Control and Accessibility features wrapper */}
                      <AccessibilityFeaturesWrapper />
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
