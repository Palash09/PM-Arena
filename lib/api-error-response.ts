import { NextResponse } from "next/server";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? "");
}

export function authDatabaseErrorResponse(error: unknown) {
  const message = errorMessage(error);

  if (
    message.includes("Can't reach database server") ||
    message.includes("ECONNREFUSED") ||
    message.includes("P1001")
  ) {
    return NextResponse.json(
      {
        error:
          "Authentication database is unavailable. Start Postgres locally, or set DATABASE_URL to your hosted database before signing in."
      },
      { status: 503 }
    );
  }

  if (
    message.includes("does not exist") ||
    message.includes("P2021") ||
    message.includes("P2022")
  ) {
    return NextResponse.json(
      {
        error:
          "Authentication tables are missing. Run `npm run db:push` against your DATABASE_URL, then try again."
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error:
        "Authentication service failed unexpectedly. Check the server logs and database connection."
    },
    { status: 500 }
  );
}
