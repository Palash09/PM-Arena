import { NextResponse } from "next/server";

import { getScenarios } from "@/lib/data/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const difficulty = searchParams.get("difficulty");
  const decisionType = searchParams.get("decisionType");

  const filtered = await getScenarios({
    stage,
    difficulty,
    decisionType
  });

  return NextResponse.json(filtered);
}
