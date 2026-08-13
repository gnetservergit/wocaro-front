/**
 * ACF / WordPress media ID resolution.
 *
 * ACF often returns image fields as numeric IDs. This module batch-fetches
 * /wp/v2/media and replaces IDs with { id, url, alt } so components get real URLs.
 */
import { acfImageAlt, acfImageUrl } from "@/lib/acf";
import { getWpApiUrl } from "@/lib/paths";
import { wpFetchOptions } from "@/lib/wpfetch";

type MediaMeta = { url: string; alt: string };

const MEDIA_KEYS = new Set([
  "background_image",
  "bannerImg",
  "logos",
  "step_images",
  "img",
  "image",
  "site_logo",
  "footer_logo",
]);

function mediaId(value: unknown): number | null {
  if (typeof value === "number" && value > 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) return Number(value);
  if (typeof value === "object" && value !== null) {
    const id = (value as { id?: number; ID?: number }).id ?? (value as { ID?: number }).ID;
    if (typeof id === "number" && id > 0) return id;
  }
  return null;
}

/** Walk an object tree and gather all media attachment IDs from known image fields. */
function collectMediaIds(value: unknown, key: string | undefined, ids: Set<number>): void {
  if (value == null) return;

  if (key && MEDIA_KEYS.has(key)) {
    const id = mediaId(value);
    if (id) ids.add(id);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectMediaIds(item, key, ids);
    return;
  }

  if (typeof value === "object") {
    for (const [k, nested] of Object.entries(value as Record<string, unknown>)) {
      if (k === "acf_fc_layout" || k === "acf_layout") continue;
      collectMediaIds(nested, k, ids);
    }
  }
}

/** Turn a media ID or partial object into { id, url, alt } using batch-fetched meta. */
function normalizeMediaValue(value: unknown, meta: Record<number, MediaMeta>): unknown {
  const id = mediaId(value);
  const url = acfImageUrl(value);
  const fromApi = id ? meta[id] : undefined;

  if (typeof value === "object" && value !== null && url) {
    const alt = acfImageAlt(value, fromApi?.alt ?? "");
    return { ...(value as Record<string, unknown>), url, alt: alt || fromApi?.alt || "" };
  }

  if (typeof value === "number" && fromApi) {
    return { id: value, url: fromApi.url, alt: fromApi.alt };
  }

  if (id && fromApi) {
    return { id, url: fromApi.url, alt: fromApi.alt };
  }

  if (url) return url;

  return value;
}

function applyMediaMeta(
  value: unknown,
  key: string | undefined,
  meta: Record<number, MediaMeta>
): unknown {
  if (value == null) return value;

  if (key && MEDIA_KEYS.has(key)) {
    return normalizeMediaValue(value, meta);
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyMediaMeta(item, key, meta));
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, nested] of Object.entries(value as Record<string, unknown>)) {
      result[k] = applyMediaMeta(nested, k, meta);
    }
    return result;
  }

  return value;
}

/** Batch-fetch source_url + alt_text for all media IDs in one REST call. */
async function fetchMediaMeta(ids: number[]): Promise<Record<number, MediaMeta>> {
  const apiBase = getWpApiUrl();
  const unique = [...new Set(ids.filter((id) => id > 0))];
  if (!unique.length || !apiBase) return {};

  try {
    const res = await fetch(
      `${apiBase}/wp/v2/media?include=${unique.join(",")}&per_page=${unique.length}`,
      wpFetchOptions(
        unique.map((id) => `media:${id}`),
        3600
      )
    );
    if (!res.ok) return {};

    const items = (await res.json()) as Array<{
      id: number;
      source_url?: string;
      alt_text?: string;
    }>;
    const meta: Record<number, MediaMeta> = {};
    for (const item of items) {
      if (item.source_url) {
        meta[item.id] = {
          url: item.source_url,
          alt: (item.alt_text ?? "").trim(),
        };
      }
    }
    return meta;
  } catch (error) {
    console.error("Error fetching media:", error);
    return {};
  }
}

/** Resolve media IDs anywhere in an object tree (options pages, layouts, etc.). */
export async function resolveMediaObject<T>(value: T): Promise<T> {
  const ids = new Set<number>();
  collectMediaIds(value, undefined, ids);
  if (!ids.size) return value;

  const meta = await fetchMediaMeta([...ids]);
  return applyMediaMeta(value, undefined, meta) as T;
}

/** Replace raw media IDs inside page_layout blocks with resolved url + alt. */
export async function resolveLayoutImages<T extends Record<string, unknown>>(
  layouts: T[]
): Promise<T[]> {
  const ids = new Set<number>();
  for (const layout of layouts) collectMediaIds(layout, undefined, ids);
  if (!ids.size) return layouts;

  const meta = await fetchMediaMeta([...ids]);
  return layouts.map((layout) => applyMediaMeta(layout, undefined, meta) as T);
}
