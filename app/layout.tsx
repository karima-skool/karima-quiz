import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html lang="en" style={{ backgroundColor: "#ffffff" }}>
      <body className={poppins.className} style={{ backgroundColor: "#ffffff", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
