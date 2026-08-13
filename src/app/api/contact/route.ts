import { NextRequest, NextResponse } from "next/server";

type ContactBody = {
  names?: string;
  email?: string;
  description?: string;
};

export async function POST(request: NextRequest) {
  const wpApi = (process.env.NEXT_PUBLIC_WP_API_URL ?? "").replace(/\/$/, "");

  if (!wpApi) {
    return NextResponse.json(
      { success: false, message: "WordPress API is not configured." },
      { status: 503 }
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = process.env.CONTACT_FORM_SECRET;
  if (secret) {
    headers["x-contact-secret"] = secret;
  }

  try {
    const res = await fetch(`${wpApi}/custom/v1/fluentform-submit`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as { success?: boolean; message?: string };

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }
}
