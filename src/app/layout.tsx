import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Corevo — Business Operating System",
    template: "%s · Corevo Business OS",
  },
  description:
    "Corevo unifies lead management, sales pipeline, KYC compliance and daily operations into one business operating system. Explore the live demo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
