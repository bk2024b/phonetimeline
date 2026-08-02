import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "PhoneTimeline",
  description: "L'historique complet des smartphones, marque par marque.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-ink font-body">{children}</body>
    </html>
  );
}
