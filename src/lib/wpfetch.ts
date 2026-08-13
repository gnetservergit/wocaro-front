/**
 * Shared fetch options for WordPress API calls.
 *
 * - Production/export: force-cache only (ISR/no-store breaks `output: "export"`).
 * - Development: shorter revalidate so ACF edits show up quickly.
 * - Override globally via WP_FETCH_REVALIDATE in .env (dev only).
 */
const IS_DEV = process.env.NODE_ENV === "development";

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
  if (!IS_DEV) {
    return { cache: "force-cache" };
  }

  const seconds = wpFetchRevalidate(revalidate);
  if (seconds <= 0) {
    return { cache: "no-store" };
  }

  return { next: { revalidate: seconds, tags } };
}
