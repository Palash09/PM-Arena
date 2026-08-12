import { NextResponse } from "next/server";

import { getProductionReadiness } from "@/lib/production-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = await getProductionReadiness();

  return NextResponse.json(
    {
      status: readiness.ready ? "ready" : "not_ready",
      checks: readiness.checks,
      missingConfigurationCount: readiness.missingVariables.length,
      timestamp: new Date().toISOString()
    },
    { status: readiness.ready ? 200 : 503 }
  );
}
