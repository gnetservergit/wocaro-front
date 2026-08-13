/**
 * ACF field helpers — normalize WordPress REST / ACF values for React components.
 */

export type AcfLink = { title?: string; url?: string; target?: string };

// --- Images (ACF image field → url + alt string) ---

export function acfImageUrl(image: unknown): string {
  if (!image) return "";
  if (typeof image === "string") {
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return "";
  }
  if (typeof image === "object" && image !== null) {
    const record = image as { url?: string; source_url?: string; mime_type?: string; type?: string };
    if (record.source_url) return record.source_url;
    if (record.url) return record.url;
    if (record.mime_type?.startsWith("image/") || record.type === "image") {
      return record.url || record.source_url || "";
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
