"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RoomData = {
  name: string;
  description: string;
  price: number;
  capacity: number;
  location: string;
  featured: boolean;
  imageUrl?: string | null;
};

export default function RoomForm({ initialData, roomId }: { initialData?: RoomData; roomId?: string }) {
  const router = useRouter();
  const isEdit = !!roomId;

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [capacity, setCapacity] = useState(initialData?.capacity ?? 2);
  const [location, setLocation] = useState(initialData?.location ?? "galle");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setImageUrl(data.url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body: RoomData = {
      name,
      description,
      price,
      capacity,
      location,
      featured,
      imageUrl: imageUrl || null,
    };

    const url = isEdit ? `/api/rooms/${roomId}` : "/api/rooms";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    if (res.ok) {
      router.push("/admin/rooms");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to save room");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-stone-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Price (LKR/night)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={1}
            className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Capacity
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
            min={1}
            max={20}
            className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Location
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
        >
          <option value="galle">Galle</option>
          <option value="colombo">Colombo</option>
          <option value="matara">Matara</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        <label htmlFor="featured" className="text-sm font-medium text-stone-700">
          Featured room
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-700"
        />
        {uploading && (
          <p className="mt-1 text-sm text-stone-500">Uploading...</p>
        )}
        {imageUrl && (
          <p className="mt-1 break-all text-sm text-stone-500">{imageUrl}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Update room" : "Create room"}
      </button>
    </form>
  );
}
