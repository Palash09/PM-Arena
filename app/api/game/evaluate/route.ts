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
  reasoning: z.string().max(400).optional().default("")
});

export async function POST(request: Request) {
  try {
    const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Choose an option before locking your decision." },
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

    let aiEvaluation = null;

    try {
      aiEvaluation = await maybeEvaluateWithAnthropic({
        scenario,
        selectedOption,
        reasoning: parsed.data.reasoning
      });
    } catch (error) {
      console.error("AI evaluation failed; using rules-based fallback.", error);
    }

    const evaluation =
      aiEvaluation ??
      getFallbackEvaluation(parsed.data.scenarioId, parsed.data.optionId, parsed.data.reasoning);

    await recordGameAttempt({
      scenarioId: parsed.data.scenarioId,
      optionId: parsed.data.optionId,
      reasoning: parsed.data.reasoning,
      evaluation
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Scenario evaluation failed.", error);

    return NextResponse.json(
      {
        error:
          "We could not score this decision. Refresh the scenario and try again."
      },
      { status: 500 }
    );
  }
}
