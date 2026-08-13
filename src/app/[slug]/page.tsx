import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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

function stripHtml(html: string | undefined): string {
  return html?.replace(/<[^>]+>/g, "").trim() ?? "";
}

/** Bake published WP pages into static HTML at build time. */
export async function generateStaticParams() {
  const slugs = await fetchPublishedPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") {
    return buildPageMetadata(null, "home", "Home");
  }

  const page = await fetchPageBySlug(slug);
  if (!page) {
    return buildPageMetadata(null, slug, slug);
  }

  return buildPageMetadata(page, slug);
}

export default async function WpDynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "home") {
    redirect("/");
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
