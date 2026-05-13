import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, handleApiError } from "@/lib/api-auth";

export async function GET() {
  try {
    await requireAdmin();

    const [totalRooms, totalBookings, totalUsers, revenueResult] =
      await Promise.all([
        prisma.room.count(),
        prisma.booking.count(),
        prisma.user.count(),
        prisma.booking.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: "CANCELLED" } },
        }),
      ]);

    const activeBookings = await prisma.booking.count({
      where: {
        status: "CONFIRMED",
        checkIn: { lte: new Date() },
        checkOut: { gte: new Date() },
      },
    });

    return NextResponse.json({
      totalRooms,
      totalBookings,
      activeBookings,
      totalUsers,
      revenue: revenueResult._sum.totalAmount ?? 0,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
