import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, handleApiError } from "@/lib/api-auth";

export async function GET() {
  try {
    await requireAdmin();

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true } },
        room: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}
