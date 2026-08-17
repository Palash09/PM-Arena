# LinkedIn launch video

The vertical launch master is built from current production captures at a mobile layout.

## Build

```bash
node scripts/build-launch-video.mjs
```

Requirements: Node.js, the repository dependencies, and `ffmpeg` with H.264 support.

## Output

```text
docs/distribution/video/product-decision-league-linkedin-vertical.mp4
```

The master is 1080x1920, approximately 29 seconds, caption-first, and intentionally silent. Add licensed music or a voiceover only in a derivative export so this reusable master remains clean.

LinkedIn cover:

```text
docs/distribution/video/product-decision-league-linkedin-cover.jpg
```

Use the `linkedin_launch_video` URL from `docs/distribution/alpha-links.csv` with the launch post so video-driven challenge traffic remains distinguishable from the Day 2 strategy post.
