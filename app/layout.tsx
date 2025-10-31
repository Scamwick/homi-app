import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HōMI - AI-Powered Home Buying Readiness Assistant",
  description: "Find out if you're ready to buy a home. HōMI analyzes your finances, emotional readiness, and market timing to give you an honest answer: buy now or wait? No realtor pressure. No lender bias.",
  keywords: ["home buying", "house buying readiness", "first time home buyer", "mortgage calculator", "home affordability", "AI home buying assistant", "real estate decision tool", "buy or rent calculator"],
  authors: [{ name: "HōMI Technologies LLC" }],
  openGraph: {
    title: "HōMI - Are You Ready to Buy a Home?",
    description: "Buying a home deserves more than a coin flip. Get your home buying readiness score in 60 seconds.",
    url: "https://hōmi.com",
    siteName: "HōMI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HōMI - Home Buying Readiness Score",
    description: "Buying a home deserves more than a coin flip. Get your readiness score now.",
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
