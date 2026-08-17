/** @format */

import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import MotionProvider from "@/components/layout/MotionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: {
    default: "Admin Portal | Review Top Lawyers",
    template: "%s | Admin Portal",
  },
  description: "Private content-management area for Review Top Lawyers.",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101d2e",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream-100 font-sans text-navy-900 antialiased overflow-x-hidden">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
