import { NextResponse } from "next/server";
import { z } from "zod";

import { maybeEvaluateWithAnthropic } from "@/lib/anthropic";
import {
  getFallbackEvaluation,
  getScenarioById,
  recordGameAttempt
} from "@/lib/data/repository";

const payloadSchema = z.object({
  scenarioId: z.string(),
  optionId: z.string(),
  reasoning: z.string().min(20)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid evaluation payload." },
      { status: 400 }
    );
  }

  const scenario = await getScenarioById(parsed.data.scenarioId);

  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }

  const selectedOption = scenario.options.find((entry) => entry.id === parsed.data.optionId);

  if (!selectedOption) {
    return NextResponse.json({ error: "Option not found." }, { status: 404 });
  }

  const evaluation =
    (await maybeEvaluateWithAnthropic({
      scenario,
      selectedOption,
      reasoning: parsed.data.reasoning
    })) ??
    getFallbackEvaluation(parsed.data.scenarioId, parsed.data.optionId, parsed.data.reasoning);

  await recordGameAttempt({
    scenarioId: parsed.data.scenarioId,
    optionId: parsed.data.optionId,
    reasoning: parsed.data.reasoning,
    evaluation
  });

  return NextResponse.json(evaluation);
}
