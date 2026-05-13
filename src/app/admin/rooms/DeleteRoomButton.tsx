"use client";

import { useRouter } from "next/navigation";

export default function DeleteRoomButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this room?")) return;

    const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
    >
      Delete
    </button>
  );
}
