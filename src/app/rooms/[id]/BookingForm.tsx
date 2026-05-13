"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({
  roomId,
  price,
}: {
  roomId: string;
  price: number;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(data.error ?? "Failed to create booking");
      setSaving(false);
    }
  };

  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-stone-600">
          Check in
        </label>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => setCheckIn(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-600">
          Check out
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || today}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-600">
          Guests
        </label>
        <input
          type="number"
          value={guests}
          min={1}
          max={20}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
        />
      </div>

      {nights > 0 && (
        <p className="text-sm text-stone-600">
          {nights} night{nights > 1 ? "s" : ""} &times; LKR{" "}
          {price.toLocaleString()} ={" "}
          <span className="font-semibold text-stone-900">
            LKR {(nights * price).toLocaleString()}
          </span>
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Booking..." : "Book now"}
      </button>
    </form>
  );
}
