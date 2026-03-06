import "./globals.css";

import type { Metadata, Viewport } from "next";

import { geistMono, geistSans } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://todosh-weld.vercel.app";

export const metadata: Metadata = {
  title: "Todosh",
  description: "A simple and fast Todo application",
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  openGraph: {
    title: "Todosh",
    description: "A simple and fast Todo application",
    url: siteUrl,
    siteName: "Todosh",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Todosh - Todo app",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todosh",
    description: "A simple and fast Todo application",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Todosh",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
