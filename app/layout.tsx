import type { Metadata } from "next";
import "./globals.css";

// Bewusst ohne Web-Fonts: Kundenwebsites nutzen später selbst gehostete Schriften
// (next/font/local, docs/10-sicherheitskonzept.md §B4) — kein Laufzeit-Request an Drittanbieter.
export const metadata: Metadata = {
  title: "Website nicht gefunden",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
