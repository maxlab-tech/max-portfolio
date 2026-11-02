import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientConsoleFilter from "@/components/utils/ClientConsoleFilter";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Dynamic metadata base URL based on deployment environment
const isGithubPages = process.env.GITHUB_PAGES === "true";
const siteUrl = isGithubPages
  ? "https://maxlab-tech.github.io/max-portfolio"
  : "https://maxlab.tech";
const basePath = isGithubPages ? "/max-portfolio" : "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "maxlab — Interactive Launch Assets That Live & Evolve",
  description:
    "Persistent, interactive web experiences — 3D heroes, product configurators, scroll-driven stories. Built with React, GSAP & Three.js. Fixed scope. Fixed price. Delivered in 10–21 days.",
  keywords: [
    "interactive web",
    "3D hero",
    "product configurator",
    "GSAP",
    "Three.js",
    "React",
    "launch assets",
    "creative development",
  ],
  authors: [{ name: "Max Lab" }],
  creator: "Max Lab",
  publisher: "maxlab.tech",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "maxlab — Interactive Launch Assets That Live & Evolve",
    description:
      "Persistent, interactive web experiences — 3D heroes, product configurators, scroll-driven stories. Fixed scope. Fixed price.",
    siteName: "maxlab",
    images: [
      {
        url: isGithubPages ? `${siteUrl}/og-image.png` : `${basePath}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "maxlab — Interactive Launch Assets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "maxlab — Interactive Launch Assets",
    description:
      "Persistent, interactive web experiences — 3D heroes, product configurators, scroll-driven stories.",
    images: [isGithubPages ? `${siteUrl}/og-image.png` : `${basePath}/og-image.png`],
    creator: "@maxlab",
  },
  verification: {
    // Add verification tokens when available
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050508" },
    { media: "(prefers-color-scheme: dark)", color: "#050508" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maxlab.tech" />
        <link rel="icon" href={`${basePath}/favicon.ico`} sizes="any" />
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
        <link rel="manifest" href={`${basePath}/site.webmanifest`} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClientConsoleFilter />
        <main>{children}</main>
      </body>
    </html>
  );
}