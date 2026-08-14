import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/paths";
import {
  defaultShareImageUrl,
  fetchRankMathHead,
  wpPermalinkForSlug,
  type RankMathHeadMeta,
} from "@/lib/rankmath-head";
import type { WpPage } from "@/lib/wp-pages";

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

/** Next.js path for alternates.canonical (resolved via metadataBase). */
export function getCanonicalPath(slug: string): string {
  if (slug === "home" || slug === "") return "/";
  return `/${slug.replace(/^\/+/, "")}/`;
}

function robotsFromList(robots: string[] | undefined): Metadata["robots"] | undefined {
  if (!robots?.length) return undefined;

  const set = new Set(robots.map((r) => r.toLowerCase()));
  return {
    index: !set.has("noindex"),
    follow: !set.has("nofollow"),
    nocache: set.has("noarchive") || undefined,
    noimageindex: set.has("noimageindex") || undefined,
  };
}

function canonicalPathFromHead(head: RankMathHeadMeta, slug: string): string {
  const custom = cleanText(head.canonical) || cleanText(head.ogUrl);
  if (!custom) return getCanonicalPath(slug);

  if (custom.startsWith("http://") || custom.startsWith("https://")) {
    try {
      return new URL(custom).pathname || getCanonicalPath(slug);
    } catch {
      return getCanonicalPath(slug);
    }
  }

  return custom.startsWith("/") ? custom : `/${custom}`;
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const site = getSiteUrl();
  if (!site) return pathOrUrl;
  return `${site}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * SEO from Rank Math getHead only.
 * Exception: share image → featured image → site logo when getHead has no image.
 */
export async function buildPageMetadata(
  page: WpPage | null,
  slug: string,
  _fallbackTitle?: string
): Promise<Metadata> {
  const wpUrl = page?.link || wpPermalinkForSlug(slug);
  const head = wpUrl ? await fetchRankMathHead(wpUrl) : null;

  if (!head) {
    const fallbackImage = cleanText(page?.featured_image_url) || defaultShareImageUrl();
    return {
      alternates: { canonical: getCanonicalPath(slug) },
      openGraph: {
        type: "website",
        url: getCanonicalPath(slug),
        images: [{ url: absoluteUrl(fallbackImage) }],
      },
      twitter: {
        card: "summary_large_image",
        images: [absoluteUrl(fallbackImage)],
      },
    };
  }

  const title = cleanText(head.title) || undefined;
  const description = cleanText(head.description) || undefined;
  const canonicalPath = canonicalPathFromHead(head, slug);
  const siteName = cleanText(head.ogSiteName) || undefined;

  const ogTitle = cleanText(head.ogTitle) || title;
  const ogDescription = cleanText(head.ogDescription) || description;
  const shareImage =
    cleanText(head.ogImage) ||
    cleanText(head.twitterImage) ||
    cleanText(page?.featured_image_url) ||
    defaultShareImageUrl();

  const twitterTitle = cleanText(head.twitterTitle) || ogTitle;
  const twitterDescription = cleanText(head.twitterDescription) || ogDescription;
  const twitterImage = cleanText(head.twitterImage) || shareImage;
  const twitterCard =
    cleanText(head.twitterCard) || (twitterImage ? "summary_large_image" : "summary");

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    robots: robotsFromList(head.robots),
    openGraph: {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      url: canonicalPath,
      ...(siteName ? { siteName } : {}),
      type: "website",
      images: [{ url: absoluteUrl(shareImage) }],
    },
    twitter: {
      card: twitterCard as "summary" | "summary_large_image",
      ...(twitterTitle ? { title: twitterTitle } : {}),
      ...(twitterDescription ? { description: twitterDescription } : {}),
      images: [absoluteUrl(twitterImage)],
    },
  };
}
