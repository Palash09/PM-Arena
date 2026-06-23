import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Product Arena Analytics",
  description: "Usage dashboard for Product Arena."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
