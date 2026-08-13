import type { Metadata } from "next";
import { fetchSiteInfo, type WpPage } from "@/lib/wp-pages";

function stripHtml(html: string | undefined): string {
  return html?.replace(/<[^>]+>/g, "").trim() ?? "";
}

/** Next.js path for alternates.canonical (resolved via metadataBase). */
export function getCanonicalPath(slug: string): string {
  if (slug === "home" || slug === "") return "/";
  return `/${slug.replace(/^\/+/, "")}/`;
}

/** SEO title + description from WP page title and site name / tagline (Settings → General). */
export async function buildPageMetadata(
  page: WpPage | null,
  slug: string,
  fallbackTitle?: string
): Promise<Metadata> {
  const site = await fetchSiteInfo();
  const siteName = site?.name || "Wocaro";
  const pageTitle = stripHtml(page?.title?.rendered) || fallbackTitle || slug;
  const title = `${pageTitle} - ${siteName}`;
  const description = site?.description || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalPath(slug),
    },
  };
}
