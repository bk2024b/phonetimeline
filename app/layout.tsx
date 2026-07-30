import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneTimeline",
  description: "L'historique complet des smartphones, marque par marque."
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
