import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "ResuMatch — AI-Powered Resume Analyzer & ATS Score Checker",
  description:
    "Get your resume scored against any job description with AI-powered ATS analysis. Receive detailed feedback on keywords, formatting, structure, and actionable improvement suggestions — completely free.",
  keywords: [
    "resume analyzer",
    "ATS score checker",
    "resume scanner",
    "ATS compatibility",
    "resume feedback",
    "job application tool",
    "AI resume review",
    "free resume checker",
  ],
  authors: [{ name: "ResuMatch Team" }],
  creator: "ResuMatch",
  openGraph: {
    title: "ResuMatch — AI Resume Analyzer & ATS Score Checker",
    description:
      "Score your resume against any job description with AI-powered analysis. Free, instant, and actionable feedback.",
    type: "website",
    siteName: "ResuMatch",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuMatch — AI Resume Analyzer",
    description: "Free AI-powered ATS score checker with detailed resume feedback.",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "ResuMatch",
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
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('resumatch-theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-gradient-animated min-h-screen flex flex-col">
        <ThemeProvider>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
