/**
 * Site URLs and route mapping between WordPress and Next.js.
 *
 * - getSiteUrl / getWpApiUrl: read from env.
 * - toAppHref: convert WP permalinks to Next.js paths (e.g. /about).
 * - isNextStaticRoute: check if a path is a static route that Next.js can client-navigate.
 */

/** App routes that live at the Next.js root (not a WP subdirectory). */
const APP_ROOT_SEGMENTS = new Set([
  "services",
  "pricing",
  "about",
  "contact",
  "home",
]);

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

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  );
}

/** Collect origins whose absolute links should become Next.js paths. */
function rewriteOrigins(): URL[] {
  const origins: URL[] = [];
  const push = (raw: string | undefined) => {
    if (!raw) return;
    try {
      origins.push(new URL(raw));
    } catch {
      /* ignore bad env */
    }
  };

  push(getSiteUrl());
  push(process.env.NEXT_PUBLIC_WP_SITE_URL);
  // Legacy local installs often baked into ACF link fields.
  push("http://localhost/wocaro");
  push("http://localhost:3000");
  push("http://127.0.0.1/wocaro");

  return origins;
}

/**
 * Strip a WP subdirectory install prefix (e.g. /wocaro/contact → /contact).
 */
function stripWpBasePath(pathname: string, wpBasePath: string): string {
  const base = wpBasePath.replace(/\/$/, "");
  if (!base || base === "/") return pathname || "/";
  if (pathname === base || pathname === `${base}/`) return "/";
  if (pathname.startsWith(`${base}/`)) {
    return pathname.slice(base.length) || "/";
  }
  return pathname || "/";
}

/**
 * Local XAMPP-style URLs: http://localhost/wocaro/contact/
 * First segment is the WP folder, not a Next route — drop it.
 */
function stripLocalInstallFolder(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (APP_ROOT_SEGMENTS.has(parts[0])) {
    return `/${parts.join("/")}`;
  }
  // e.g. /wocaro/contact → /contact
  const rest = parts.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

function pathFromUrl(parsed: URL, wpBasePath: string, local: boolean): string {
  let path = parsed.pathname || "/";
  path = stripWpBasePath(path, wpBasePath);
  if (local) {
    path = stripLocalInstallFolder(path);
  }
  if (!path.startsWith("/")) path = `/${path}`;
  return path || "/";
}

/**
 * Convert WP / local absolute permalinks to in-app hrefs for Next.js.
 * Leaves real external URLs untouched.
 */
export function toAppHref(url: unknown): string {
  if (typeof url !== "string" || !url) return "/";
  if (url === "#") return "#";
  if (!url.startsWith("http")) return url.startsWith("/") ? url : `/${url}`;

  try {
    const parsed = new URL(url);
    const origins = rewriteOrigins();
    const local = isLocalHost(parsed.hostname);

    const matched = origins.find((o) => o.origin === parsed.origin);
    if (matched) {
      return pathFromUrl(parsed, matched.pathname, local);
    }

    // Any localhost / .local absolute link from old ACF content.
    if (local) {
      const wpSite = process.env.NEXT_PUBLIC_WP_SITE_URL;
      let wpBase = "/";
      if (wpSite) {
        try {
          wpBase = new URL(wpSite).pathname;
        } catch {
          wpBase = "/";
        }
      }
      // Prefer stripping /wocaro even when production WP_SITE_URL has no subdir.
      if (wpBase === "/" || wpBase === "") {
        wpBase = "/wocaro";
      }
      return pathFromUrl(parsed, wpBase, true);
    }

    // Live WP subdomain (wp.example.com) when env was missing at build time.
    if (parsed.hostname.startsWith("wp.")) {
      return pathFromUrl(parsed, "/", false);
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
