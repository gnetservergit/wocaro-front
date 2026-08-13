/**
 * ACF Options pages from WordPress (header / footer settings).
 *
 * Fetches /custom/v1/options/{page} — global site settings stored in ACF Options,
 * not tied to a single post. Used by Header and Footer components.
 */
import { cache } from "react";
import { resolveMediaObject } from "@/lib/wp-media";
import { getWpApiUrl } from "@/lib/paths";
import { wpFetchOptions } from "@/lib/wpfetch";

async function fetchOptions(page: string): Promise<Record<string, unknown> | null> {
  const apiBase = getWpApiUrl();
  if (!apiBase) return null;

  try {
    const res = await fetch(
      `${apiBase}/custom/v1/options/${page}`,
      wpFetchOptions([`options:${page}`], 300)
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return resolveMediaObject(data);
  } catch (error) {
    console.error(`Error fetching options (${page}):`, error);
    return null;
  }
}

export const getHeaderOptions = cache(() => fetchOptions("header-settings"));
export const getFooterOptions = cache(() => fetchOptions("footer-settings"));

/** @deprecated use getHeaderOptions */
export const getOptions = getHeaderOptions;
