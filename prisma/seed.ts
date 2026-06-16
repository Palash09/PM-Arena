import { prisma } from "@/lib/prisma";
import { playerCards, scenarios, skillOrder, userProfile } from "@/lib/data/seed-data";

async function main() {
  await prisma.gameAttempt.deleteMany();
  await prisma.skillStat.deleteMany();
  await prisma.playerCard.deleteMany();
  await prisma.scenarioOption.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.userProfile.deleteMany();

  const profile = await prisma.userProfile.create({
    data: {
      name: userProfile.name,
      title: userProfile.title,
      level: userProfile.level,
      rank: userProfile.rank,
      credibilityScore: userProfile.credibilityScore,
      streak: userProfile.streak,
      wins: userProfile.record.wins,
      retries: userProfile.record.retries,
      focusAreas: userProfile.focusAreas,
      stats: {
        create: skillOrder.map((key) => ({
          key,
          label: userProfile.stats[key].label,
          value: userProfile.stats[key].value
        }))
      }
    }
  });

  await prisma.playerCard.createMany({
    data: playerCards.map((player) => ({
      id: player.id,
      slug: player.slug,
      name: player.name,
      company: player.company,
      role: player.role,
      archetype: player.archetype,
      rating: player.rating,
      unlocked: player.unlocked,
      avatarHue: player.avatarHue,
      signatureMove: player.signatureMove,
      quote: player.quote,
      sourceFile: player.sourceFile,
      stats: player.stats
    }))
  });

  for (const scenario of scenarios) {
    await prisma.scenario.create({
      data: {
        id: scenario.id,
        slug: scenario.slug,
        title: scenario.title,
        company: scenario.company,
        guest: scenario.guest,
        difficulty: scenario.difficulty,
        stage: scenario.stage,
        decisionType: scenario.decisionType,
        recommendedSkill: scenario.recommendedSkill,
        shortPitch: scenario.shortPitch,
        context: scenario.context,
        stakes: scenario.stakes,
        actualOutcome: scenario.actualOutcome,
        expertReasoning: scenario.expertReasoning,
        sourceQuote: scenario.sourceQuote,
        sourceFile: scenario.sourceFile,
        frameworks: scenario.frameworks,
        options: {
          create: scenario.options.map((option) => ({
            id: option.id,
            label: option.label,
            title: option.title,
            summary: option.summary,
            pros: option.pros,
            tradeoffs: option.tradeoffs,
            frameworkSignals: option.frameworkSignals,
            isHistoricalChoice: option.isHistoricalChoice ?? false
          }))
        }
      }
    });
  }

  await prisma.gameAttempt.create({
    data: {
      profileId: profile.id,
      scenarioId: scenarios[0].id,
      optionId: scenarios[0].options[2].id,
      reasoning:
        "The current product has distribution but not differentiation. A map-first canvas changes the user experience and gives the product a more defensible wedge.",
      score: 88,
      choiceAlignment: 40,
      reasoningAlignment: 24,
      frameworkCoverage: 16,
      completeness: 8,
      verdict: "Strong call. The answer was aligned with the actual product move.",
      delta: [
        "You identified the core issue as lack of differentiation.",
        "The answer linked interface change to strategic advantage."
      ],
      coaching: [
        "Name the execution risk more explicitly.",
        "Tie the recommendation to the user habit shift."
      ]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
