import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civic Intelligence & Simulation Platform",
  description: "AI-Powered Civic Learning System for responsible citizens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
