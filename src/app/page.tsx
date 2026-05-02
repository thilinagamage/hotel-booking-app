import Link from "next/link";

const featuredRooms = [
  {
    name: "Deluxe Suite",
    price: "LKR 48,000",
    details: "King bed, city view, breakfast included",
  },
  {
    name: "Garden Room",
    price: "LKR 36,000",
    details: "Quiet terrace, soft natural light, work desk",
  },
  {
    name: "Executive Corner",
    price: "LKR 64,000",
    details: "Corner suite, lounge access, late checkout",
  },
];

const perks = [
  "24-hour concierge",
  "Airport transfer",
  "Spa and wellness",
  "Fine dining",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8f4ee_0%,_#f3ede4_42%,_#ede5d8_100%)] text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-stone-300/70 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
              Serene Stay
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">
              Hotel booking made calm.
            </h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/about" className="transition hover:text-stone-900">
              About
            </Link>
            <Link href="/dashboard" className="transition hover:text-stone-900">
              Dashboard
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-stone-500 shadow-sm">
              Luxury stays
            </p>
            <h2 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              Find a quiet, elegant stay for your next city break.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              A simple hotel booking experience with thoughtful rooms, soft
              colors, and enough detail to feel real without feeling busy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-600">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 shadow-sm"
                >
                  {perk}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#booking"
                className="inline-flex items-center justify-center rounded-full border border-stone-950 bg-stone-950 px-6 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
                style={{ color: "#ffffff" }}
              >
                Book a stay
              </Link>
              <Link
                href="#rooms"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-400"
              >
                View rooms
              </Link>
            </div>
          </div>

          <aside
            id="booking"
            className="rounded-[2rem] border border-stone-300/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(79,58,34,0.12)] backdrop-blur"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-stone-600">
                Destination
                <select
                  defaultValue="galle"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                >
                  <option value="galle">Galle</option>
                  <option value="colombo">Colombo</option>
                  <option value="matara">Matara</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-stone-600">
                Guests
                <input
                  type="number"
                  min={1}
                  step={1}
                  defaultValue={2}
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                />
              </label>
              <label className="space-y-2 text-sm text-stone-600">
                Check in
                <input
                  type="date"
                  defaultValue="2026-05-15"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                />
              </label>
              <label className="space-y-2 text-sm text-stone-600">
                Check out
                <input
                  type="date"
                  defaultValue="2026-05-18"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                />
              </label>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800">
              Search availability
            </button>

            <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Available today
              </p>
              <div className="mt-3 flex items-end justify-between gap-6">
                <div>
                  <p className="text-lg font-semibold">Signature Suite</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Sea view, king bed, breakfast included
                  </p>
                </div>
                <p className="text-right text-2xl font-semibold tracking-tight">
                  LKR 56,000
                  <span className="ml-1 text-sm font-normal text-stone-500">
                    / night
                  </span>
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section id="rooms" className="pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Featured rooms
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                A few simple options.
              </h3>
            </div>
            <p className="hidden text-sm text-stone-500 sm:block">
              Clean layout, clear pricing, easy booking.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <article
                key={room.name}
                className="rounded-[1.75rem] border border-stone-300 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">{room.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {room.details}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-stone-900">
                    {room.price}
                    <span className="block text-xs font-normal text-stone-500">
                      per night
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
