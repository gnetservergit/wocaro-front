/**
 * WordPress page fetching by slug (REST API + ACF flexible layouts).
 */
import { cache } from "react";
import { getWpApiUrl } from "@/lib/paths";
import { resolveLayoutImages } from "@/lib/wp-media";
import { wpFetchOptions } from "@/lib/wpfetch";

export interface WpRendered {
  rendered: string;
}

export type WpLayoutBlock = Record<string, unknown> & {
  acf_fc_layout?: string;
  acf_layout?: string;
};

/** Rank Math plugin data from WP REST (`rank_math` field). Not ACF. */
export interface RankMathSeo {
  title?: string;
  description?: string;
  focus_keyword?: string;
  robots?: string[];
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}

export interface WpPage {
  id: number;
  title: WpRendered;
  content: WpRendered;
  excerpt?: WpRendered;
  link?: string;
  featured_media?: number;
  /** Resolved featured image — only used as share-preview fallback. */
  featured_image_url?: string;
  rank_math?: RankMathSeo;
  acf?: {
    page_layout?: WpLayoutBlock[];
  };
}

export interface SiteInfo {
  name: string;
  description: string;
}

export const fetchSiteInfo = cache(async (): Promise<SiteInfo | null> => {
  const apiBase = getWpApiUrl();
  if (!apiBase) return null;

  try {
    const res = await fetch(`${apiBase}`, wpFetchOptions(["site-info"], 300));
    if (!res.ok) return null;

    const data = (await res.json()) as { name?: string; description?: string };
    const name = data.name?.trim();
    const description = data.description?.trim();
    if (!name && !description) return null;

    return {
      name: name || "Wocaro",
      description: description || "",
    };
  } catch (error) {
    console.error("Error fetching site info:", error);
    return null;
  }
});

async function fetchPageBySlugInternal(slug: string): Promise<WpPage | null> {
  const apiBase = getWpApiUrl();
  if (!slug || !apiBase) return null;

  try {
    const res = await fetch(
      `${apiBase}/wp/v2/pages?slug=${encodeURIComponent(slug)}&acf_format=standard`,
      wpFetchOptions([`page:${slug}`], 60)
    );
    if (!res.ok) return null;

    const pages = (await res.json()) as WpPage[];
    if (!pages.length) return null;

    const page = pages[0];

    const mediaId = typeof page.featured_media === "number" ? page.featured_media : 0;
    if (mediaId > 0) {
      try {
        const mediaRes = await fetch(
          `${apiBase}/wp/v2/media/${mediaId}?_fields=source_url`,
          wpFetchOptions([`media:${mediaId}`], 300)
        );
        if (mediaRes.ok) {
          const media = (await mediaRes.json()) as { source_url?: string };
          if (media.source_url) page.featured_image_url = media.source_url;
        }
      } catch {
        /* optional share image */
      }
    }

    if (page.acf?.page_layout?.length) {
      page.acf.page_layout = await resolveLayoutImages(page.acf.page_layout);
    }
    return page;
  } catch (error) {
    console.error("Error fetching WordPress page:", error);
    return null;
  }
}

export const fetchPageBySlug = cache(fetchPageBySlugInternal);

/** Published page slugs from WordPress (excludes `home`, which uses `/`). */
export async function fetchPublishedPageSlugs(): Promise<string[]> {
  const apiBase = getWpApiUrl();
  if (!apiBase) return [];

  try {
    const slugs: string[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await fetch(
        `${apiBase}/wp/v2/pages?per_page=100&page=${page}&status=publish&_fields=slug`,
        wpFetchOptions(["pages:list"], 300)
      );
      if (!res.ok) break;

      totalPages = Number(res.headers.get("X-WP-TotalPages") || 1);
      const items = (await res.json()) as { slug?: string }[];

      for (const item of items) {
        const slug = item.slug?.trim();
        if (slug && slug !== "home") {
          slugs.push(slug);
        }
      }

      page += 1;
    }

    return slugs;
  } catch (error) {
    console.error("Error fetching page slugs:", error);
    return [];
  }
}

export function hasPageLayout(page: WpPage | null | undefined): page is WpPage & {
  acf: { page_layout: WpLayoutBlock[] };
} {
  return Array.isArray(page?.acf?.page_layout) && page.acf.page_layout.length > 0;
}
