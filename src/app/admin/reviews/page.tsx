import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import DeleteReviewButton from "./DeleteReviewButton";

export default async function AdminReviews() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        Reviews
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Guest reviews and ratings
      </p>

      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-stone-900">
                  {review.user.name ?? "Anonymous"}
                </p>
                <p className="text-xs text-stone-500">
                  on {review.room.name}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                {review.comment && (
                  <p className="mt-2 text-sm text-stone-700">
                    {review.comment}
                  </p>
                )}
                <p className="mt-2 text-xs text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <DeleteReviewButton id={review.id} />
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-500">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
