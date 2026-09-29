import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { Header } from "@/components/navigation/Header";
import { CommandPalette } from "@/components/navigation/CommandPalette";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-sans",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  display: "swap",
});

const notoHindi = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari"],
  variable: "--font-noto-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plotline | Digital Public Infrastructure for Land",
  description: "One parcel. One identity. Every department. Unified GIS land records stack with ULPIN.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${ibmSans.variable} ${ibmMono.variable} ${notoHindi.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink dark:bg-night dark:text-paper transition-colors duration-150 flex flex-col carto-contour-bg">
        <AppProvider>
          {/* Top progress line */}
          <div className="fixed top-0 left-0 right-0 h-[2px] bg-forest/40 dark:bg-forest/60 z-50 pointer-events-none" />
          <Header />
          <CommandPalette />
          <main className="flex-1 w-full">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
