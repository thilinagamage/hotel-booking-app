import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Users API - add database connection to enable" },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Database not connected yet" },
    { status: 503 }
  );
}
