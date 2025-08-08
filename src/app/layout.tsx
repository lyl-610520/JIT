import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import StickyPlayer from "./components/StickyPlayer";
import AddToHomePrompt from "./components/AddToHomePrompt";
import InitClient from "./components/InitClient";
import IntroOverlay from "./components/IntroOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "just in time（恰逢其时）",
  description: "沉浸式美学 PWA",
  applicationName: "just in time",
  manifest: "/manifest.webmanifest",
  category: "lifestyle",
  keywords: ["PWA", "immersive", "glassmorphism", "aesthetics"],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0b0f14" }, { media: "(prefers-color-scheme: light)", color: "#f2f5f8" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "just in time",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <InitClient />
          <IntroOverlay />
          <StickyPlayer />
          {children}
          <AddToHomePrompt />
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
