import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "CivicPulse AI | High-Fidelity Civic Intelligence Hub",
    template: "%s | CivicPulse AI"
  },
  description: "Empowering citizens with grounded AI-verified election knowledge, localized news, and digital voting simulations.",
  keywords: ["CivicPulse", "Election India", "Voting Simulation", "Civic Education", "AI Election Assistant", "Gemini AI"],
  authors: [{ name: "CivicPulse Team" }],
  openGraph: {
    title: "CivicPulse AI: The Future of Civic Intelligence",
    description: "Verified election knowledge and immersive voting simulations powered by Google Gemini.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CivicPulse AI",
    description: "AI-Powered Civic Learning System for responsible citizens.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-lg z-50">
          Skip to content
        </a>
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
