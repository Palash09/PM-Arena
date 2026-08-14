import type { MetadataRoute } from "next";

import { getAppOrigin } from "@/lib/app-url";
import { scenarios } from "@/lib/data/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAppOrigin();
  const updatedAt = new Date();
  const staticPaths = [
    "",
    "/scenarios",
    "/players",
    "/career",
    "/privacy",
    "/terms",
    "/attribution",
    "/contact"
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${origin}${path}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7
    })),
    ...scenarios.map((scenario) => ({
      url: `${origin}/challenge/${scenario.slug}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
