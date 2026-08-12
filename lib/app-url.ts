const LOCAL_APP_URL = "http://localhost:3000";

function normalizeOrigin(value: string) {
  const url = new URL(value);
  return url.origin;
}

export function getAppOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) {
    return LOCAL_APP_URL;
  }

  try {
    return normalizeOrigin(configuredUrl);
  } catch {
    return LOCAL_APP_URL;
  }
}

export function getRequestOrigin(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    try {
      return normalizeOrigin(configuredUrl);
    } catch {
      // Local development can still use the incoming request if the env value is malformed.
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  return forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(request.url).origin;
}
