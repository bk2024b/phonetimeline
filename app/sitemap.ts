import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSitemapEntries } from "@/lib/queries/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/marques`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/timeline`, changeFrequency: "weekly", priority: 0.7 }
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.updatedAt ?? undefined,
    changeFrequency: entry.path.startsWith("/smartphones/") ? "monthly" : "weekly",
    priority: entry.path.startsWith("/smartphones/") ? 0.6 : 0.7
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
