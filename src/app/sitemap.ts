import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/paths";
import { fetchPublishedPageSlugs } from "@/lib/wp-pages";

export const dynamic = "force-static";
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const slugs = await fetchPublishedPageSlugs();

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
