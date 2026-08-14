/**
 * ACF field helpers — normalize WordPress REST / ACF values for React components.
 */

export type AcfLink = { title?: string; url?: string; target?: string };

function wpSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_WP_SITE_URL ?? "").replace(/\/$/, "");
}

/**
 * Fix ACF/media URLs:
 * - strip bogus trailing slash after file extension (…/logo.png/)
 * - turn /wp-content/… into absolute WP host URL (needed on localhost + static host)
 */
export function normalizeWpMediaUrl(url: string): string {
  let u = url.trim();
  if (!u) return "";

  u = u.replace(/\.(png|jpe?g|gif|webp|svg|ico|avif)\/+$/i, ".$1");

  if (u.startsWith("http://") || u.startsWith("https://")) return u;

  if (u.startsWith("/wp-content/") || u.startsWith("/wp-includes/")) {
    const origin = wpSiteOrigin();
    return origin ? `${origin}${u}` : u;
  }

  return u;
}

// --- Images (ACF image field → url + alt string) ---

export function acfImageUrl(image: unknown): string {
  if (!image) return "";
  if (typeof image === "string") {
    if (image.startsWith("http") || image.startsWith("/")) {
      return normalizeWpMediaUrl(image);
    }
    return "";
  }
  if (typeof image === "object" && image !== null) {
    const record = image as {
      url?: string;
      source_url?: string;
      mime_type?: string;
      type?: string;
      sizes?: Record<string, unknown>;
    };

    const sizes = record.sizes;
    if (sizes && typeof sizes === "object") {
      for (const key of ["large", "medium_large", "medium", "thumbnail"] as const) {
        const sized = sizes[key];
        if (typeof sized === "string" && sized) {
          return normalizeWpMediaUrl(sized);
        }
      }
    }

    const raw = record.source_url || record.url || "";
    if (raw) return normalizeWpMediaUrl(raw);

    if (record.mime_type?.startsWith("image/") || record.type === "image") {
      return normalizeWpMediaUrl(record.url || record.source_url || "");
    }
    return "";
  }
  return "";
}

/** Alt text from ACF / WP media object (`alt`, then `title`), else fallback. */
export function acfImageAlt(image: unknown, fallback = ""): string {
  if (typeof image === "object" && image !== null) {
    const record = image as { alt?: string; title?: string };
    const alt = typeof record.alt === "string" ? record.alt.trim() : "";
    if (alt) return alt;
    const title = typeof record.title === "string" ? record.title.trim() : "";
    if (title) return title;
  }
  return fallback;
}

// select fields default value if they empty ---

export function acfSelectValue(value: unknown, fallback = ""): string {
  if (value == null || value === "") return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "value" in value) {
    const v = (value as { value?: unknown }).value;
    return typeof v === "string" ? v : fallback;
  }
  return fallback;
}

// add fallback for text if they empty

export function acfText(value: unknown, fallback = ""): string {
  if (value == null || value === "") return fallback;
  return String(value);
}
