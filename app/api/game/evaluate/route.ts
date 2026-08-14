import { NextResponse } from "next/server";
import { z } from "zod";

import { reserveAnthropicEvaluation } from "@/lib/ai-usage-limit";
import { maybeEvaluateWithAnthropic } from "@/lib/anthropic";
import { recordOperationalEvent } from "@/lib/operational-analytics";
import {
  getFallbackEvaluation,
  getScenarioById,
  recordGameAttempt
} from "@/lib/data/repository";

const payloadSchema = z.object({
  scenarioId: z.string(),
  optionId: z.string(),
  reasoning: z.string().trim().min(1).max(400),
  anonymousId: z.string().trim().max(120).optional()
});

export async function POST(request: Request) {
  try {
    const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Choose an option and add your reasoning before locking your decision." },
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
    const canUseAnthropic = await reserveAnthropicEvaluation(
      request,
      parsed.data.anonymousId
    );

    try {
      if (!canUseAnthropic) {
        throw new Error("Anthropic allowance unavailable");
      }

      const attempt = await maybeEvaluateWithAnthropic({
        scenario,
        selectedOption,
        reasoning: parsed.data.reasoning
      });

      if (attempt) {
        aiEvaluation = attempt.evaluation;
        await recordOperationalEvent({
          eventType: "anthropic_evaluation_completed",
          path: "/api/game/evaluate",
          anonymousId: parsed.data.anonymousId,
          metadata: {
            model: attempt.model,
            scenarioId: scenario.id,
            inputTokens: attempt.inputTokens,
            outputTokens: attempt.outputTokens,
            estimatedCostUsd: attempt.estimatedCostUsd,
            validEvaluation: Boolean(attempt.evaluation)
          }
        });
      }
    } catch (error) {
      if (canUseAnthropic) {
        console.error("AI evaluation failed; using rules-based fallback.", error);
        await recordOperationalEvent({
          eventType: "anthropic_evaluation_failed",
          path: "/api/game/evaluate",
          anonymousId: parsed.data.anonymousId,
          metadata: {
            scenarioId: parsed.data.scenarioId,
            errorName: error instanceof Error ? error.name : "UnknownError"
          }
        });
      }
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
    await recordOperationalEvent({
      eventType: "server_error",
      path: "/api/game/evaluate",
      metadata: {
        operation: "scenario_evaluation",
        errorName: error instanceof Error ? error.name : "UnknownError"
      }
    });

    return NextResponse.json(
      {
        error:
          "We could not score this decision. Refresh the scenario and try again."
      },
      { status: 500 }
    );
  }
}
