import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RoomSchema } from "@/lib/validations";
import { requireAdmin, handleApiError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};
    if (location) where.location = location;
    if (featured === "true") where.featured = true;

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rooms });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validated = RoomSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    const room = await prisma.room.create({ data: validated.data });

    return NextResponse.json({ room }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
