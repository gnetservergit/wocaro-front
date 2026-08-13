import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  slug?: string;
  tags?: string[];
  paths?: string[];
};

function slugToPath(slug: string): string {
  if (!slug || slug === "home") return "/";
  return `/${slug.replace(/^\//, "")}`;
}

export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const revalidatedTags = new Set<string>();
  const revalidatedPaths = new Set<string>();

  if (body.slug) {
    revalidateTag(`page:${body.slug}`);
    revalidatedTags.add(`page:${body.slug}`);
    const path = slugToPath(body.slug);
    revalidatePath(path);
    revalidatedPaths.add(path);
  }

  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (!tag) continue;
      revalidateTag(tag);
      revalidatedTags.add(tag);
    }
  }

  if (Array.isArray(body.paths)) {
    for (const path of body.paths) {
      if (!path) continue;
      revalidatePath(path.startsWith("/") ? path : `/${path}`);
      revalidatedPaths.add(path);
    }
  }

  return NextResponse.json({
    revalidated: true,
    tags: [...revalidatedTags],
    paths: [...revalidatedPaths],
    now: Date.now(),
  });
}
