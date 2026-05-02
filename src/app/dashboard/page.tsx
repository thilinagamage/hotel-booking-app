export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 px-6 py-16 text-stone-900 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
          Guest Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Your reservations
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
          Manage your bookings, track your upcoming stays, and customize your
          preferences for future reservations at Serene Stay properties.
        </p>

        {/* Placeholder Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Active Bookings
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              You have no active reservations at this time.
            </p>
            <p className="mt-4 text-2xl font-semibold text-stone-900">0</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Total Nights
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Nights across all your reservations.
            </p>
            <p className="mt-4 text-2xl font-semibold text-stone-900">0</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">Spent</h3>
            <p className="mt-2 text-sm text-stone-600">
              Total amount spent on stays.
            </p>
            <p className="mt-4 text-2xl font-semibold text-stone-900">LKR 0</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Favorite Destination
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Your most-booked location.
            </p>
            <p className="mt-4 text-2xl font-semibold text-stone-900">—</p>
          </div>
        </div>
      </div>
    </main>
  );
}
