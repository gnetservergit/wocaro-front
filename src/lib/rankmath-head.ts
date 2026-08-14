/**
 * Rank Math headless `getHead` — fetch, rewrite CMS host → public site, parse tags.
 * Media URLs under /wp-content/uploads stay on the WP host.
 */
import { cache } from "react";
import { getSiteUrl, getWpApiUrl } from "@/lib/paths";
import { wpFetchOptions } from "@/lib/wpfetch";

export type RankMathHeadMeta = {
  title?: string;
  description?: string;
  robots?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogSiteName?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
};

function getWpSiteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_WP_SITE_URL ||
    getWpApiUrl().replace(/\/wp-json\/?$/, "");
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/gi, "/");
}

/** Rewrite CMS page URLs to the public site; keep /wp-content/uploads on WP. */
export function rewriteCmsUrlsToPublic(input: string): string {
  const wpOrigin = getWpSiteOrigin();
  const site = getSiteUrl();
  if (!wpOrigin || !site || !input.includes(wpOrigin)) return input;

  let siteOrigin = site;
  try {
    siteOrigin = new URL(site).origin;
  } catch {
    /* keep site as-is */
  }

  // Don't rewrite media / content uploads onto the frontend host.
  const parts = input.split(wpOrigin);
  let out = parts[0] ?? "";
  for (let i = 1; i < parts.length; i++) {
    const rest = parts[i] ?? "";
    if (rest.startsWith("/wp-content/") || rest.startsWith("/wp-includes/")) {
      out += wpOrigin + rest;
    } else {
      out += siteOrigin + rest;
    }
  }
  return out;
}

function attr(html: string, name: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  );
  const m = html.match(re) || html.match(re2);
  return m?.[1] ? decodeEntities(m[1]) : "";
}

function titleTag(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : "";
}

function linkCanonical(html: string): string {
  const m = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  ) || html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i
  );
  return m?.[1] ? decodeEntities(m[1]) : "";
}

function parseRobots(content: string): string[] {
  return content
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}

export function parseRankMathHeadHtml(headHtml: string): RankMathHeadMeta {
  const rewritten = rewriteCmsUrlsToPublic(headHtml);
  const robotsRaw = attr(rewritten, "robots");

  return {
    title: titleTag(rewritten) || undefined,
    description: attr(rewritten, "description") || undefined,
    robots: robotsRaw ? parseRobots(robotsRaw) : undefined,
    canonical: attr(rewritten, "canonical") || linkCanonical(rewritten) || undefined,
    ogTitle: attr(rewritten, "og:title") || undefined,
    ogDescription: attr(rewritten, "og:description") || undefined,
    ogImage: attr(rewritten, "og:image") || undefined,
    ogUrl: attr(rewritten, "og:url") || undefined,
    ogSiteName: attr(rewritten, "og:site_name") || undefined,
    twitterTitle: attr(rewritten, "twitter:title") || undefined,
    twitterDescription: attr(rewritten, "twitter:description") || undefined,
    twitterImage: attr(rewritten, "twitter:image") || undefined,
    twitterCard: attr(rewritten, "twitter:card") || undefined,
  };
}

/** WP permalink for Rank Math getHead (home → site root). */
export function wpPermalinkForSlug(slug: string): string {
  const wp = (process.env.NEXT_PUBLIC_WP_SITE_URL ?? "").replace(/\/$/, "");
  if (!wp) return "";
  if (slug === "home" || slug === "") return `${wp}/`;
  return `${wp}/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

async function fetchRankMathHeadInternal(wpUrl: string): Promise<RankMathHeadMeta | null> {
  const apiBase = getWpApiUrl();
  if (!apiBase || !wpUrl) return null;

  try {
    const endpoint = `${apiBase}/rankmath/v1/getHead?url=${encodeURIComponent(wpUrl)}`;
    const res = await fetch(endpoint, wpFetchOptions([`rankmath-head:${wpUrl}`], 60));
    if (!res.ok) return null;

    const data = (await res.json()) as { success?: boolean; head?: string };
    if (!data?.success || typeof data.head !== "string" || !data.head) return null;

    return parseRankMathHeadHtml(data.head);
  } catch (error) {
    console.error("Rank Math getHead failed:", error);
    return null;
  }
}

export const fetchRankMathHead = cache(fetchRankMathHeadInternal);

/** Share-image fallback when Rank Math getHead has no og:image / twitter:image. */
export function defaultShareImageUrl(): string {
  const wp = (process.env.NEXT_PUBLIC_WP_SITE_URL ?? "").replace(/\/$/, "");
  if (wp) return `${wp}/wp-content/uploads/2026/08/logo.png`;

  const site = getSiteUrl();
  return site ? `${site}/images/logo.png` : "/images/logo.png";
}
