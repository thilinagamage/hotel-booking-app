import ReviewForm from "./ReviewForm";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null };
};

export default function ReviewList({
  reviews,
  roomId,
}: {
  reviews: Review[];
  roomId: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-900">
        Reviews ({reviews.length})
      </h2>

      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-stone-900">
                  {review.user.name ?? "Anonymous"}
                </p>
                <p className="mt-0.5 text-sm text-stone-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
              </div>
              <p className="text-xs text-stone-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-stone-700">{review.comment}</p>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-stone-500">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-stone-900">
          Leave a review
        </h3>
        <div className="mt-3">
          <ReviewForm roomId={roomId} />
        </div>
      </div>
    </div>
  );
}
