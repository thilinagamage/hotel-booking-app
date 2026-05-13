"use client";

import { useRouter } from "next/navigation";

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={handleCancel}
      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
    >
      Cancel
    </button>
  );
}
