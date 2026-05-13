"use client";

import { useRouter } from "next/navigation";

export default function DeleteReviewButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;

    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="shrink-0 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
    >
      Delete
    </button>
  );
}
