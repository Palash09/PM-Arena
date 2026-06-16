import { NextResponse } from "next/server";

import { getPlayers } from "@/lib/data/repository";

export async function GET() {
  return NextResponse.json(await getPlayers());
}
