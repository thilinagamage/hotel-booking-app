import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import UpdateBookingStatus from "./UpdateBookingStatus";

export default async function AdminBookings({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      room: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        Bookings
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Manage all reservations
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <a
            key={s}
            href={s ? `/admin/bookings?status=${s}` : "/admin/bookings"}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              (status ?? "") === s
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-600">Guest</th>
              <th className="px-4 py-3 font-medium text-stone-600">Room</th>
              <th className="px-4 py-3 font-medium text-stone-600">Dates</th>
              <th className="px-4 py-3 font-medium text-stone-600">Amount</th>
              <th className="px-4 py-3 font-medium text-stone-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="bg-white">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">
                    {booking.user.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-stone-500">
                    {booking.user.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {booking.room.name}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {new Date(booking.checkIn).toLocaleDateString()} &ndash;{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  LKR {booking.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <UpdateBookingStatus
                    bookingId={booking.id}
                    currentStatus={booking.status}
                  />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-stone-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
