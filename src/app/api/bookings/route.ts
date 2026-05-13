import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BookingSchema } from "@/lib/validations";
import { requireAuth, handleApiError } from "@/lib/api-auth";

export async function GET() {
  try {
    const session = await requireAuth();

    const bookings = await prisma.booking.findMany({
      where: { userId: session.userId },
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validated = BookingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    const { roomId, checkIn, checkOut, guests } = validated.data;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 },
      );
    }

    if (checkInDate < new Date(new Date().toDateString())) {
      return NextResponse.json(
        { error: "Check-in cannot be in the past" },
        { status: 400 },
      );
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const overlapping = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: "CANCELLED" },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (overlapping.length > 0) {
      return NextResponse.json(
        { error: "Room is not available for the selected dates" },
        { status: 409 },
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalAmount = room.price * nights;

    const booking = await prisma.booking.create({
      data: {
        userId: session.userId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalAmount,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
