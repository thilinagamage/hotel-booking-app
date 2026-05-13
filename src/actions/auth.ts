"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { SignupSchema, LoginSchema } from "@/lib/validations";

type AuthErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

type AuthResult = { errors: AuthErrors } | undefined;

export async function signup(
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const validated = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as AuthErrors };
  }

  const { name, email, password } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["Email already in use"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function login(
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as AuthErrors };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { errors: { email: ["Invalid credentials"] } };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { errors: { email: ["Invalid credentials"] } };
  }

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
