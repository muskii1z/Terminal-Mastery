import type { Metadata } from "next";
import { COURSE_LENGTH } from "@/lessons/summary";
import { Geist, Geist_Mono, IBM_Plex_Sans, IBM_Plex_Mono, Martian_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AnalyticsProvider } from "@/lib/analytics/posthog";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Workbench type: Plex for reading and the terminal (IBM built the 3270
// terminals), Martian Mono for lesson titles only.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Terminal Mastery: learn the terminal by using it",
  description: `A free, hands-on terminal course for complete beginners: ${COURSE_LENGTH}. Type every command into a practice terminal that checks your work. Lesson 1 needs no sign-up.`,
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
    title: "Terminal Mastery: learn the terminal by using it",
    description: `A free, hands-on terminal course for complete beginners: ${COURSE_LENGTH}. Type every command into a practice terminal that checks your work. Lesson 1 needs no sign-up.`,
    url: SITE_URL,
    siteName: "Terminal Mastery",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terminal Mastery: learn the terminal by using it",
    description: `A free, hands-on terminal course for complete beginners: ${COURSE_LENGTH}. Type every command into a practice terminal that checks your work. Lesson 1 needs no sign-up.`,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved or system theme before first paint, so pages never
            flash the wrong colours and then fade into the right ones. Mirrors
            the logic in ThemeContext. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.add(t);r.classList.remove(t==='dark'?'light':'dark')}catch(e){}})();`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2188ff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plexSans.variable} ${plexMono.variable} ${martianMono.variable} antialiased min-h-screen bg-bg-primary text-text-primary`}
        suppressHydrationWarning={true}
      >
        <AnalyticsProvider>
          <ThemeProvider>
          <AuthProvider>
            <ProgressProvider>
              <div className="min-h-screen bg-bg-primary relative">{children}</div>
            </ProgressProvider>
          </AuthProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
