import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { ErrorMonitor } from "@/components/error-monitor";
import { getAppOrigin } from "@/lib/app-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getAppOrigin()),
  title: {
    default: "Product Decision League",
    template: "%s | Product Decision League"
  },
  description:
    "Practice real product decisions, compare your reasoning with experienced product leaders, and build your PM career rating.",
  applicationName: "Product Decision League",
  openGraph: {
    type: "website",
    siteName: "Product Decision League",
    title: "Product Decision League",
    description:
      "Play real product decisions, defend your reasoning, and compare your call with the leader who lived it.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Decision League",
    description:
      "Play real product decisions and compare your call with the leader who lived it."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ErrorMonitor />
      </body>
    </html>
  );
}
