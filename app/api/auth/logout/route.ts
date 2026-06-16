import { NextResponse } from "next/server";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { clearSession } from "@/lib/server-auth";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
