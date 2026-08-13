import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageAcfLayout } from "@/lib/page-layout";
import { buildPageMetadata } from "@/lib/seo";
import {
  fetchPageBySlug,
  fetchPublishedPageSlugs,
  hasPageLayout,
} from "@/lib/wp-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

/** Used only when WP returns no slugs, so `output: "export"` can still finish. */
const EXPORT_PLACEHOLDER_SLUG = "_";

function stripHtml(html: string | undefined): string {
  return html?.replace(/<[^>]+>/g, "").trim() ?? "";
}

/** Bake published WP pages into static HTML at build time. */
export async function generateStaticParams() {
  try {
    const slugs = await fetchPublishedPageSlugs();
    if (slugs.length > 0) {
      return slugs.map((slug) => ({ slug }));
    }
    console.warn(
      "No WordPress page slugs found. Check NEXT_PUBLIC_WP_API_URL. Using a placeholder so static export can finish."
    );
  } catch (error) {
    console.error("generateStaticParams failed:", error);
  }

  return [{ slug: EXPORT_PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home" || slug === EXPORT_PLACEHOLDER_SLUG) {
    return buildPageMetadata(null, slug, slug);
  }

  const page = await fetchPageBySlug(slug);
  if (!page) {
    return buildPageMetadata(null, slug, slug);
  }

  return buildPageMetadata(page, slug);
}

export default async function WpDynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "home" || slug === EXPORT_PLACEHOLDER_SLUG) {
    notFound();
  }

  const page = await fetchPageBySlug(slug);
  if (!page) {
    notFound();
  }

  if (hasPageLayout(page)) {
    return <PageAcfLayout layouts={page.acf.page_layout} />;
  }

  const title = stripHtml(page.title?.rendered) || slug;

  return (
    <main className="container py-10">
      <h1>{title}</h1>
      <p>
        Add sections in WordPress <strong>Page Layout</strong> for slug{" "}
        <strong>{slug}</strong>.
      </p>
    </main>
  );
}
