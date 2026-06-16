import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Product Arena",
  description:
    "A football-inspired PM decision simulator built from product management podcast transcripts."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
