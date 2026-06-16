import { NextResponse } from "next/server";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { getCurrentAccount, publicAccount } from "@/lib/server-auth";

export async function GET() {
  try {
    const account = await getCurrentAccount();

    return NextResponse.json({ user: account ? publicAccount(account) : null });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
