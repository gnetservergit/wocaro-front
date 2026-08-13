/**
 * Shared fetch options for all WordPress API calls (ISR + cache tags).
 *
 * - Production: caches responses (default 60s pages, 300s menus/options).
 * - Development: shorter revalidate (15s) so ACF edits show up quickly.
 * - Override globally via WP_FETCH_REVALIDATE in .env.
 * - Tags (e.g. page:home) allow on-demand revalidation from /api/revalidate.
 */
const IS_DEV = process.env.NODE_ENV === "development";

/** Default ISR: 15s in dev, 60s pages / 300s menus in production (override via .env). */
const DEV_REVALIDATE_SECONDS = 15;

function envRevalidate(): number | null {
  const env = process.env.WP_FETCH_REVALIDATE;
  if (env === undefined || env === "") return null;
  const parsed = Number(env);
  return Number.isFinite(parsed) ? parsed : null;
}

export function wpFetchRevalidate(fallback: number): number {
  const fromEnv = envRevalidate();
  if (fromEnv !== null) return Math.max(0, fromEnv);
  if (IS_DEV) return DEV_REVALIDATE_SECONDS;
  return fallback;
}

export function wpFetchOptions(tags: string[], revalidate: number): RequestInit {
  const seconds = wpFetchRevalidate(revalidate);

  if (seconds <= 0) {
    return { cache: "no-store", next: { tags } };
  }

  return { next: { revalidate: seconds, tags } };
}
