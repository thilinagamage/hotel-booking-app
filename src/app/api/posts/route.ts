import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      title: body.title ?? "Untitled post",
      content: body.content ?? null,
      published: Boolean(body.published),
    },
    { status: 201 },
  );
}
