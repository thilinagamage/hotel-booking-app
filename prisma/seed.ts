import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@serenestay.com" },
    update: {},
    create: {
      email: "admin@serenestay.com",
      name: "Admin",
      password,
      role: "ADMIN",
    },
  });

  const guest = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      email: "guest@example.com",
      name: "Alex Mercer",
      password,
      role: "GUEST",
    },
  });

  console.log("Users created:", admin.email, guest.email);

  const rooms = [
    {
      name: "Deluxe Suite",
      description:
        "A spacious suite with a king bed, city views, and a private balcony. Includes breakfast and evening turn-down service.",
      price: 48000,
      capacity: 2,
      location: "galle",
      featured: true,
    },
    {
      name: "Garden Room",
      description:
        "Quiet ground-floor room opening onto a private terrace with tropical garden views. Features a work desk and soft natural light.",
      price: 36000,
      capacity: 2,
      location: "galle",
      featured: true,
    },
    {
      name: "Executive Corner",
      description:
        "Corner suite with panoramic views, dedicated lounge access, and late checkout privileges. Ideal for business travelers.",
      price: 64000,
      capacity: 2,
      location: "colombo",
      featured: true,
    },
    {
      name: "Harbour View Room",
      description:
        "Modern room overlooking Colombo harbour. Features floor-to-ceiling windows, a rain shower, and smart room controls.",
      price: 42000,
      capacity: 2,
      location: "colombo",
      featured: false,
    },
    {
      name: "Beach Villa",
      description:
        "Standalone villa steps from the beach with a private plunge pool, outdoor shower, and butler service.",
      price: 85000,
      capacity: 4,
      location: "matara",
      featured: true,
    },
    {
      name: "Sunset Studio",
      description:
        "Compact studio with ocean views, a kitchenette, and direct beach access. Perfect for solo travelers or couples.",
      price: 28000,
      capacity: 2,
      location: "matara",
      featured: false,
    },
  ];

  const createdRooms = [];
  for (const room of rooms) {
    const created = await prisma.room.upsert({
      where: { id: room.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: room.name.toLowerCase().replace(/\s+/g, "-"),
        ...room,
      },
    });
    createdRooms.push(created);
  }

  console.log(`${createdRooms.length} rooms created`);

  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 14);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);

  await prisma.booking.upsert({
    where: { id: "sample-booking-1" },
    update: {},
    create: {
      id: "sample-booking-1",
      userId: guest.id,
      roomId: createdRooms[0].id,
      checkIn,
      checkOut,
      guests: 2,
      totalAmount: createdRooms[0].price * 3,
      status: "CONFIRMED",
    },
  });

  const pastCheckOut = new Date();
  pastCheckOut.setDate(pastCheckOut.getDate() - 5);
  const pastCheckIn = new Date(pastCheckOut);
  pastCheckIn.setDate(pastCheckIn.getDate() - 2);

  await prisma.booking.upsert({
    where: { id: "sample-booking-2" },
    update: {},
    create: {
      id: "sample-booking-2",
      userId: guest.id,
      roomId: createdRooms[2].id,
      checkIn: pastCheckIn,
      checkOut: pastCheckOut,
      guests: 1,
      totalAmount: createdRooms[2].price * 2,
      status: "COMPLETED",
    },
  });

  console.log("Sample bookings created");

  await prisma.review.upsert({
    where: { id: "sample-review-1" },
    update: {},
    create: {
      id: "sample-review-1",
      userId: guest.id,
      roomId: createdRooms[2].id,
      rating: 5,
      comment:
        "Amazing stay! The executive corner has breathtaking views and the lounge access made the trip extra special.",
    },
  });

  await prisma.review.upsert({
    where: { id: "sample-review-2" },
    update: {},
    create: {
      id: "sample-review-2",
      userId: guest.id,
      roomId: createdRooms[1].id,
      rating: 4,
      comment:
        "Loved the garden terrace. Very peaceful and the staff were incredibly attentive.",
    },
  });

  console.log("Sample reviews created");
  console.log("Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
