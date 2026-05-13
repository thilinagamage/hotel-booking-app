import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

async function getStats() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const [totalRooms, totalBookings, totalUsers, activeBookings, revenueResult] =
    await Promise.all([
      prisma.room.count(),
      prisma.booking.count(),
      prisma.user.count(),
      prisma.booking.count({
        where: {
          status: "CONFIRMED",
          checkIn: { lte: new Date() },
          checkOut: { gte: new Date() },
        },
      }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

  return { totalRooms, totalBookings, activeBookings, totalUsers, revenue: revenueResult._sum.totalAmount ?? 0 };
}

export default async function AdminOverview() {
  const stats = await getStats();

  const cards = [
    { label: "Total Rooms", value: stats.totalRooms },
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Active Stays", value: stats.activeBookings },
    { label: "Total Guests", value: stats.totalUsers },
    { label: "Revenue", value: `LKR ${(stats.revenue).toLocaleString()}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        Overview
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Welcome to the Serene Stay admin panel
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
