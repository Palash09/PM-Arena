import { ImageResponse } from "next/og";
import { headers } from "next/headers";

import { getPlayers, getScenarioBySlug } from "@/lib/data/repository";

export const alt = "Product Decision League playable PM challenge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const scenario = await getScenarioBySlug(slug);
  const players = await getPlayers();
  const player = players.find((candidate) => candidate.name === scenario?.guest);
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `${protocol}://${host}`;
  const backgroundUrl = new URL("/product-decision-league-background.png", origin).toString();
  const leaderUrl = player
    ? new URL(`/leaders/${player.slug}.png`, origin).toString()
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 64px",
          color: "white",
          background:
            "radial-gradient(circle at 15% 0%, rgba(109,211,255,0.34), transparent 38%), radial-gradient(circle at 95% 80%, rgba(214,255,86,0.2), transparent 32%), linear-gradient(145deg, #0b1832 0%, #050b18 58%, #020713 100%)",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <img
          src={backgroundUrl}
          alt=""
          width="1200"
          height="630"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 58%",
            opacity: 0.72
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(2,7,19,0.96) 0%, rgba(2,7,19,0.76) 58%, rgba(2,7,19,0.35) 100%), linear-gradient(180deg, rgba(2,7,19,0.2), rgba(2,7,19,0.88))"
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(214,255,86,0.65)",
                background: "rgba(214,255,86,0.12)",
                color: "#d6ff56",
                fontSize: 28,
                fontWeight: 900
              }}
            >
              PDL
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1.1 }}>PRODUCT DECISION LEAGUE</span>
              <span style={{ marginTop: 4, color: "#90a4c7", fontSize: 14, letterSpacing: 4 }}>
                PLAYABLE PM CHALLENGE
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              padding: "10px 16px",
              color: "#d6ff56",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 2
            }}
          >
            YOU MAKE THE CALL
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <span style={{ color: "#fcd34d", fontSize: 17, fontWeight: 900, letterSpacing: 3 }}>
              FEATURED LEADER / {(scenario?.guest ?? "PRODUCT LEADER").toUpperCase()}
            </span>
            <span
              style={{
                marginTop: 16,
                fontSize: 53,
                lineHeight: 1.02,
                letterSpacing: -2.5,
                fontWeight: 900
              }}
            >
              {scenario?.title ?? "Can you make the product call?"}
            </span>
            <span style={{ marginTop: 22, color: "#cbd5e1", fontSize: 22, lineHeight: 1.35 }}>
              A real {scenario?.company ?? "company"} decision. Make the call, then compare your reasoning with the leader who lived it.
            </span>
          </div>

          {leaderUrl ? (
            <div
              style={{
                display: "flex",
                position: "relative",
                width: 205,
                height: 342,
                flexShrink: 0,
                filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.7))"
              }}
            >
              <img
                src={leaderUrl}
                alt=""
                width="205"
                height="342"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {["A", "B", "C"].map((label) => (
              <div
                key={label}
                style={{
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.07)",
                  fontWeight: 900
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <span style={{ color: "#90a4c7", fontSize: 17, fontWeight: 700 }}>2 MINUTES · NO LOGIN · REAL OUTCOME</span>
        </div>
      </div>
    ),
    size
  );
}
