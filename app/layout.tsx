import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fr">
      <body className="bg-bg text-ink">{children}</body>
    </html>
  );
}
