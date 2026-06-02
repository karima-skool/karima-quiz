import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Karima Academy Course Finder",
  description: "Find the right Islamic course for where you are in your journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: "#1A1A1A" }}>
      <body className={inter.className} style={{ backgroundColor: "#1A1A1A", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
