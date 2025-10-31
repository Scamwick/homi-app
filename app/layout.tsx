import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HōMI MVP - Home Buying Companion",
  description: "Your personalized homebuying and financial wellness companion",
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
