import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).max(100),
});

export const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1),
});

export const RoomSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().int().positive(),
  capacity: z.number().int().min(1).max(20).default(2),
  imageUrl: z.string().url().optional().nullable(),
  location: z.string().min(1),
  featured: z.boolean().default(false),
});

export const BookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1).max(20).default(2),
});

export const ReviewSchema = z.object({
  roomId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RoomInput = z.infer<typeof RoomSchema>;
export type BookingInput = z.infer<typeof BookingSchema>;
export type ReviewInput = z.infer<typeof ReviewSchema>;
