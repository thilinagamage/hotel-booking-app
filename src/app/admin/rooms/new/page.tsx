import RoomForm from "../RoomForm";

export default function NewRoom() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        Add room
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Create a new room for Serene Stay
      </p>
      <div className="mt-8 max-w-lg">
        <RoomForm />
      </div>
    </div>
  );
}
