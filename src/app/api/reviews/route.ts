import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ReviewSchema } from "@/lib/validations";
import { requireAuth, handleApiError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    const where: Record<string, unknown> = {};
    if (roomId) where.roomId = roomId;

    const reviews = await prisma.review.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validated = ReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    const { roomId, rating, comment } = validated.data;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        userId: session.userId,
        roomId,
        rating,
        comment,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
