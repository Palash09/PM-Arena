import { NextResponse } from "next/server";

import { getUserProfile } from "@/lib/data/repository";

export async function GET() {
  return NextResponse.json(await getUserProfile());
}
