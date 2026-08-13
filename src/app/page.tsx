import type { Metadata } from "next";
import { fetchPageBySlug, hasPageLayout } from "@/lib/wp-pages";
import { PageAcfLayout } from "@/lib/page-layout";
import { buildPageMetadata } from "@/lib/seo";

const HOME_SLUG = "home";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(HOME_SLUG);
  return await buildPageMetadata(page, HOME_SLUG, "Home");
}

export default async function HomePage() {
  const page = await fetchPageBySlug(HOME_SLUG);

  if (hasPageLayout(page)) {
    return <PageAcfLayout layouts={page.acf.page_layout} />;
  }

  return (
    <main className="container py-10">
      <h1>Home page not configured</h1>
      <p>
        Create a WordPress page with slug <strong>home</strong> and add sections in{" "}
        <strong>Page Layout</strong>.
      </p>
    </main>
  );
}
