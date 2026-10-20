import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AnalyticsProvider } from "@/lib/analytics/posthog";
import { SITE_URL } from "@/lib/site";
import FloatingBackground from "@/components/ui/FloatingBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Master the Terminal in under 2 Hours | Terminal Mastery",
  description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
  keywords: "linux terminal, command line, terminal tutorial, bash commands, learn terminal, terminal course, linux commands",
  authors: [{ name: "Terminal Mastery" }],
  creator: "Terminal Mastery",
  publisher: "Terminal Mastery",
  category: "Education",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg'
  },
  openGraph: {
    title: "Master the Terminal in under 2 Hours",
    description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
    url: SITE_URL,
    siteName: "Terminal Mastery",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Master the Terminal in under 2 Hours",
    description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
    creator: "@terminal_mastery",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2188ff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-bg-primary text-text-primary`}
        suppressHydrationWarning={true}
      >
        <AnalyticsProvider>
          <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <div className="min-h-screen bg-bg-primary relative">
                <FloatingBackground />
                <main>
                  {children}
                </main>
              </div>
            </AppProvider>
          </AuthProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
