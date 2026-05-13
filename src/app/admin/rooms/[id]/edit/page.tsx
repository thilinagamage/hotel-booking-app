import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { notFound, redirect } from "next/navigation";
import RoomForm from "../../RoomForm";

export default async function EditRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        Edit room
      </h1>
      <p className="mt-1 text-sm text-stone-600">{room.name}</p>
      <div className="mt-8 max-w-lg">
        <RoomForm
          roomId={room.id}
          initialData={{
            name: room.name,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            location: room.location,
            featured: room.featured,
            imageUrl: room.imageUrl,
          }}
        />
      </div>
    </div>
  );
}
