import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) {
    throw new AuthError("Unauthorized", 401);
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "ADMIN") {
    throw new AuthError("Forbidden", 403);
  }
  return session;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function handleApiError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("API error:", err);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
