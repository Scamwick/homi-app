import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HōMI - The Threshold Compass for Life's Biggest Decisions",
  description: "Translates scattered potential into focused readiness. Your AI companion for navigating career changes, relationships, relocations, and every threshold moment that shapes your life.",
  keywords: ["decision making", "life decisions", "AI companion", "threshold compass", "career change", "decision intelligence"],
  authors: [{ name: "HōMI Technologies LLC" }],
  openGraph: {
    title: "HōMI - The Threshold Compass",
    description: "Life's biggest decisions deserve more than a coin flip",
    url: "https://hōmi.com",
    siteName: "HōMI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HōMI - The Threshold Compass",
    description: "Life's biggest decisions deserve more than a coin flip",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
