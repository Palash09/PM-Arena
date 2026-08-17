import { execFileSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const captureDir = path.join(root, "docs/distribution/video");
const workDir = path.join(root, ".tmp/launch-video");
const outputPath = path.join(
  captureDir,
  "product-decision-league-linkedin-vertical.mp4",
);

const width = 1080;
const height = 1920;
const fps = 30;
const phoneWidth = 720;
const phoneHeight = 1561;
const phoneLeft = 180;
const phoneTop = 210;

const scenes = [
  {
    name: "hook",
    image: "01-entry.jpg",
    duration: 3.2,
    treatment: "blurred",
    overlay: hookOverlay(),
  },
  {
    name: "leader",
    image: "02-leader.jpg",
    duration: 4.2,
    overlay: lowerThird(
      "A REAL DECISION FROM",
      "TOMER COHEN  /  LINKEDIN",
    ),
  },
  {
    name: "briefing",
    image: "03-briefing.jpg",
    duration: 4.2,
    overlay: topTag("HIGH STAKES", "ONE PRODUCT CALL"),
  },
  {
    name: "decision",
    image: "04-decision.jpg",
    duration: 4.8,
    overlay: lowerThird(
      "CHOOSE A PATH",
      "THEN DEFEND YOUR REASONING",
    ),
  },
  {
    name: "score",
    image: "05-score-top.jpg",
    duration: 5,
    overlay: topTag("DECISION BREAKDOWN", "REAL-WORLD REVEAL"),
  },
  {
    name: "reward",
    image: "07-leaders.jpg",
    duration: 4.5,
    overlay: lowerThird(
      "BUILD PRODUCT JUDGMENT",
      "UNLOCK LEADERS AS YOU PLAY",
    ),
  },
  {
    name: "cta",
    image: "01-entry.jpg",
    duration: 5,
    overlay: finalEntryOverlay(),
  },
];

await rm(workDir, { recursive: true, force: true });
await mkdir(workDir, { recursive: true });

for (const [index, scene] of scenes.entries()) {
  const stillPath = path.join(
    workDir,
    `${String(index).padStart(2, "0")}-${scene.name}.png`,
  );
  const videoPath = path.join(
    workDir,
    `${String(index).padStart(2, "0")}-${scene.name}.mp4`,
  );

  const capturePath = path.join(captureDir, scene.image);
  const background = sharp(capturePath)
    .resize(width, height, { fit: "cover" })
    .blur(scene.treatment === "blurred" ? 10 : 28)
    .modulate({
      brightness: scene.treatment === "blurred" ? 0.58 : 0.38,
      saturation: scene.treatment === "blurred" ? 0.9 : 0.72,
    });

  const composites = scene.treatment === "blurred"
    ? [{ input: Buffer.from(scene.overlay), top: 0, left: 0 }]
    : [
        { input: Buffer.from(safeFrameBackground()), top: 0, left: 0 },
        { input: Buffer.from(deviceShadow()), top: 0, left: 0 },
        {
          input: await roundedPhoneCapture(capturePath),
          top: phoneTop,
          left: phoneLeft,
        },
        { input: Buffer.from(deviceBorder()), top: 0, left: 0 },
        { input: Buffer.from(scene.overlay), top: 0, left: 0 },
      ];

  await background
    .composite(composites)
    .png()
    .toFile(stillPath);

  const frames = Math.round(scene.duration * fps);
  const fadeOutAt = Math.max(0, scene.duration - 0.3).toFixed(2);
  const filter = [
    `zoompan=z='min(zoom+0.00004,1.006)'`,
    `x='iw/2-(iw/zoom/2)'`,
    `y='ih/2-(ih/zoom/2)'`,
    `d=${frames}`,
    `s=${width}x${height}`,
    `fps=${fps}`,
  ].join(":");

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      stillPath,
      "-vf",
      `${filter},fade=t=in:st=0:d=0.3,fade=t=out:st=${fadeOutAt}:d=0.3,format=yuv420p`,
      "-frames:v",
      String(frames),
      "-r",
      String(fps),
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "18",
      "-an",
      "-movflags",
      "+faststart",
      videoPath,
    ],
    { stdio: "inherit" },
  );
}

const concatPath = path.join(workDir, "concat.txt");
await writeFile(
  concatPath,
  scenes
    .map(
      (scene, index) =>
        `file '${path.join(workDir, `${String(index).padStart(2, "0")}-${scene.name}.mp4`)}'`,
    )
    .join("\n"),
  "utf8",
);

execFileSync(
  "ffmpeg",
  [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    outputPath,
  ],
  { stdio: "inherit" },
);

console.log(`Launch video created at ${outputPath}`);

