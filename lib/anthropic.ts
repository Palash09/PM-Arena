import { z } from "zod";

import { EvaluationResult, Scenario, ScenarioOption } from "@/lib/types";

const evaluationSchema = z.object({
  score: z.number().min(0).max(100),
  choiceAlignment: z.number().min(0).max(40),
  reasoningAlignment: z.number().min(0).max(30),
  frameworkCoverage: z.number().min(0).max(20),
  completeness: z.number().min(0).max(10),
  verdict: z.string(),
  delta: z.array(z.string()).min(2).max(4),
  coaching: z.array(z.string()).min(2).max(4),
  expertChoice: z.string(),
  expertQuote: z.string()
});

const jsonShapeDescription = {
  score: "number 0-100",
  choiceAlignment: "number 0-40",
  reasoningAlignment: "number 0-30",
  frameworkCoverage: "number 0-20",
  completeness: "number 0-10",
  verdict: "string",
  delta: ["string", "string"],
  coaching: ["string", "string"],
  expertChoice: "string",
  expertQuote: "string"
};

interface EvaluationRequest {
  scenario: Scenario;
  selectedOption: ScenarioOption;
  reasoning: string;
}

export async function maybeEvaluateWithAnthropic({
  scenario,
  selectedOption,
  reasoning
}: EvaluationRequest): Promise<EvaluationResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  const AnthropicModule = await import("@anthropic-ai/sdk");
  const anthropic = new AnthropicModule.default({ apiKey });
  const historicalOption = scenario.options.find((option) => option.isHistoricalChoice);

  if (!historicalOption) {
    return null;
  }

  const prompt = [
    "You are scoring a PM simulation answer.",
    "The historical path should be preferred, but strong alternate reasoning should still score relatively well if it is coherent and acknowledges the tradeoffs.",
    "Return strict JSON only.",
    "",
    `Scenario: ${scenario.title}`,
    `Company: ${scenario.company}`,
    `Guest: ${scenario.guest}`,
    `Decision type: ${scenario.decisionType}`,
    `Stage: ${scenario.stage}`,
    `Scenario context: ${scenario.context}`,
    `Stakes: ${scenario.stakes}`,
    `Historical choice: ${historicalOption.label} - ${historicalOption.title}`,
    `Expert reasoning: ${scenario.expertReasoning}`,
    `Frameworks: ${scenario.frameworks.join(", ")}`,
    "",
    `User choice: ${selectedOption.label} - ${selectedOption.title}`,
    `User reasoning: ${reasoning}`,
    "",
    "Score with the following weights:",
    "choiceAlignment out of 40",
    "reasoningAlignment out of 30",
    "frameworkCoverage out of 20",
    "completeness out of 10",
    "",
    "Also return:",
    "score",
    "verdict",
    "delta as 2-4 crisp bullets",
    "coaching as 2-4 crisp bullets",
    "expertChoice",
    "expertQuote",
    "",
    "The result must match this JSON shape exactly:",
    JSON.stringify(jsonShapeDescription, null, 2)
  ].join("\n");

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-latest",
    max_tokens: 900,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  const normalized = text.replace(/^```json\s*|\s*```$/g, "").trim();

  try {
    return evaluationSchema.parse(JSON.parse(normalized));
  } catch {
    return null;
  }
}
