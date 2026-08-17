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
    overlay: topTag("AI COACHING", "REAL-WORLD REVEAL"),
  },
  {
    name: "reward",
    image: "06-coaching.jpg",
    duration: 4,
    overlay: lowerThird(
      "BUILD PRODUCT JUDGMENT",
      "UNLOCK LEADERS AS YOU PLAY",
    ),
  },
  {
    name: "cta",
    image: "01-entry.jpg",
    duration: 4,
    treatment: "blurred",
    overlay: ctaOverlay(),
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

  let background = sharp(path.join(captureDir, scene.image))
    .extract({ left: 437, top: 0, width: 405, height: 720 })
    .resize(width, height, { fit: "fill" });

  if (scene.treatment === "blurred") {
    background = background.blur(10).modulate({ brightness: 0.58 });
  }

  await background
    .composite([{ input: Buffer.from(scene.overlay), top: 0, left: 0 }])
    .png()
    .toFile(stillPath);

  const frames = Math.round(scene.duration * fps);
  const fadeOutAt = Math.max(0, scene.duration - 0.3).toFixed(2);
  const filter = [
    `zoompan=z='min(zoom+0.00022,1.025)'`,
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

function hookOverlay() {
  return svgShell(`
    <rect width="1080" height="1920" fill="#020713" fill-opacity="0.62"/>
    <text x="540" y="210" text-anchor="middle" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="42" font-weight="700" letter-spacing="6">PRODUCT DECISION LEAGUE</text>
    <text x="540" y="635" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="88" font-weight="700" letter-spacing="2">YOU'VE LISTENED TO</text>
    <text x="540" y="770" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="132" font-weight="700">100 PM PODCASTS.</text>
    <rect x="390" y="860" width="300" height="8" rx="4" fill="#72F1B8"/>
    <text x="540" y="1100" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="108" font-weight="700">CAN YOU MAKE</text>
    <text x="540" y="1260" text-anchor="middle" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="154" font-weight="700">THE CALL?</text>
    <text x="540" y="1730" text-anchor="middle" fill="#C8D0DC" font-family="SF Pro Display, Arial, sans-serif" font-size="31" font-weight="600" letter-spacing="2">REAL SCENARIOS  /  AI COACHING  /  2 MINUTES</text>
  `);
}

function topTag(kicker, title) {
  return svgShell(`
    <rect x="52" y="54" width="976" height="196" rx="30" fill="url(#shade)" stroke="#72F1B8" stroke-opacity="0.46" stroke-width="2"/>
    <text x="98" y="128" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="34" font-weight="700" letter-spacing="5">${kicker}</text>
    <text x="98" y="205" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="68" font-weight="700" letter-spacing="1">${title}</text>
  `);
}

function lowerThird(kicker, title) {
  return svgShell(`
    <rect x="52" y="1644" width="976" height="220" rx="34" fill="url(#shade)" stroke="#72F1B8" stroke-opacity="0.4" stroke-width="2"/>
    <text x="98" y="1726" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="34" font-weight="700" letter-spacing="5">${kicker}</text>
    <text x="98" y="1815" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="62" font-weight="700" letter-spacing="1">${title}</text>
  `);
}

function ctaOverlay() {
  return svgShell(`
    <rect width="1080" height="1920" fill="#020713" fill-opacity="0.7"/>
    <text x="540" y="250" text-anchor="middle" fill="#72F1B8" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="42" font-weight="700" letter-spacing="6">PRODUCT DECISION LEAGUE</text>
    <text x="540" y="710" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="116" font-weight="700">READY TO MAKE</text>
    <text x="540" y="855" text-anchor="middle" fill="#FFFFFF" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="116" font-weight="700">THE CALL?</text>
    <rect x="92" y="1050" width="896" height="174" rx="36" fill="#72F1B8"/>
    <text x="540" y="1158" text-anchor="middle" fill="#03100C" font-family="DIN Condensed, Arial Narrow, sans-serif" font-size="58" font-weight="700" letter-spacing="1">PLAY THE 2-MINUTE CHALLENGE</text>
    <text x="540" y="1372" text-anchor="middle" fill="#FFFFFF" font-family="SF Pro Display, Arial, sans-serif" font-size="42" font-weight="700">productdecision.palasharma.com</text>
    <text x="540" y="1730" text-anchor="middle" fill="#C8D0DC" font-family="SF Pro Display, Arial, sans-serif" font-size="30" font-weight="600">What felt least credible or most confusing?</text>
  `);
}
