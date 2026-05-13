import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import DeleteRoomButton from "./DeleteRoomButton";

export default async function AdminRooms() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Rooms
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Manage your property rooms
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          Add room
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="px-4 py-3 font-medium text-stone-600">Location</th>
              <th className="px-4 py-3 font-medium text-stone-600">Price</th>
              <th className="px-4 py-3 font-medium text-stone-600">Capacity</th>
              <th className="px-4 py-3 font-medium text-stone-600">Featured</th>
              <th className="px-4 py-3 font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rooms.map((room) => (
              <tr key={room.id} className="bg-white">
                <td className="px-4 py-3 font-medium text-stone-900">
                  {room.name}
                </td>
                <td className="px-4 py-3 capitalize text-stone-600">
                  {room.location}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  LKR {room.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-stone-600">{room.capacity}</td>
                <td className="px-4 py-3">
                  {room.featured ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                      No
                    </span>
                  )}
                </td>
                <td className="flex gap-2 px-4 py-3">
                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className="rounded-lg border border-stone-300 px-3 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Edit
                  </Link>
                  <DeleteRoomButton id={room.id} />
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-stone-500"
                >
                  No rooms yet. Add your first room.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
