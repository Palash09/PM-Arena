import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

interface TranscriptPayload {
  slug: string;
  title: string;
  guest: string;
  description: string;
  excerpt: string;
  sourceFile: string;
}

async function loadTranscripts(): Promise<TranscriptPayload[]> {
  const podcastsDir = path.join(process.cwd(), "podcasts");
  const files = (await fs.readdir(podcastsDir)).filter((file) => file.endsWith(".md"));

  return Promise.all(
    files.map(async (file) => {
      const sourceFile = path.join(podcastsDir, file);
      const raw = await fs.readFile(sourceFile, "utf8");
      const parsed = matter(raw);
      const body = parsed.content.replace(/\s+/g, " ").trim();

      return {
        slug: file.replace(/\.md$/, ""),
        title: String(parsed.data.title ?? file),
        guest: String(parsed.data.guest ?? "Unknown guest"),
        description: String(parsed.data.description ?? ""),
        excerpt: body.slice(0, 4500),
        sourceFile: `podcasts/${file}`
      };
    })
  );
}

function extractionPrompt(transcript: TranscriptPayload) {
  return [
    "Given this podcast transcript segment, extract:",
    "1. DECISION_CONTEXT: What situation was the person facing?",
    "2. OPTIONS: What choices were available (real or implied)?",
    "3. ACTUAL_CHOICE: What did they decide?",
    "4. REASONING: Why did they make this choice?",
    "5. OUTCOME: What happened as a result?",
    "6. FRAMEWORKS: What mental models did they apply?",
    "7. COMPANY_STAGE: Early/Growth/Scale/Turnaround",
    "8. DECISION_TYPE: Strategy/Prioritization/Team/Launch/Pricing/Growth",
    "Format as structured JSON.",
    "",
    `TITLE: ${transcript.title}`,
    `GUEST: ${transcript.guest}`,
    `DESCRIPTION: ${transcript.description}`,
    `SOURCE_FILE: ${transcript.sourceFile}`,
    `TRANSCRIPT_SEGMENT: ${transcript.excerpt}`
  ].join("\n");
}

async function extractWithAnthropic(transcript: TranscriptPayload) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      slug: transcript.slug,
      sourceFile: transcript.sourceFile,
      preview: extractionPrompt(transcript)
    };
  }

  const AnthropicModule = await import("@anthropic-ai/sdk");
  const anthropic = new AnthropicModule.default({ apiKey });
  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-latest",
    max_tokens: 1400,
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: extractionPrompt(transcript)
      }
    ]
  });

  const content = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  return {
    slug: transcript.slug,
    sourceFile: transcript.sourceFile,
    content
  };
}

async function main() {
  const limit = Number(process.env.PODCAST_LIMIT || 10);
  const transcripts = (await loadTranscripts()).slice(0, limit);
  const results = [];

  for (const transcript of transcripts) {
    console.log(`Extracting scenario candidates from ${transcript.sourceFile}`);
    results.push(await extractWithAnthropic(transcript));
  }

  const outputDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "scenario-extractions.json");
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  console.log(`Wrote ${results.length} extraction results to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
