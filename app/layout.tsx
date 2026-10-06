import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${site.name} — ${site.role}`;

// Set NEXT_PUBLIC_SITE_URL in your host (Cloudflare Pages) to your real domain.
// Accepts either a full URL ("https://jeanark.dev") or a bare domain ("jeanark.dev").
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://jeanark.dev";
const siteUrl = /^https?:\/\//i.test(rawSiteUrl)
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    site.name,
    "Infrastructure Engineer",
    "ML Engineer",
    "MLOps",
    "Data Engineering",
    "DevOps",
    "Python",
    "Docker",
    "Kubernetes",
    "Portfolio",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title,
    description: site.tagline,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <SmoothScroll>
            <Nav />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
