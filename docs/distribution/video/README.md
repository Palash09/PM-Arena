# LinkedIn launch video

The vertical launch master is built from current production captures using an iPhone 14 Pro browser viewport (`393x852`). The mobile UI is rendered inside a padded device frame so LinkedIn interface overlays do not cover key product content or captions.

The exported phone frame is `720x1561` inside the `1080x1920` canvas. This leaves 180 pixels on both horizontal edges, 210 pixels above the device, and 149 pixels below it. LinkedIn's [video sharing guidance](https://www.linkedin.com/help/linkedin/answer/a7494039) explicitly recommends keeping every edge free of key elements, text, and logos because interface controls may overlap the video.

## Build

```bash
node scripts/build-launch-video.mjs
```

Requirements: Node.js, the repository dependencies, and `ffmpeg` with H.264 support.

## Output

```text
docs/distribution/video/product-decision-league-linkedin-vertical.mp4
```

The master is 1080x1920, 30 fps, approximately 29 seconds, caption-first, and intentionally silent. Add licensed music or a voiceover only in a derivative export so this reusable master remains clean.

LinkedIn cover:

```text
docs/distribution/video/product-decision-league-linkedin-cover.jpg
```

Use the `linkedin_launch_video` URL from `docs/distribution/alpha-links.csv` with the launch post so video-driven challenge traffic remains distinguishable from the Day 2 strategy post.
