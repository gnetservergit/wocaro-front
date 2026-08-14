/**
 * Site URLs and route mapping between WordPress and Next.js.
 *
 * - getSiteUrl / getWpApiUrl: read from env.
 * - toAppHref: convert WP / site absolute permalinks to Next.js paths (e.g. /about).
 * - isNextStaticRoute: check if a path is a static route that Next.js can client-navigate.
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
}

/** Safe origin for Next metadataBase during static export. */
export function getMetadataBase(): URL {
  const site = getSiteUrl();
  try {
    return new URL(site || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function getWpApiUrl(): string {
  return (process.env.NEXT_PUBLIC_WP_API_URL ?? "").replace(/\/$/, "");
}

/**
 * Convert WP / public-site absolute permalinks to in-app hrefs for Next.js.
 * Leaves real external URLs (and any leftover localhost content) untouched —
 * update those links in WordPress admin if needed.
 */
export function toAppHref(url: unknown): string {
  if (typeof url !== "string" || !url) return "/";
  if (url === "#") return "#";
  if (!url.startsWith("http")) return url.startsWith("/") ? url : `/${url}`;

  try {
    const parsed = new URL(url);
    const siteUrl = getSiteUrl();
    if (siteUrl) {
      const site = new URL(siteUrl);
      if (parsed.origin === site.origin) return parsed.pathname || "/";
    }

    const wpSite = process.env.NEXT_PUBLIC_WP_SITE_URL;
    if (wpSite) {
      const wp = new URL(wpSite);
      if (parsed.origin === wp.origin) {
        const base = wp.pathname.replace(/\/$/, "");
        let path = parsed.pathname;
        if (base && path.startsWith(base)) path = path.slice(base.length) || "/";
        return path || "/";
      }
    }
  } catch {
    return url;
  }

  return url;
}

/** True for in-app paths that Next.js can client-navigate (any internal route). */
export function isNextStaticRoute(path: string): boolean {
  if (!path || path === "#") return false;
  if (path.startsWith("http://") || path.startsWith("https://")) return false;
  return path.startsWith("/");
}

// Navigation header active menu
export function stripBasePathFromPathname(pathname: string | null): string | null {
  return pathname;
}
