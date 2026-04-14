import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkBio — Onyedika",
  description: "Links, projects & contact for Onyedika Azubuike-Ufelle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] antialiased">{children}</body>
    </html>
  );
}