function svgShell(content) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#020713" stop-opacity="0.94"/>
          <stop offset="1" stop-color="#020713" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      ${content}
    </svg>
  `;
}

async function roundedPhoneCapture(capturePath) {
  const mask = Buffer.from(`
    <svg width="${phoneWidth}" height="${phoneHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${phoneWidth}" height="${phoneHeight}" rx="48" fill="#FFFFFF"/>
    </svg>
  `);

  return sharp(capturePath)
    .resize(phoneWidth, phoneHeight, { fit: "fill" })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function safeFrameBackground() {
  return svgShell(`
    <rect width="1080" height="1920" fill="#020713" fill-opacity="0.68"/>
    <circle cx="80" cy="420" r="330" fill="#72F1B8" fill-opacity="0.045"/>
    <circle cx="1020" cy="1450" r="420" fill="#FFD166" fill-opacity="0.035"/>
    <path d="M0 176 L1080 176" stroke="#72F1B8" stroke-opacity="0.12"/>
    <path d="M0 1798 L1080 1798" stroke="#FFD166" stroke-opacity="0.12"/>
  `);
}

function deviceShadow() {
  return svgShell(`
    <rect x="158" y="188" width="764" height="1605" rx="68" fill="#000000" fill-opacity="0.58"/>
    <rect x="170" y="200" width="740" height="1581" rx="58" fill="#08101D" stroke="#2B3C4F" stroke-width="4"/>
  `);
}

function deviceBorder() {
  return svgShell(`
    <rect x="176" y="206" width="728" height="1569" rx="54" fill="none" stroke="#72F1B8" stroke-opacity="0.32" stroke-width="3"/>
  `);
}

function hookOverlay() {
  return svgShell(`
    <rect width="1080" height="1920" fill="#020713" fill-opacity="0.62"/>
    <text x="540" y="210" text-anchor="middle" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="42" font-weight="700" letter-spacing="6">PRODUCT DECISION LEAGUE</text>
    <text x="540" y="635" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="78" font-weight="700" letter-spacing="2">YOU'VE LISTENED TO</text>
    <text x="540" y="760" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="112" font-weight="700">100 PM PODCASTS.</text>
    <rect x="410" y="850" width="260" height="8" rx="4" fill="#FFD166"/>
    <text x="540" y="1090" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="96" font-weight="700">CAN YOU MAKE</text>
    <text x="540" y="1240" text-anchor="middle" fill="#FFD166" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="138" font-weight="700">THE CALL?</text>
    <text x="540" y="1730" text-anchor="middle" fill="#C8D0DC" font-family="SF Pro Display, Arial, sans-serif" font-size="31" font-weight="600" letter-spacing="2">REAL SCENARIOS  /  EXPERT REVEALS  /  2 MINUTES</text>
  `);
}

function topTag(kicker, title) {
  return svgShell(`
    <rect x="180" y="54" width="720" height="120" rx="28" fill="url(#shade)" stroke="#FFD166" stroke-opacity="0.45" stroke-width="2"/>
    <text x="540" y="99" text-anchor="middle" fill="#E3E8EF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="27" font-weight="700" letter-spacing="5">${kicker}</text>
    <text x="540" y="151" text-anchor="middle" fill="#FFD166" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="48" font-weight="700" letter-spacing="1">${title}</text>
  `);
}

function lowerThird(kicker, title) {
  return svgShell(`
    <rect x="180" y="1798" width="720" height="104" rx="26" fill="url(#shade)" stroke="#FFD166" stroke-opacity="0.38" stroke-width="2"/>
    <text x="540" y="1838" text-anchor="middle" fill="#E3E8EF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="24" font-weight="700" letter-spacing="4">${kicker}</text>
    <text x="540" y="1880" text-anchor="middle" fill="#FFD166" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="39" font-weight="700" letter-spacing="1">${title}</text>
  `);
}

function finalEntryOverlay() {
  return svgShell(`
    <rect x="180" y="54" width="720" height="120" rx="28" fill="url(#shade)" stroke="#72F1B8" stroke-opacity="0.45" stroke-width="2"/>
    <text x="540" y="99" text-anchor="middle" fill="#E3E8EF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="27" font-weight="700" letter-spacing="5">THE LEAGUE IS OPEN</text>
    <text x="540" y="151" text-anchor="middle" fill="#FFD166" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="48" font-weight="700" letter-spacing="1">READY TO MAKE THE CALL?</text>
    <rect x="180" y="1798" width="720" height="104" rx="26" fill="url(#shade)" stroke="#72F1B8" stroke-opacity="0.42" stroke-width="2"/>
    <text x="540" y="1840" text-anchor="middle" fill="#E3E8EF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="24" font-weight="700" letter-spacing="4">PLAY THE 2-MINUTE CHALLENGE</text>
    <text x="540" y="1881" text-anchor="middle" fill="#FFD166" font-family="SF Pro Display, Arial, sans-serif" font-size="32" font-weight="700">productdecision.palasharma.com</text>
  `);
}
