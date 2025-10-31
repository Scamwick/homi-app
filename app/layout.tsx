import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HōMI - The Threshold Compass for Life's Biggest Decisions",
  description: "AI-powered decision intelligence for life's major choices. Get your readiness score for home buying, cars, investments, and career changes. We tell you: YES, NO, or NOT YET. Starting with home buying in 2025.",
  keywords: ["decision making", "life decisions", "AI companion", "threshold compass", "home buying", "first time home buyer", "career change", "decision intelligence", "AI decision assistant"],
  authors: [{ name: "HōMI Technologies LLC" }],
  openGraph: {
    title: "HōMI - Life's Biggest Decisions Deserve More Than a Coin Flip",
    description: "AI companion for major life decisions. Starting with home buying, expanding to cars, investments, and career changes.",
    url: "https://hōmi.com",
    siteName: "HōMI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HōMI - The Threshold Compass",
    description: "Life's biggest decisions deserve more than a coin flip. Get your readiness score now.",
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
