import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
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
  metadataBase: new URL('https://terminal-mastery.com'),
  title: "Master the Linux Terminal in 3 Minutes a Day | Terminal Mastery",
  description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
  keywords: "linux terminal, command line, terminal tutorial, bash commands, learn terminal, terminal course, linux commands",
  authors: [{ name: "Terminal Mastery" }],
  creator: "Terminal Mastery",
  publisher: "Terminal Mastery",
  category: "Education",
  openGraph: {
    title: "Master the Linux Terminal in 3 Minutes a Day",
    description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
    url: "https://terminal-mastery.com",
    siteName: "Terminal Mastery",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terminal Mastery - Free 20-lesson course",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Master the Linux Terminal in 3 Minutes a Day",
    description: "Beginner-friendly Linux terminal course with 20 bite-sized lessons. Practice commands, take quick quizzes, and track your progress — free.",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-bg-primary text-text-primary`}
      >
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
      </body>
    </html>
  );
}
