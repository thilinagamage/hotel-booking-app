import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default async function DashboardPage() {
  const session = await verifySession();

  const bookings = await prisma.booking.findMany({
    where: { userId: session.userId },
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  const activeBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING",
  );
  const totalNights = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => {
      const nights = Math.ceil(
        (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + nights;
    }, 0);
  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const locationCounts: Record<string, number> = {};
  bookings
    .filter((b) => b.status !== "CANCELLED")
    .forEach((b) => {
      locationCounts[b.room.location] =
        (locationCounts[b.room.location] ?? 0) + 1;
    });
  const favoriteDest = Object.entries(locationCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 px-6 py-16 text-stone-900 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
          Guest Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Your reservations
        </h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Active Bookings
            </h3>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {activeBookings.length}
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Total Nights
            </h3>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {totalNights}
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Total Spent
            </h3>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              LKR {totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Favorite Destination
            </h3>
            <p className="mt-2 text-2xl font-semibold capitalize text-stone-900">
              {favoriteDest ? favoriteDest[0] : "\u2014"}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-stone-900">
            Booking History
          </h2>

          <div className="mt-4 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-stone-900">
                      {booking.room.name}
                    </p>
                    <p className="mt-0.5 text-sm capitalize text-stone-500">
                      {booking.room.location}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {new Date(booking.checkIn).toLocaleDateString()} &ndash;{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-stone-600">
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""} &middot; LKR{" "}
                      {booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusColors[booking.status] ??
                        "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {(booking.status === "CONFIRMED" ||
                      booking.status === "PENDING") && (
                      <CancelBookingButton bookingId={booking.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-stone-500">No bookings yet.</p>
                <Link
                  href="/rooms"
                  className="mt-3 inline-block rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
                >
                  Browse rooms
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
