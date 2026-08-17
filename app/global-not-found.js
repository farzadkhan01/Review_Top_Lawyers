/** @format */

import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Page Not Found | Review Top Lawyers",
  description: "The page you are looking for does not exist or may have been moved.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-4 text-center font-sans text-navy-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">404</p>
        <h1 className="text-3xl font-semibold text-navy-900">Page not found</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-navy-800"
        >
          Back to Home
        </Link>
      </body>
    </html>
  );
}
