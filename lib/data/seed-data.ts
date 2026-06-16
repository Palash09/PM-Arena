import {
  EvaluationResult,
  PlayerCard,
  Scenario,
  SkillKey,
  UserProfile
} from "@/lib/types";

export const skillOrder: SkillKey[] = [
  "strategy",
  "execution",
  "leadership",
  "growth",
  "analytics",
  "communication"
];

export const userProfile: UserProfile = {
  name: "Palash",
  title: "Associate PM Manager",
  level: 12,
  rank: "Challenger Division",
  credibilityScore: 782,
  streak: 5,
  record: {
    wins: 18,
    retries: 6
  },
  focusAreas: ["Pricing under pressure", "Team leadership", "Growth diagnosis"],
  stats: {
    strategy: { label: "Strategy", value: 78 },
    execution: { label: "Execution", value: 65 },
    leadership: { label: "Leadership", value: 71 },
    growth: { label: "Growth", value: 82 },
    analytics: { label: "Analytics", value: 59 },
    communication: { label: "Communication", value: 88 }
  },
  recentActivity: [
    {
      id: "recent-1",
      title: "Airbnb: Snow White Launch",
      score: 87,
      outcome: "win"
    },
    {
      id: "recent-2",
      title: "Stripe: API Pricing Decision",
      score: 44,
      outcome: "retry"
    },
    {
      id: "recent-3",
      title: "LinkedIn: Full-Stack Builder Shift",
      score: 74,
      outcome: "win"
    }
  ]
};

export const playerCards: PlayerCard[] = [
  {
    id: "player-bret-taylor",
    slug: "bret-taylor",
    name: "Bret Taylor",
    company: "Google / Sierra",
    role: "Builder-Generalist",
    archetype: "Systems Playmaker",
    rating: 94,
    unlocked: true,
    avatarHue: "from-cyan-400/40 via-sky-500/20 to-indigo-500/30",
    signatureMove: "Impact-first reframing",
    quote: "What is the most impactful thing I can do today?",
    sourceFile: "podcasts/bret-taylor.md",
    stats: {
      strategy: 95,
      execution: 90,
      leadership: 92,
      growth: 84,
      analytics: 81,
      communication: 88
    }
  },
  {
    id: "player-ravi-mehta",
    slug: "ravi-mehta",
    name: "Ravi Mehta",
    company: "Tinder / Reforge",
    role: "Product Coach",
    archetype: "Tempo Controller",
    rating: 92,
    unlocked: true,
    avatarHue: "from-lime-400/40 via-emerald-500/20 to-cyan-500/30",
    signatureMove: "Selective micromanagement",
    quote: "Lead in a scalable way, or micromanage selectively and temporarily.",
    sourceFile: "podcasts/ravi-mehta.md",
    stats: {
      strategy: 93,
      execution: 85,
      leadership: 94,
      growth: 82,
      analytics: 79,
      communication: 91
    }
  },
  {
    id: "player-madhavan-ramanujam",
    slug: "madhavan-ramanujam",
    name: "Madhavan Ramanujam",
    company: "Simon-Kucher",
    role: "Pricing Architect",
    archetype: "Value Sniper",
    rating: 90,
    unlocked: false,
    avatarHue: "from-orange-400/40 via-red-500/20 to-pink-500/30",
    signatureMove: "Outcome-based pricing",
    quote: "Price the value created, not the cost incurred.",
    sourceFile: "podcasts/madhavan-ramanujam.md",
    stats: {
      strategy: 89,
      execution: 78,
      leadership: 75,
      growth: 88,
      analytics: 92,
      communication: 84
    }
  },
  {
    id: "player-eoghan-mccabe",
    slug: "eoghan-mccabe",
    name: "Eoghan McCabe",
    company: "Intercom",
    role: "Founder-Operator",
    archetype: "Turnaround Captain",
    rating: 91,
    unlocked: false,
    avatarHue: "from-fuchsia-400/35 via-cyan-500/15 to-teal-500/30",
    signatureMove: "All-in strategic reset",
    quote: "Intercom rose from the ashes by betting everything on AI.",
    sourceFile: "podcasts/eoghan-mccabe.md",
    stats: {
      strategy: 92,
      execution: 87,
      leadership: 89,
      growth: 83,
      analytics: 76,
      communication: 85
    }
  },
  {
    id: "player-melanie-perkins",
    slug: "melanie-perkins",
    name: "Melanie Perkins",
    company: "Canva",
    role: "Founder-Designer",
    archetype: "Accessibility Maestro",
    rating: 93,
    unlocked: false,
    avatarHue: "from-teal-300/40 via-emerald-500/15 to-lime-400/35",
    signatureMove: "Radical simplicity",
    quote: "Build powerful tools that still feel easy on day one.",
    sourceFile: "podcasts/melanie-perkins.md",
    stats: {
      strategy: 90,
      execution: 91,
      leadership: 88,
      growth: 90,
      analytics: 72,
      communication: 87
    }
  },
  {
    id: "player-robby-stein",
    slug: "robby-stein",
    name: "Robby Stein",
    company: "Google Search",
    role: "AI Product Lead",
    archetype: "Platform Quarterback",
    rating: 89,
    unlocked: false,
    avatarHue: "from-sky-300/35 via-blue-500/20 to-violet-500/25",
    signatureMove: "Search surface reinvention",
    quote: "Google's AI turnaround was about changing the search experience itself.",
    sourceFile: "podcasts/robby-stein.md",
    stats: {
      strategy: 90,
      execution: 86,
      leadership: 80,
      growth: 81,
      analytics: 84,
      communication: 83
    }
  },
  {
    id: "player-albert-cheng",
    slug: "albert-cheng",
    name: "Albert Cheng",
    company: "Duolingo / Grammarly / Chess.com",
    role: "Growth Executive",
    archetype: "Loop Hunter",
    rating: 88,
    unlocked: false,
    avatarHue: "from-lime-300/40 via-yellow-400/15 to-orange-500/25",
    signatureMove: "Hidden-growth diagnosis",
    quote: "The next growth lever is usually hiding behind user behavior.",
    sourceFile: "podcasts/albert-cheng.md",
    stats: {
      strategy: 82,
      execution: 83,
      leadership: 77,
      growth: 94,
      analytics: 91,
      communication: 79
    }
  },
  {
    id: "player-jason-cohen",
    slug: "jason-cohen",
    name: "Jason Cohen",
    company: "WP Engine / Smart Bear",
    role: "Founder",
    archetype: "Diagnosis Specialist",
    rating: 87,
    unlocked: false,
    avatarHue: "from-slate-300/35 via-cyan-500/15 to-lime-500/25",
    signatureMove: "Five-question teardown",
    quote: "Ask sharper questions before you build more things.",
    sourceFile: "podcasts/jason-cohen.md",
    stats: {
      strategy: 86,
      execution: 81,
      leadership: 79,
      growth: 88,
      analytics: 87,
      communication: 90
    }
  },
  {
    id: "player-grant-lee",
    slug: "grant-lee",
    name: "Grant Lee",
    company: "Gamma",
    role: "Founder",
    archetype: "Narrative Striker",
    rating: 86,
    unlocked: false,
    avatarHue: "from-coral-400/35 via-pink-500/20 to-fuchsia-500/25",
    signatureMove: "Opinionated launch story",
    quote: "A weird idea scales faster when the product demo explains it instantly.",
    sourceFile: "podcasts/grant-lee.md",
    stats: {
      strategy: 83,
      execution: 84,
      leadership: 76,
      growth: 86,
      analytics: 74,
      communication: 92
    }
  },
  {
    id: "player-nick-turley",
    slug: "nick-turley",
    name: "Nick Turley",
    company: "OpenAI",
    role: "Head of Product",
    archetype: "Adoption Finisher",
    rating: 91,
    unlocked: false,
    avatarHue: "from-emerald-300/35 via-cyan-500/15 to-blue-500/30",
    signatureMove: "General utility expansion",
    quote: "The fastest-growing products get useful before they get polished.",
    sourceFile: "podcasts/nick-turley.md",
    stats: {
      strategy: 89,
      execution: 88,
      leadership: 84,
      growth: 93,
      analytics: 82,
      communication: 81
    }
  },
  {
    id: "player-howie-liu",
    slug: "howie-liu",
    name: "Howie Liu",
    company: "Airtable",
    role: "Founder-CEO",
    archetype: "AI Org Rebuilder",
    rating: 92,
    unlocked: false,
    avatarHue: "from-emerald-300/35 via-cyan-500/20 to-blue-500/30",
    signatureMove: "AI-native first principles",
    quote: "If you were founding the company today, how would AI change the execution model?",
    sourceFile: "podcasts/howie-liu.md",
    stats: { strategy: 94, execution: 86, leadership: 90, growth: 82, analytics: 84, communication: 83 }
  },
  {
    id: "player-tomer-cohen",
    slug: "tomer-cohen",
    name: "Tomer Cohen",
    company: "LinkedIn",
    role: "Chief Product Officer",
    archetype: "Clarity Captain",
    rating: 91,
    unlocked: false,
    avatarHue: "from-sky-300/35 via-blue-500/20 to-violet-500/30",
    signatureMove: "Purpose-led product strategy",
    quote: "We might be wrong, but we're not confused.",
    sourceFile: "podcasts/tomer-cohen.md",
    stats: { strategy: 91, execution: 84, leadership: 88, growth: 86, analytics: 82, communication: 94 }
  },
  {
    id: "player-stewart-butterfield",
    slug: "stewart-butterfield",
    name: "Stewart Butterfield",
    company: "Slack / Flickr",
    role: "Founder",
    archetype: "Product Taste Architect",
    rating: 94,
    unlocked: false,
    avatarHue: "from-amber-300/35 via-orange-500/20 to-coral-500/30",
    signatureMove: "Comprehension over click count",
    quote: "The challenge is really comprehension.",
    sourceFile: "podcasts/stewart-butterfield.md",
    stats: { strategy: 92, execution: 90, leadership: 88, growth: 83, analytics: 80, communication: 91 }
  },
  {
    id: "player-asha-sharma",
    slug: "asha-sharma",
    name: "Asha Sharma",
    company: "Microsoft AI Platform",
    role: "CVP of AI Platform",
    archetype: "AI Systems Strategist",
    rating: 93,
    unlocked: false,
    avatarHue: "from-violet-300/35 via-fuchsia-500/20 to-cyan-500/25",
    signatureMove: "Product-as-organism loops",
    quote: "Products are becoming systems that think, live, and learn.",
    sourceFile: "podcasts/asha-sharma.md",
    stats: { strategy: 91, execution: 86, leadership: 87, growth: 85, analytics: 94, communication: 84 }
  },
  {
    id: "player-jeetu-patel",
    slug: "jeetu-patel",
    name: "Jeetu Patel",
    company: "Cisco",
    role: "President and CPO",
    archetype: "Enterprise Transformer",
    rating: 92,
    unlocked: false,
    avatarHue: "from-lime-300/35 via-emerald-500/20 to-sky-500/25",
    signatureMove: "Megatrend mobilization",
    quote: "When there's a megatrend, don't fight it.",
    sourceFile: "podcasts/jeetu-patel.md",
    stats: { strategy: 89, execution: 86, leadership: 94, growth: 82, analytics: 83, communication: 88 }
  },
  {
    id: "player-matt-macinnis",
    slug: "matt-macinnis",
    name: "Matt MacInnis",
    company: "Rippling",
    role: "Chief Product Officer",
    archetype: "Intensity Preserver",
    rating: 90,
    unlocked: false,
    avatarHue: "from-red-300/35 via-coral-500/20 to-amber-500/25",
    signatureMove: "Deliberate understaffing",
    quote: "Extraordinary outcomes demand extraordinary effort.",
    sourceFile: "podcasts/matt-macinnis.md",
    stats: { strategy: 88, execution: 94, leadership: 90, growth: 84, analytics: 78, communication: 83 }
  },
  {
    id: "player-molly-graham",
    slug: "molly-graham",
    name: "Molly Graham",
    company: "Glue Club / Facebook",
    role: "Scale Coach",
    archetype: "Scale Mentor",
    rating: 89,
    unlocked: false,
    avatarHue: "from-mint/35 via-teal-500/20 to-lime-500/25",
    signatureMove: "Give away your Legos",
    quote: "You have to grow as fast as your company is growing.",
    sourceFile: "podcasts/molly-graham.md",
    stats: { strategy: 84, execution: 82, leadership: 94, growth: 88, analytics: 76, communication: 90 }
  },
  {
    id: "player-jeanne-grosser",
    slug: "jeanne-grosser",
    name: "Jeanne Grosser",
    company: "Vercel / Stripe",
    role: "COO",
    archetype: "GTM Productizer",
    rating: 88,
    unlocked: false,
    avatarHue: "from-cyan-300/35 via-blue-500/20 to-emerald-500/25",
    signatureMove: "GTM as product",
    quote: "The buying journey can become a product experience.",
    sourceFile: "podcasts/jeanne-grosser.md",
    stats: { strategy: 90, execution: 84, leadership: 86, growth: 88, analytics: 80, communication: 93 }
  },
  {
    id: "player-elena-verna",
    slug: "elena-verna",
    name: "Elena Verna",
    company: "Lovable",
    role: "Head of Growth",
    archetype: "Growth Reinventor",
    rating: 90,
    unlocked: false,
    avatarHue: "from-pink-300/35 via-fuchsia-500/20 to-violet-500/25",
    signatureMove: "Reinvent growth loops",
    quote: "The AI growth playbook is more reinvention than optimization.",
    sourceFile: "podcasts/elena-verna-40.md",
    stats: { strategy: 88, execution: 84, leadership: 82, growth: 95, analytics: 89, communication: 86 }
  },
  {
    id: "player-chip-huyen",
    slug: "chip-huyen",
    name: "Chip Huyen",
    company: "Nvidia / Stanford / Netflix",
    role: "AI Engineer",
    archetype: "Practical AI Builder",
    rating: 91,
    unlocked: false,
    avatarHue: "from-lime-300/35 via-cyan-500/20 to-blue-500/25",
    signatureMove: "User feedback over hype",
    quote: "Talk to users, prepare better data, and optimize the workflow.",
    sourceFile: "podcasts/chip-huyen.md",
    stats: { strategy: 86, execution: 88, leadership: 80, growth: 82, analytics: 95, communication: 84 }
  },
  {
    id: "player-nicole-forsgren",
    slug: "nicole-forsgren",
    name: "Nicole Forsgren",
    company: "Microsoft Research / DORA",
    role: "Research Partner",
    archetype: "Measurement Strategist",
    rating: 89,
    unlocked: false,
    avatarHue: "from-sky-300/35 via-cyan-500/20 to-slate-500/25",
    signatureMove: "Goal-first measurement",
    quote: "Start with the problem or goal before choosing metrics.",
    sourceFile: "podcasts/nicole-forsgren.md",
    stats: { strategy: 86, execution: 84, leadership: 86, growth: 78, analytics: 95, communication: 88 }
  },
  {
    id: "player-dhanji-prasanna",
    slug: "dhanji-prasanna",
    name: "Dhanji R. Prasanna",
    company: "Block",
    role: "CTO",
    archetype: "AI Operating Leader",
    rating: 90,
    unlocked: false,
    avatarHue: "from-emerald-300/35 via-lime-500/20 to-cyan-500/25",
    signatureMove: "Distributed AI leverage",
    quote: "Non-technical people can use agents to redesign their own work.",
    sourceFile: "podcasts/dhanji-r-prasanna.md",
    stats: { strategy: 85, execution: 94, leadership: 89, growth: 82, analytics: 88, communication: 80 }
  },
  {
    id: "player-edwin-chen",
    slug: "edwin-chen",
    name: "Edwin Chen",
    company: "Surge AI",
    role: "Founder-CEO",
    archetype: "Quality Maximalist",
    rating: 90,
    unlocked: false,
    avatarHue: "from-violet-300/35 via-indigo-500/20 to-cyan-500/25",
    signatureMove: "Expert-quality data moat",
    quote: "Quality is the scarce resource in AI data.",
    sourceFile: "podcasts/edwin-chen.md",
    stats: { strategy: 89, execution: 86, leadership: 84, growth: 88, analytics: 94, communication: 80 }
  },
  {
    id: "player-jason-droege",
    slug: "jason-droege",
    name: "Jason Droege",
    company: "Scale AI / Uber Eats",
    role: "CEO",
    archetype: "Insight Hunter",
    rating: 89,
    unlocked: false,
    avatarHue: "from-orange-300/35 via-amber-500/20 to-lime-500/25",
    signatureMove: "Unique insight test",
    quote: "What insight do I have, and why am I lucky enough to have it?",
    sourceFile: "podcasts/jason-droege.md",
    stats: { strategy: 93, execution: 86, leadership: 87, growth: 85, analytics: 82, communication: 84 }
  },
  {
    id: "player-jenny-wen",
    slug: "jenny-wen",
    name: "Jenny Wen",
    company: "Claude / Figma",
    role: "Design Leader",
    archetype: "Design Judgment Lead",
    rating: 88,
    unlocked: false,
    avatarHue: "from-fuchsia-300/35 via-violet-500/20 to-cyan-500/25",
    signatureMove: "Prototype-led direction",
    quote: "Someone still needs to decide what matters.",
    sourceFile: "podcasts/jenny-wen.md",
    stats: { strategy: 86, execution: 84, leadership: 89, growth: 78, analytics: 80, communication: 94 }
  },
  {
    id: "player-boris-cherny",
    slug: "boris-cherny",
    name: "Boris Cherny",
    company: "Anthropic",
    role: "Claude Code Lead",
    archetype: "Builder-Mode Lead",
    rating: 91,
    unlocked: false,
    avatarHue: "from-blue-300/35 via-indigo-500/20 to-mint/25",
    signatureMove: "Everyone becomes a builder",
    quote: "Everyone codes, and everyone needs product judgment.",
    sourceFile: "podcasts/boris-cherny.md",
    stats: { strategy: 86, execution: 95, leadership: 84, growth: 86, analytics: 82, communication: 81 }
  },
  {
    id: "player-sherwin-wu",
    slug: "sherwin-wu",
    name: "Sherwin Wu",
    company: "OpenAI",
    role: "API Engineering Lead",
    archetype: "Platform Futurist",
    rating: 90,
    unlocked: false,
    avatarHue: "from-cyan-300/35 via-sky-500/20 to-violet-500/25",
    signatureMove: "Build for future models",
    quote: "Build for where models are going, not where they are today.",
    sourceFile: "podcasts/sherwin-wu-v2.md",
    stats: { strategy: 92, execution: 88, leadership: 83, growth: 84, analytics: 87, communication: 80 }
  },
  {
    id: "player-scott-wu",
    slug: "scott-wu",
    name: "Scott Wu",
    company: "Cognition",
    role: "Founder-CEO",
    archetype: "Agentic Product Lead",
    rating: 90,
    unlocked: false,
    avatarHue: "from-emerald-300/35 via-cyan-500/20 to-blue-500/25",
    signatureMove: "Production trust for agents",
    quote: "Agents need a legible operating model before teams trust them.",
    sourceFile: "podcasts/scott-wu.md",
    stats: { strategy: 86, execution: 93, leadership: 84, growth: 86, analytics: 82, communication: 83 }
  },
  {
    id: "player-dan-shipper",
    slug: "dan-shipper",
    name: "Dan Shipper",
    company: "Every",
    role: "Co-founder-CEO",
    archetype: "AI-Native Operator",
    rating: 88,
    unlocked: false,
    avatarHue: "from-slate-300/35 via-violet-500/20 to-mint/25",
    signatureMove: "Workflow codification",
    quote: "The company operating system changes when AI becomes core to work.",
    sourceFile: "podcasts/dan-shipper.md",
    stats: { strategy: 84, execution: 92, leadership: 86, growth: 85, analytics: 80, communication: 84 }
  },
  {
    id: "player-jen-abel",
    slug: "jen-abel",
    name: "Jen Abel",
    company: "Jellyfish / State Affairs",
    role: "Enterprise GTM Leader",
    archetype: "Founder Sales Coach",
    rating: 86,
    unlocked: false,
    avatarHue: "from-amber-300/35 via-coral-500/20 to-pink-500/25",
    signatureMove: "Founder-led learning",
    quote: "Founder-led sales starts with learning, not forcing the close.",
    sourceFile: "podcasts/jen-abel.md",
    stats: { strategy: 84, execution: 82, leadership: 84, growth: 88, analytics: 76, communication: 94 }
  }
];

export const scenarios: Scenario[] = [
  {
    id: "scenario-google-local-v2",
    slug: "google-local-v2",
    title: "Google Local Needs a Real Wedge",
    company: "Google",
    guest: "Bret Taylor",
    difficulty: "WORLD_CLASS",
    stage: "GROWTH",
    decisionType: "STRATEGY",
    recommendedSkill: "strategy",
    shortPitch:
      "Traffic is guaranteed from the homepage, but the first release still feels like a digital Yellow Pages clone.",
    context:
      "You own Google Local after a weak first launch. Leadership gave you one more shot, and the current product works but has no compelling reason to win.",
    stakes:
      "If the team ships another me-too version, the initiative loses momentum and your credibility as a PM takes a hit.",
    actualOutcome:
      "Taylor pushed the team toward a map-first experience, which became the basis for Google Maps and unlocked a dramatically more differentiated product.",
    expertReasoning:
      "He reframed the problem from 'how do we improve local listings?' to 'what would make local search fundamentally better than the incumbent behavior?'",
    sourceQuote:
      "What if we inverted the hierarchy here and made the map the canvas?",
    sourceFile: "podcasts/bret-taylor.md",
    frameworks: ["Differentiation over parity", "Reframe the product canvas", "Impact-first prioritization"],
    options: [
      {
        id: "google-local-a",
        label: "A",
        title: "Tune the existing directory experience",
        summary: "Improve listings quality and wait for search traffic to compound.",
        pros: ["Low risk", "Fastest to ship"],
        tradeoffs: ["Still undifferentiated", "Relies on distribution instead of product strength"],
        frameworkSignals: ["Execution"]
      },
      {
        id: "google-local-b",
        label: "B",
        title: "Add richer reviews and merchant data",
        summary: "Double down on content depth so the directory feels more useful.",
        pros: ["Adds value to the current stack", "Improves decision confidence"],
        tradeoffs: ["Still follows category conventions", "Does not change the core interaction"],
        frameworkSignals: ["Prioritization", "Research"]
      },
      {
        id: "google-local-c",
        label: "C",
        title: "Rebuild around a map-first interface",
        summary: "Make the map the product canvas and let spatial interaction drive discovery.",
        pros: ["Clear differentiation", "Creates a new habit loop"],
        tradeoffs: ["Harder technical path", "Requires bolder conviction"],
        frameworkSignals: ["Differentiation", "Product strategy"],
        isHistoricalChoice: true
      }
    ]
  },
  {
    id: "scenario-selective-micromanagement",
    slug: "selective-micromanagement",
    title: "Your PM Team Is Drifting Off-Strategy",
    company: "Tinder",
    guest: "Ravi Mehta",
    difficulty: "PRO",
    stage: "SCALE",
    decisionType: "TEAM",
    recommendedSkill: "leadership",
    shortPitch:
      "A team has autonomy, but the direction is wrong and speed is making the mistake larger.",
    context:
      "As product leader, you value empowerment. But one team is now executing cleanly against the wrong interpretation of strategy, and the blast radius is growing.",
    stakes:
      "If you stay hands-off, the team burns months. If you overcorrect permanently, you damage trust and create dependency.",
    actualOutcome:
      "Mehta advocates temporary, tactical micromanagement to reset direction, then pulling back once the team understands the path.",
    expertReasoning:
      "The point is not control for its own sake. It is short-term intervention to restore strategic clarity so autonomy becomes safe again.",
    sourceQuote:
      "The right answer is to micromanage, but do it in a very tactical and temporary way.",
    sourceFile: "podcasts/ravi-mehta.md",
    frameworks: ["Situational leadership", "Temporary intervention", "Autonomy after alignment"],
    options: [
      {
        id: "micromanagement-a",
        label: "A",
        title: "Stay hands-off and coach in the next review",
        summary: "Preserve autonomy and let the team self-correct over time.",
        pros: ["Protects trust", "Avoids overreach"],
        tradeoffs: ["Slow correction", "Wrong direction keeps compounding"],
        frameworkSignals: ["Empowerment"]
      },
      {
        id: "micromanagement-b",
        label: "B",
        title: "Step in tightly for two sprints, then pull back",
        summary: "Reset the operating direction through sharper review, examples, and decision checkpoints.",
        pros: ["Corrects strategy quickly", "Keeps intervention time-bounded"],
        tradeoffs: ["Requires careful communication", "Can feel uncomfortable in the short run"],
        frameworkSignals: ["Leadership", "Coaching"],
        isHistoricalChoice: true
      },
      {
        id: "micromanagement-c",
        label: "C",
        title: "Replace the team lead immediately",
        summary: "Signal that strategic misses are unacceptable.",
        pros: ["Fast accountability signal"],
        tradeoffs: ["Overcorrects too early", "Does not build capability"],
        frameworkSignals: ["Accountability"]
      }
    ]
  },
  {
    id: "scenario-ai-pricing",
    slug: "ai-pricing",
    title: "Your AI Product Is Expensive to Run",
    company: "Enterprise AI Portfolio",
    guest: "Madhavan Ramanujam",
    difficulty: "LEGENDARY",
    stage: "GROWTH",
    decisionType: "PRICING",
    recommendedSkill: "analytics",
    shortPitch:
      "Usage-based pricing mirrors your cost base, but customers only care about the business outcome.",
    context:
      "Your AI workflow product has rising inference costs. The finance team wants a pricing model that protects margin, but enterprise buyers struggle to map tokens to value.",
    stakes:
      "A weak pricing model can either cap revenue or scare away buyers who do not understand what they are paying for.",
    actualOutcome:
      "Ramanujam argues that the best AI pricing models anchor on measurable value or outcomes rather than raw technical consumption.",
    expertReasoning:
      "Customers rarely want to buy compute. They want reduced manual work, faster decisions, or better win rates. Price around that value exchange.",
    sourceQuote:
      "Lessons from 400-plus companies point back to value, not just cost.",
    sourceFile: "podcasts/madhavan-ramanujam.md",
    frameworks: ["Value-based pricing", "Monetize outcomes", "Avoid cost-plus thinking"],
    options: [
      {
        id: "ai-pricing-a",
        label: "A",
        title: "Price directly on tokens consumed",
        summary: "Map revenue tightly to your underlying AI costs.",
        pros: ["Easy internal margin logic", "Transparent operational model"],
        tradeoffs: ["Hard for buyers to reason about", "Weak link to delivered business value"],
        frameworkSignals: ["Cost discipline"]
      },
      {
        id: "ai-pricing-b",
        label: "B",
        title: "Blend platform fee with value-based success metric",
        summary: "Create a stable base fee and tie upside to outcomes like time saved or tasks completed.",
        pros: ["Aligns to customer value", "Protects margin with a floor"],
        tradeoffs: ["Needs better instrumentation", "Requires stronger sales narrative"],
        frameworkSignals: ["Value pricing", "Instrumentation"],
        isHistoricalChoice: true
      },
      {
        id: "ai-pricing-c",
        label: "C",
        title: "Delay pricing innovation until model costs fall",
        summary: "Keep a simple subscription for now and revisit later.",
        pros: ["Low friction launch"],
        tradeoffs: ["Leaves value uncaptured", "Builds the wrong expectation early"],
        frameworkSignals: ["Simplicity"]
      }
    ]
  },
  {
    id: "scenario-intercom-ai-reset",
    slug: "intercom-ai-reset",
    title: "Intercom Needs a Turnaround Narrative",
    company: "Intercom",
    guest: "Eoghan McCabe",
    difficulty: "WORLD_CLASS",
    stage: "TURNAROUND",
    decisionType: "STRATEGY",
    recommendedSkill: "execution",
    shortPitch:
      "Growth has stalled and the market is shifting. Incremental product updates will not reset the company story.",
    context:
      "You are returning to a company that needs sharper focus and renewed energy. AI is emerging quickly, but a full pivot carries major operational risk.",
    stakes:
      "A timid response keeps the company stuck in drift. A bold response may break the old roadmap and force painful tradeoffs.",
    actualOutcome:
      "McCabe drove an all-in AI strategy that repositioned Intercom around the next platform shift instead of maintaining the status quo.",
    expertReasoning:
      "In a turnaround, partial commitment often burns time without changing perception. The company needed a forcing function and a new story customers could feel.",
    sourceQuote:
      "Intercom rose from the ashes by betting everything on AI.",
    sourceFile: "podcasts/eoghan-mccabe.md",
    frameworks: ["Turnaround via decisive focus", "Narrative reset", "Platform shift timing"],
    options: [
      {
        id: "intercom-a",
        label: "A",
        title: "Layer AI features onto the existing roadmap",
        summary: "Preserve the current business while exploring the new wave safely.",
        pros: ["Lower disruption", "Protects near-term commitments"],
        tradeoffs: ["May feel timid", "Does not reset the market narrative"],
        frameworkSignals: ["Risk management"]
      },
      {
        id: "intercom-b",
        label: "B",
        title: "Make AI the core company bet",
        summary: "Reorganize the roadmap, story, and team priorities around the new wedge.",
        pros: ["Signals conviction", "Can redefine category perception"],
        tradeoffs: ["High execution pressure", "Requires painful focus"],
        frameworkSignals: ["Strategic focus", "Narrative"],
        isHistoricalChoice: true
      },
      {
        id: "intercom-c",
        label: "C",
        title: "Wait for the market to mature before committing",
        summary: "Protect the installed base until customer demand is fully obvious.",
        pros: ["Conservative and measurable"],
        tradeoffs: ["Loses timing advantage", "Lets others define the category"],
        frameworkSignals: ["Caution"]
      }
    ]
  },
  {
    id: "scenario-canva-accessibility",
    slug: "canva-accessibility",
    title: "Canva Must Feel Powerful Without Feeling Hard",
    company: "Canva",
    guest: "Melanie Perkins",
    difficulty: "PRO",
    stage: "GROWTH",
    decisionType: "LAUNCH",
    recommendedSkill: "communication",
    shortPitch:
      "Professional design tools are powerful but intimidating. Mass-market adoption requires a different first-run experience.",
    context:
      "Your team can ship advanced tooling for professionals, or design the whole experience around making non-designers successful immediately.",
    stakes:
      "If onboarding feels expert-only, you cap the addressable market. If the product is too simple, power users dismiss it.",
    actualOutcome:
      "Canva’s wedge was accessibility: templates, clarity, and a friction-light workflow that made design feel possible for everyone.",
    expertReasoning:
      "The team optimized for user confidence and speed to first success, not just feature parity with expert tools.",
    sourceQuote:
      "She built a $42B company by making design far more approachable.",
    sourceFile: "podcasts/melanie-perkins.md",
    frameworks: ["Time to first win", "Accessibility as strategy", "Expand the category"],
    options: [
      {
        id: "canva-a",
        label: "A",
        title: "Match pro design tools feature-for-feature",
        summary: "Win credibility by proving the product can do everything experts expect.",
        pros: ["Strong depth story", "Protects against dismissal"],
        tradeoffs: ["Steep learning curve", "Slower adoption for broader audiences"],
        frameworkSignals: ["Parity"]
      },
      {
        id: "canva-b",
        label: "B",
        title: "Center the experience on guided simplicity",
        summary: "Use templates, guardrails, and approachable flows to maximize day-one success.",
        pros: ["Expands the market", "Creates fast activation"],
        tradeoffs: ["Requires disciplined scope choices", "Can seem less impressive on paper"],
        frameworkSignals: ["Accessibility", "Activation"],
        isHistoricalChoice: true
      },
      {
        id: "canva-c",
        label: "C",
        title: "Ship expert and beginner modes at the same time",
        summary: "Attempt to serve both ends of the market from launch.",
        pros: ["Broad appeal story"],
        tradeoffs: ["Split focus", "Higher complexity in product and message"],
        frameworkSignals: ["Segmentation"]
      }
    ]
  },
  {
    id: "scenario-google-ai-search",
    slug: "google-ai-search",
    title: "AI Should Change Search, Not Sit Beside It",
    company: "Google Search",
    guest: "Robby Stein",
    difficulty: "LEGENDARY",
    stage: "SCALE",
    decisionType: "LAUNCH",
    recommendedSkill: "strategy",
    shortPitch:
      "The company can either ship an isolated AI assistant or integrate AI deeply into the search journey itself.",
    context:
      "Search is already massive, and any change risks user trust. But the market expects a response to conversational AI.",
    stakes:
      "A side product may feel safer, but it leaves the core experience stale. A core integration is riskier but more defensible if it works.",
    actualOutcome:
      "Stein’s framing points toward reinventing search surfaces with AI Overviews and AI Mode instead of treating AI as a detached experiment.",
    expertReasoning:
      "Users do not care about org charts. They care whether search itself becomes more useful. The winning move is to evolve the core job-to-be-done.",
    sourceQuote:
      "The strategy behind AI Overviews starts with the search experience itself.",
    sourceFile: "podcasts/robby-stein.md",
    frameworks: ["Core-surface reinvention", "User job over org boundaries", "Platform defense"],
    options: [
      {
        id: "search-ai-a",
        label: "A",
        title: "Launch a separate AI product first",
        summary: "Protect the main search experience while experimenting elsewhere.",
        pros: ["Lower trust risk", "Cleaner experimentation"],
        tradeoffs: ["Weakens the core moat", "Can feel disconnected from user intent"],
        frameworkSignals: ["Incubation"]
      },
      {
        id: "search-ai-b",
        label: "B",
        title: "Embed AI directly into search moments",
        summary: "Use AI summaries and new search modes to improve the main experience where intent already exists.",
        pros: ["Strengthens the core product", "Improves discovery in place"],
        tradeoffs: ["Higher quality bar", "Requires careful rollout"],
        frameworkSignals: ["Surface integration", "User intent"],
        isHistoricalChoice: true
      },
      {
        id: "search-ai-c",
        label: "C",
        title: "Focus only on infra and wait for product clarity",
        summary: "Improve models behind the scenes without changing the visible product.",
        pros: ["Safer operationally"],
        tradeoffs: ["Invisible progress", "Cedes product narrative to competitors"],
        frameworkSignals: ["Infrastructure"]
      }
    ]
  },
  {
    id: "scenario-hidden-growth",
    slug: "hidden-growth",
    title: "There Is Growth Hiding in Existing Behavior",
    company: "Duolingo / Grammarly / Chess.com",
    guest: "Albert Cheng",
    difficulty: "PRO",
    stage: "SCALE",
    decisionType: "GROWTH",
    recommendedSkill: "growth",
    shortPitch:
      "Leadership wants more acquisition spend, but retention signals suggest your next unlock may already exist inside the product.",
    context:
      "User growth has flattened. The obvious response is bigger top-of-funnel spend, yet your cohort data hints that a product habit loop is under-optimized.",
    stakes:
      "If you buy growth before fixing the product loop, you raise acquisition costs without improving the engine underneath.",
    actualOutcome:
      "Cheng’s approach focuses on finding hidden growth opportunities in user behavior and tightening the product loop before defaulting to channel expansion.",
    expertReasoning:
      "Sustainable growth comes from understanding which in-product moments create recurring value and then amplifying them.",
    sourceQuote:
      "Hidden growth opportunities are often already inside your product.",
    sourceFile: "podcasts/albert-cheng.md",
    frameworks: ["Growth loop diagnosis", "Retention before spend", "Behavioral instrumentation"],
    options: [
      {
        id: "growth-a",
        label: "A",
        title: "Double paid acquisition spend",
        summary: "Use budget to reopen the top of the funnel immediately.",
        pros: ["Fastest traffic lift", "Easy to measure"],
        tradeoffs: ["Expensive without stronger retention", "Can mask the real issue"],
        frameworkSignals: ["Acquisition"]
      },
      {
        id: "growth-b",
        label: "B",
        title: "Instrument and improve the habit-forming loop",
        summary: "Identify the recurring value moment and redesign around it before scaling spend.",
        pros: ["Improves the engine", "Raises return on future acquisition"],
        tradeoffs: ["Takes deeper product work", "Less instant-looking"],
        frameworkSignals: ["Growth loops", "Retention"],
        isHistoricalChoice: true
      },
      {
        id: "growth-c",
        label: "C",
        title: "Ship a referral program and hope virality carries",
        summary: "Attempt to unlock user-driven acquisition without reworking the core product.",
        pros: ["Potentially efficient channel"],
        tradeoffs: ["Weak if core value is not sticky enough", "Can add surface area before diagnosis"],
        frameworkSignals: ["Virality"]
      }
    ]
  },
  {
    id: "scenario-product-growth-stall",
    slug: "product-growth-stall",
    title: "The Product Stopped Growing",
    company: "Smart Bear / WP Engine",
    guest: "Jason Cohen",
    difficulty: "WORLD_CLASS",
    stage: "GROWTH",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "analytics",
    shortPitch:
      "The team is eager to ship more features, but growth is down and nobody agrees on the real reason.",
    context:
      "You are under pressure to restart growth. There are many ideas on the table, yet the root cause is still fuzzy across product, sales, and marketing.",
    stakes:
      "If you prioritize without diagnosis, you burn roadmap capacity and learn slowly. If you overanalyze, momentum stalls.",
    actualOutcome:
      "Cohen’s framing is to ask sharper diagnostic questions first, separating acquisition, activation, retention, positioning, and market pull before prescribing features.",
    expertReasoning:
      "Good prioritization starts by correctly naming the failure mode. Otherwise the roadmap becomes expensive guessing.",
    sourceQuote:
      "Ask five questions when your product stops growing.",
    sourceFile: "podcasts/jason-cohen.md",
    frameworks: ["Root-cause diagnosis", "Separate failure modes", "Questions before roadmap"],
    options: [
      {
        id: "stall-a",
        label: "A",
        title: "Launch the most requested feature immediately",
        summary: "Show decisiveness and hope customer demand rebounds.",
        pros: ["Visible progress", "Easy stakeholder story"],
        tradeoffs: ["May solve the wrong problem", "Turns roadmap into guesswork"],
        frameworkSignals: ["Shipping speed"]
      },
      {
        id: "stall-b",
        label: "B",
        title: "Run a structured growth diagnosis first",
        summary: "Force the team to isolate where the breakdown is before picking a solution path.",
        pros: ["Improves solution quality", "Creates cross-functional alignment"],
        tradeoffs: ["Requires discipline", "Feels slower upfront"],
        frameworkSignals: ["Diagnosis", "Prioritization"],
        isHistoricalChoice: true
      },
      {
        id: "stall-c",
        label: "C",
        title: "Increase discounts to stimulate demand",
        summary: "Pull the easiest commercial lever before changing product strategy.",
        pros: ["Can move near-term revenue"],
        tradeoffs: ["Masks product issues", "Risks value perception"],
        frameworkSignals: ["Sales pressure"]
      }
    ]
  },
  {
    id: "scenario-gamma-positioning",
    slug: "gamma-positioning",
    title: "The Product Sounds Dumb Until You See It",
    company: "Gamma",
    guest: "Grant Lee",
    difficulty: "PRO",
    stage: "EARLY",
    decisionType: "LAUNCH",
    recommendedSkill: "communication",
    shortPitch:
      "People dismiss the concept in text, but their reaction changes after a live demo.",
    context:
      "The team has built something unconventional. Prospects misunderstand it when you describe it abstractly, even though hands-on usage triggers a much stronger response.",
    stakes:
      "If positioning stays vague, word of mouth dies early. If you oversimplify, the product feels like a toy.",
    actualOutcome:
      "Gamma’s rise suggests the team leaned into product-led storytelling where the demo did the convincing faster than abstract category language.",
    expertReasoning:
      "Some products need a clearer reveal moment, not a denser explanation. Show the transformed output and let that create belief.",
    sourceQuote:
      "\"Dumbest idea I've heard\" flipped once people saw the product.",
    sourceFile: "podcasts/grant-lee.md",
    frameworks: ["Demo-led positioning", "Narrative clarity", "Show, don't explain"],
    options: [
      {
        id: "gamma-a",
        label: "A",
        title: "Keep refining the category description",
        summary: "Search for the perfect abstract language before scaling the launch.",
        pros: ["Can improve messaging discipline"],
        tradeoffs: ["May never land cleanly", "Delays learning from the product itself"],
        frameworkSignals: ["Messaging"]
      },
      {
        id: "gamma-b",
        label: "B",
        title: "Lead with an opinionated product demo",
        summary: "Make the launch show the magic instantly instead of over-describing the category.",
        pros: ["Accelerates understanding", "Builds conviction through product experience"],
        tradeoffs: ["Needs a crisp reveal moment", "Can hide deeper nuance"],
        frameworkSignals: ["Storytelling", "Activation"],
        isHistoricalChoice: true
      },
      {
        id: "gamma-c",
        label: "C",
        title: "Pivot to a more familiar market category",
        summary: "Choose a safer wedge that stakeholders already understand.",
        pros: ["Reduces explanation cost"],
        tradeoffs: ["May erase the differentiated insight", "Can flatten ambition"],
        frameworkSignals: ["Positioning"]
      }
    ]
  },
  {
    id: "scenario-chatgpt-utility",
    slug: "chatgpt-utility",
    title: "Usage Is Exploding Faster Than Any Playbook",
    company: "OpenAI",
    guest: "Nick Turley",
    difficulty: "LEGENDARY",
    stage: "SCALE",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "execution",
    shortPitch:
      "The product is growing explosively, but there are endless possible directions for what to polish next.",
    context:
      "You are operating the fastest-growing product in history. Demand is not the constraint; deciding where to sharpen utility across many use cases is.",
    stakes:
      "Choosing the wrong focus wastes momentum. Choosing the right one compounds habit formation across a massive user base.",
    actualOutcome:
      "Turley’s framing centers on expanding real utility and use-case breadth rather than treating the product as a narrow single-purpose tool.",
    expertReasoning:
      "General-purpose products win when they consistently become more useful in the moments users already care about, not just more technically impressive.",
    sourceQuote:
      "Inside ChatGPT is a story of usefulness compounding at extraordinary speed.",
    sourceFile: "podcasts/nick-turley.md",
    frameworks: ["Utility compounding", "Prioritize user jobs", "Scale through breadth of value"],
    options: [
      {
        id: "chatgpt-a",
        label: "A",
        title: "Narrow to one flagship vertical",
        summary: "Concentrate resources so the team can dominate a single use case.",
        pros: ["Sharper roadmap", "Clearer marketing"],
        tradeoffs: ["Underserves broader demand", "Fights the product's natural strength"],
        frameworkSignals: ["Focus"]
      },
      {
        id: "chatgpt-b",
        label: "B",
        title: "Keep broadening high-frequency utility",
        summary: "Invest in the recurring tasks that make the assistant useful across more contexts.",
        pros: ["Matches broad user pull", "Strengthens daily habit formation"],
        tradeoffs: ["Harder prioritization", "Requires strong product judgment"],
        frameworkSignals: ["Utility", "Habit"],
        isHistoricalChoice: true
      },
      {
        id: "chatgpt-c",
        label: "C",
        title: "Pause major changes and stabilize",
        summary: "Treat reliability as the only priority until growth cools down.",
        pros: ["Reduces operational surprise"],
        tradeoffs: ["May miss the adoption window", "Over-rotates on maintenance"],
        frameworkSignals: ["Stability"]
      }
    ]
  },
  {
    id: "scenario-airtable-ai-reorg",
    slug: "airtable-ai-reorg",
    title: "Airtable Must Rebuild for AI",
    company: "Airtable",
    guest: "Howie Liu",
    difficulty: "LEGENDARY",
    stage: "SCALE",
    decisionType: "STRATEGY",
    recommendedSkill: "strategy",
    shortPitch:
      "A mature product has a strong mission, but AI changes how that mission should be executed.",
    context:
      "You lead a decade-plus product with existing customers, workflows, and org structures. AI is moving fast enough that incremental features may not be enough to keep the company strategically relevant.",
    stakes:
      "If you preserve the old operating model, the product may become AI-decorated rather than AI-native. If you reorganize too aggressively, you disrupt teams and customers before the new path is proven.",
    actualOutcome:
      "Liu pushed Airtable to rethink the company as if it were being founded from scratch in an AI-native world, including changes to how the organization pursued fast and slow bets.",
    expertReasoning:
      "The strategic question was not which AI feature to add. It was how the company would pursue the same mission if it could redesign execution around AI from first principles.",
    sourceQuote:
      "If you were founding the same company from scratch, how would you execute using a fully AI-native approach?",
    sourceFile: "podcasts/howie-liu.md",
    frameworks: ["AI-native first principles", "Org design follows strategy", "Fast and slow thinking"],
    options: [
      {
        id: "airtable-ai-a",
        label: "A",
        title: "Add AI helpers to the current roadmap",
        summary: "Protect the existing product strategy and add AI features where customers request them.",
        pros: ["Lower disruption", "Easier customer communication"],
        tradeoffs: ["May preserve obsolete assumptions", "Risks AI becoming surface-level"],
        frameworkSignals: ["Iteration"]
      },
      {
        id: "airtable-ai-b",
        label: "B",
        title: "Rebuild strategy around an AI-native version of the mission",
        summary: "Ask what the company would build if it started today, then reorganize teams around that answer.",
        pros: ["Forces strategic clarity", "Creates a stronger response to platform shift"],
        tradeoffs: ["Operationally disruptive", "Requires leadership conviction"],
        frameworkSignals: ["First principles", "Strategy"],
        isHistoricalChoice: true
      },
      {
        id: "airtable-ai-c",
        label: "C",
        title: "Create a separate AI lab outside the core org",
        summary: "Let a small team experiment without changing the main product organization.",
        pros: ["Fast exploration", "Less disruption to core revenue"],
        tradeoffs: ["Can disconnect from the real product", "May not change company execution"],
        frameworkSignals: ["Incubation"]
      }
    ]
  },
  {
    id: "scenario-linkedin-feed-purpose",
    slug: "linkedin-feed-purpose",
    title: "LinkedIn Feed Needs a Clear Purpose",
    company: "LinkedIn",
    guest: "Tomer Cohen",
    difficulty: "WORLD_CLASS",
    stage: "SCALE",
    decisionType: "STRATEGY",
    recommendedSkill: "communication",
    shortPitch:
      "A professional feed has distribution, but users do not yet see it as a place for high-signal work conversations.",
    context:
      "You own a scaled feed product. It can drive traffic to other products, promote upsells, or become a destination where people who matter discuss work topics users care about.",
    stakes:
      "If the feed remains a utility surface, engagement stays shallow. If the purpose is too broad, quality and trust suffer.",
    actualOutcome:
      "Cohen reframed the feed around people that matter talking about professionally relevant topics, then used that clarity to guide product and AI decisions.",
    expertReasoning:
      "The team needed a clear product promise before optimizing tactics. Being wrong with clarity is better than hedging across conflicting goals.",
    sourceQuote:
      "We might be wrong, but we're not confused.",
    sourceFile: "podcasts/tomer-cohen.md",
    frameworks: ["Purpose-led product strategy", "Clarity before optimization", "Professional relevance"],
    options: [
      {
        id: "linkedin-feed-a",
        label: "A",
        title: "Optimize the feed as a traffic engine",
        summary: "Use feed inventory to route users into jobs, ads, learning, and premium products.",
        pros: ["Clear monetization path", "Uses existing distribution"],
        tradeoffs: ["Weakens user trust", "Makes content feel instrumental"],
        frameworkSignals: ["Monetization"]
      },
      {
        id: "linkedin-feed-b",
        label: "B",
        title: "Define the feed as professional conversations that matter",
        summary: "Prioritize relevant people, credible content, and work topics users care about.",
        pros: ["Creates destination value", "Improves product identity"],
        tradeoffs: ["Requires stricter quality calls", "May reduce short-term surface flexibility"],
        frameworkSignals: ["Clarity", "Trust"],
        isHistoricalChoice: true
      },
      {
        id: "linkedin-feed-c",
        label: "C",
        title: "Let creators determine the feed direction",
        summary: "Prioritize volume and creator tools first, then infer the product purpose from usage.",
        pros: ["More content supply", "Faster experimentation"],
        tradeoffs: ["Can dilute relevance", "May optimize for loudness over usefulness"],
        frameworkSignals: ["Supply"]
      }
    ]
  },
  {
    id: "scenario-slack-friction-comprehension",
    slug: "slack-friction-comprehension",
    title: "Slack Must Decide Which Friction Matters",
    company: "Slack",
    guest: "Stewart Butterfield",
    difficulty: "WORLD_CLASS",
    stage: "GROWTH",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "execution",
    shortPitch:
      "The team wants fewer clicks, but the real user problem may be comprehension rather than speed.",
    context:
      "A collaboration feature has friction in onboarding and setup. Some PMs want to remove every step, while support data shows users often feel unsure what the product is asking them to decide.",
    stakes:
      "Removing steps may increase confusion. Adding explanation may slow the flow but produce better understanding and long-term usage.",
    actualOutcome:
      "Butterfield's product lens distinguishes useless friction from helpful comprehension, focusing on making users understand without making them feel stupid.",
    expertReasoning:
      "The goal is not fewer clicks as an abstract metric. The goal is less cognitive load and a clearer path to value.",
    sourceQuote:
      "The challenge is really comprehension.",
    sourceFile: "podcasts/stewart-butterfield.md",
    frameworks: ["Comprehension over click count", "Utility curves", "Customer value creation"],
    options: [
      {
        id: "slack-friction-a",
        label: "A",
        title: "Remove as many setup steps as possible",
        summary: "Optimize for fewer clicks and a faster path through the flow.",
        pros: ["Looks cleaner in funnel metrics", "Feels faster initially"],
        tradeoffs: ["Can hide important decisions", "May increase downstream confusion"],
        frameworkSignals: ["Funnel"]
      },
      {
        id: "slack-friction-b",
        label: "B",
        title: "Keep the steps that improve user understanding",
        summary: "Reduce unnecessary work while preserving moments that make the product easier to reason about.",
        pros: ["Improves confidence", "Builds durable adoption"],
        tradeoffs: ["Requires nuanced measurement", "May not minimize raw clicks"],
        frameworkSignals: ["Comprehension", "Utility"],
        isHistoricalChoice: true
      },
      {
        id: "slack-friction-c",
        label: "C",
        title: "Move the decision into documentation",
        summary: "Keep the product flow short and rely on docs or help content for explanation.",
        pros: ["Simple interface", "Fast implementation"],
        tradeoffs: ["Users rarely read docs in the moment", "Separates help from the task"],
        frameworkSignals: ["Support"]
      }
    ]
  },
  {
    id: "scenario-microsoft-product-organism",
    slug: "microsoft-product-organism",
    title: "Your AI Product Needs to Learn",
    company: "Microsoft AI Platform",
    guest: "Asha Sharma",
    difficulty: "LEGENDARY",
    stage: "SCALE",
    decisionType: "STRATEGY",
    recommendedSkill: "analytics",
    shortPitch:
      "Shipping an AI feature is not enough if the product cannot improve from real interactions.",
    context:
      "Your platform team can launch a static AI workflow quickly, or invest in feedback loops, reward signals, and data pipelines that let the product improve over time.",
    stakes:
      "A static launch is faster but easier to copy. A learning loop takes more work but can become the product's compounding advantage.",
    actualOutcome:
      "Sharma frames modern AI products as organisms that ingest data, digest reward signals, and improve through ongoing interaction.",
    expertReasoning:
      "In AI-native products, the loop that improves outcomes becomes part of the product itself. The moat is not just the first shipped artifact.",
    sourceQuote:
      "Products aren't just static artifacts anymore.",
    sourceFile: "podcasts/asha-sharma.md",
    frameworks: ["Product as organism", "Feedback loop design", "Outcome-tuned systems"],
    options: [
      {
        id: "microsoft-organism-a",
        label: "A",
        title: "Ship the static workflow first",
        summary: "Prioritize speed and defer learning systems until the product proves demand.",
        pros: ["Fastest launch", "Lower initial complexity"],
        tradeoffs: ["Weak compounding loop", "Harder to improve systematically"],
        frameworkSignals: ["Speed"]
      },
      {
        id: "microsoft-organism-b",
        label: "B",
        title: "Build the interaction and reward loop into the first release",
        summary: "Make outcome capture, feedback, and iteration part of the core product architecture.",
        pros: ["Creates learning advantage", "Improves product quality over time"],
        tradeoffs: ["More upfront complexity", "Requires strong measurement design"],
        frameworkSignals: ["Learning loop", "Analytics"],
        isHistoricalChoice: true
      },
      {
        id: "microsoft-organism-c",
        label: "C",
        title: "Use generic model improvements as the roadmap",
        summary: "Rely on foundation model progress to make the product better without custom loops.",
        pros: ["Reduces platform work", "Benefits from external progress"],
        tradeoffs: ["Less differentiated", "Gives up product-specific learning"],
        frameworkSignals: ["Platform leverage"]
      }
    ]
  },
  {
    id: "scenario-cisco-ai-megatrend",
    slug: "cisco-ai-megatrend",
    title: "Cisco Has to Move Before the Org Feels Ready",
    company: "Cisco",
    guest: "Jeetu Patel",
    difficulty: "LEGENDARY",
    stage: "TURNAROUND",
    decisionType: "TEAM",
    recommendedSkill: "leadership",
    shortPitch:
      "A huge enterprise needs to become AI-forward while the technology, market, and internal capabilities are all changing.",
    context:
      "You manage a large product organization in a company not automatically perceived as an AI product leader. Teams want certainty before changing how they work.",
    stakes:
      "If you wait for certainty, the organization trails the market. If you force change without trust, the transformation becomes theater.",
    actualOutcome:
      "Patel treats AI as a megatrend, pushes the organization to prepare for the world six months ahead, and emphasizes public debate built on trust.",
    expertReasoning:
      "In a megatrend, the job is not to avoid discomfort. It is to create enough shared trust and urgency that teams can move before all answers are known.",
    sourceQuote:
      "When there's a megatrend, don't fight it.",
    sourceFile: "podcasts/jeetu-patel.md",
    frameworks: ["Megatrend recognition", "Trust-based debate", "Prepare for six months ahead"],
    options: [
      {
        id: "cisco-ai-a",
        label: "A",
        title: "Wait for clearer AI adoption data",
        summary: "Avoid disrupting the org until customer patterns and tools are more stable.",
        pros: ["Less internal churn", "More evidence before investment"],
        tradeoffs: ["Falls behind the market", "Signals hesitation"],
        frameworkSignals: ["Caution"]
      },
      {
        id: "cisco-ai-b",
        label: "B",
        title: "Mobilize around AI as a megatrend",
        summary: "Set expectations that teams should prepare for the near future and debate hard tradeoffs in public.",
        pros: ["Creates urgency", "Aligns a large org around the shift"],
        tradeoffs: ["Requires stamina", "Demands high trust"],
        frameworkSignals: ["Leadership", "Transformation"],
        isHistoricalChoice: true
      },
      {
        id: "cisco-ai-c",
        label: "C",
        title: "Centralize all AI decisions in one executive group",
        summary: "Keep quality and risk control high by routing decisions through a small senior team.",
        pros: ["Consistency", "Risk control"],
        tradeoffs: ["Slows learning", "Limits distributed ownership"],
        frameworkSignals: ["Governance"]
      }
    ]
  },
  {
    id: "scenario-rippling-understaffed-focus",
    slug: "rippling-understaffed-focus",
    title: "Rippling Has Too Many Important Projects",
    company: "Rippling",
    guest: "Matt MacInnis",
    difficulty: "WORLD_CLASS",
    stage: "SCALE",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "execution",
    shortPitch:
      "Teams want more headcount, but adding people may create politics and slow the highest-priority work.",
    context:
      "Several product initiatives are under pressure. Leaders are asking to staff every priority fully, while execution quality is starting to vary across the portfolio.",
    stakes:
      "Overstaffing may make the organization feel safer while quietly lowering intensity. Understaffing deliberately forces sharper choices but creates discomfort.",
    actualOutcome:
      "MacInnis argues for deliberately understaffing projects so teams preserve intensity, avoid waste, and keep focus on the highest-priority work.",
    expertReasoning:
      "When everything is staffed comfortably, teams drift toward local comfort and lower-priority work. Constraints can protect focus.",
    sourceQuote:
      "Deliberately understaffed every project.",
    sourceFile: "podcasts/matt-macinnis.md",
    frameworks: ["Deliberate understaffing", "Intensity preservation", "Priority pressure"],
    options: [
      {
        id: "rippling-focus-a",
        label: "A",
        title: "Fully staff every visible priority",
        summary: "Reduce pressure by giving each initiative enough people to feel covered.",
        pros: ["Stakeholders feel supported", "Less immediate stress"],
        tradeoffs: ["Creates lower-priority work", "Can slow decisions through coordination cost"],
        frameworkSignals: ["Coverage"]
      },
      {
        id: "rippling-focus-b",
        label: "B",
        title: "Keep teams constrained and force priority clarity",
        summary: "Staff the most important work tightly and let constraints expose what should not be pursued.",
        pros: ["Protects intensity", "Reduces waste"],
        tradeoffs: ["Uncomfortable for teams", "Requires strong escalation norms"],
        frameworkSignals: ["Focus", "Execution"],
        isHistoricalChoice: true
      },
      {
        id: "rippling-focus-c",
        label: "C",
        title: "Create a rotating tiger team",
        summary: "Move a senior team between projects as issues arise.",
        pros: ["Flexible response", "Concentrates expertise"],
        tradeoffs: ["Can create dependency", "Does not solve portfolio overload"],
        frameworkSignals: ["Resourcing"]
      }
    ]
  },
  {
    id: "scenario-scale-give-away-legos",
    slug: "scale-give-away-legos",
    title: "Your Role Is Scaling Faster Than You Are",
    company: "Facebook / Quip / Glue Club",
    guest: "Molly Graham",
    difficulty: "PRO",
    stage: "SCALE",
    decisionType: "TEAM",
    recommendedSkill: "leadership",
    shortPitch:
      "The work you mastered is now the work you need to hand off, or the company will outgrow your operating model.",
    context:
      "Your team is growing quickly. You are still holding the projects that made you successful, but new responsibilities are piling up and your team needs room to own more.",
    stakes:
      "If you keep your Legos, you become the bottleneck. If you hand them off poorly, quality drops and the team loses confidence.",
    actualOutcome:
      "Graham's well-known guidance is to give away your Legos: hand off the responsibilities you have mastered so you can grow into the next job the company needs.",
    expertReasoning:
      "Rapid scale forces leaders to repeatedly let go of familiar work. Growth means building systems and people, not protecting your old identity.",
    sourceQuote:
      "You have to grow as fast as your company is growing.",
    sourceFile: "podcasts/molly-graham.md",
    frameworks: ["Give away your Legos", "Leadership through scale", "Identity shift"],
    options: [
      {
        id: "legos-a",
        label: "A",
        title: "Keep the highest-impact projects yourself",
        summary: "Protect quality by staying close to the work you know best.",
        pros: ["Maintains short-term quality", "Uses your strongest skills"],
        tradeoffs: ["Creates bottlenecks", "Limits team growth"],
        frameworkSignals: ["Control"]
      },
      {
        id: "legos-b",
        label: "B",
        title: "Hand off mastered work and move to the next leadership curve",
        summary: "Give ownership to capable teammates while creating enough support for them to succeed.",
        pros: ["Scales leadership", "Builds team capability"],
        tradeoffs: ["Emotionally hard", "Requires coaching and trust"],
        frameworkSignals: ["Scale", "Delegation"],
        isHistoricalChoice: true
      },
      {
        id: "legos-c",
        label: "C",
        title: "Delay delegation until a formal reorg",
        summary: "Wait for clearer structure before transferring ownership.",
        pros: ["Avoids messy interim ownership"],
        tradeoffs: ["Lets bottlenecks compound", "Misses learning window"],
        frameworkSignals: ["Org design"]
      }
    ]
  },
  {
    id: "scenario-vercel-gtm-product",
    slug: "vercel-gtm-product",
    title: "GTM Should Feel Like Product",
    company: "Vercel / Stripe",
    guest: "Jeanne Grosser",
    difficulty: "PRO",
    stage: "GROWTH",
    decisionType: "GROWTH",
    recommendedSkill: "communication",
    shortPitch:
      "The product is strong, but the buying journey feels generic in a market where buyers have many similar options.",
    context:
      "You are helping a technical product scale go-to-market. Sales, marketing, support, and customer success each use slightly different segmentation and messaging.",
    stakes:
      "If GTM stays fragmented, customers experience inconsistency. If you over-process the motion, you slow learning and lose authenticity.",
    actualOutcome:
      "Grosser treats go-to-market as an integrated customer lifecycle and argues that the buying experience itself can become a differentiator.",
    expertReasoning:
      "When products become more similar at the margin, how customers experience discovery, evaluation, and buying increasingly shapes trust.",
    sourceQuote:
      "Think about your go-to-market process like a product.",
    sourceFile: "podcasts/jeanne-grosser.md",
    frameworks: ["GTM as product", "Integrated customer lifecycle", "Buying experience differentiation"],
    options: [
      {
        id: "vercel-gtm-a",
        label: "A",
        title: "Optimize each GTM function separately",
        summary: "Let marketing, sales, support, and success improve their own parts of the funnel.",
        pros: ["Clear functional ownership", "Faster local changes"],
        tradeoffs: ["Fragmented customer journey", "Misaligned segmentation"],
        frameworkSignals: ["Function"]
      },
      {
        id: "vercel-gtm-b",
        label: "B",
        title: "Design the GTM lifecycle as one customer experience",
        summary: "Map the journey from awareness to expansion and make each touchpoint feel coherent.",
        pros: ["Differentiates the buying experience", "Improves cross-functional alignment"],
        tradeoffs: ["Requires shared ownership", "Needs customer journey discipline"],
        frameworkSignals: ["Lifecycle", "Experience"],
        isHistoricalChoice: true
      },
      {
        id: "vercel-gtm-c",
        label: "C",
        title: "Defer GTM design until enterprise demand is obvious",
        summary: "Keep selling opportunistically and formalize the journey later.",
        pros: ["Flexible early selling", "Low process burden"],
        tradeoffs: ["Harder to scale repeatably", "Inconsistent learning"],
        frameworkSignals: ["Flexibility"]
      }
    ]
  },
  {
    id: "scenario-lovable-growth-reinvention",
    slug: "lovable-growth-reinvention",
    title: "Lovable Cannot Growth-Hack Its Way Out",
    company: "Lovable",
    guest: "Elena Verna",
    difficulty: "WORLD_CLASS",
    stage: "GROWTH",
    decisionType: "GROWTH",
    recommendedSkill: "growth",
    shortPitch:
      "The category is crowded and moving fast. Small conversion wins are not enough to stay ahead.",
    context:
      "Your AI product is growing quickly, but competitors are appearing constantly. The team has a familiar growth playbook of funnel optimization and experiments.",
    stakes:
      "If you optimize too locally, you may improve a shrinking advantage. If you reinvent too aggressively, you may ignore proven loops.",
    actualOutcome:
      "Verna describes needing to spend far more energy inventing new growth loops for AI products, while using optimization as a smaller part of the work.",
    expertReasoning:
      "In fast AI categories, growth can depend on creating new reasons to talk about and try the product, not just tuning existing funnels.",
    sourceQuote:
      "To be ahead is not optimization of the problem, it's reinvention of the solution.",
    sourceFile: "podcasts/elena-verna-40.md",
    frameworks: ["Growth reinvention", "Word-of-mouth loop", "Category speed"],
    options: [
      {
        id: "lovable-growth-a",
        label: "A",
        title: "Run more funnel optimization experiments",
        summary: "Increase testing velocity across onboarding, activation, and paywalls.",
        pros: ["Measurable", "Uses known growth muscle"],
        tradeoffs: ["May only create marginal gains", "Does not reset differentiation"],
        frameworkSignals: ["Optimization"]
      },
      {
        id: "lovable-growth-b",
        label: "B",
        title: "Invent new loops people want to talk about",
        summary: "Use product moments, building in public, and generous access to create stronger organic pull.",
        pros: ["Can compound word of mouth", "Matches fast category dynamics"],
        tradeoffs: ["Less predictable", "Requires bolder bets"],
        frameworkSignals: ["Growth loops", "Innovation"],
        isHistoricalChoice: true
      },
      {
        id: "lovable-growth-c",
        label: "C",
        title: "Shift budget toward paid acquisition",
        summary: "Buy attention while the category is hot.",
        pros: ["Immediate reach", "Scales demand capture"],
        tradeoffs: ["Expensive in crowded markets", "Does not create product love"],
        frameworkSignals: ["Acquisition"]
      }
    ]
  },
  {
    id: "scenario-ai-app-user-feedback",
    slug: "ai-app-user-feedback",
    title: "The AI Team Is Chasing the Wrong Improvements",
    company: "AI Product Platform",
    guest: "Chip Huyen",
    difficulty: "PRO",
    stage: "GROWTH",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "analytics",
    shortPitch:
      "The team is debating models and frameworks, but users are still struggling with reliability and workflow fit.",
    context:
      "Your AI app has early traction. Engineers want to adopt the newest agent framework and switch models, while customer interviews show repeated workflow and data-quality issues.",
    stakes:
      "A technology upgrade may feel sophisticated but fail to improve the product. Solving boring reliability issues may create more user value.",
    actualOutcome:
      "Huyen emphasizes that successful AI apps improve through user conversations, better data, reliable platforms, end-to-end workflows, and better prompts.",
    expertReasoning:
      "The best model choice matters less if the product is solving the wrong workflow or using poor data. Product improvement starts from the user problem.",
    sourceQuote:
      "Talk to users, build more reliable platforms, prepare better data, optimize workflows, write better prompts.",
    sourceFile: "podcasts/chip-huyen.md",
    frameworks: ["User feedback over hype", "Data quality", "Workflow reliability"],
    options: [
      {
        id: "ai-feedback-a",
        label: "A",
        title: "Adopt the newest agent framework",
        summary: "Modernize the stack so the product appears technically ahead.",
        pros: ["Signals innovation", "May unlock new capabilities"],
        tradeoffs: ["Can distract from user pain", "Switching cost may be high"],
        frameworkSignals: ["Technology"]
      },
      {
        id: "ai-feedback-b",
        label: "B",
        title: "Fix the workflow and data issues users keep reporting",
        summary: "Prioritize reliability, prompt quality, and end-to-end task success before chasing new tools.",
        pros: ["Directly improves user value", "Builds durable quality"],
        tradeoffs: ["Less flashy", "Requires detailed product work"],
        frameworkSignals: ["Reliability", "Users"],
        isHistoricalChoice: true
      },
      {
        id: "ai-feedback-c",
        label: "C",
        title: "Wait for the next frontier model release",
        summary: "Assume model improvements will solve the user experience problems soon.",
        pros: ["Low engineering effort now"],
        tradeoffs: ["No control over timing", "May leave workflow flaws untouched"],
        frameworkSignals: ["Model leverage"]
      }
    ]
  },
  {
    id: "scenario-dev-productivity-measurement",
    slug: "dev-productivity-measurement",
    title: "Developer Productivity Is Undefined",
    company: "Microsoft Research / DORA",
    guest: "Nicole Forsgren",
    difficulty: "PRO",
    stage: "SCALE",
    decisionType: "PRIORITIZATION",
    recommendedSkill: "analytics",
    shortPitch:
      "Executives want AI productivity gains, but teams do not agree on what productivity means.",
    context:
      "Your company is rolling out AI developer tools. Some leaders want to measure output volume, others want developer happiness, and platform teams talk about friction in the toolchain.",
    stakes:
      "If the metric is vague, teams optimize in different directions. If the metric is too narrow, you may create activity without better outcomes.",
    actualOutcome:
      "Forsgren's work pushes teams to define the problem and goal first, using frameworks like DORA and SPACE to avoid confusing different kinds of productivity work.",
    expertReasoning:
      "Measurement only helps when the team agrees on the goal. Developer experience, friction, throughput, quality, and culture are related but not interchangeable.",
    sourceQuote:
      "Starting with what is your problem or what is your goal?",
    sourceFile: "podcasts/nicole-forsgren.md",
    frameworks: ["Goal-first measurement", "DORA and SPACE", "Friction diagnosis"],
    options: [
      {
        id: "dev-prod-a",
        label: "A",
        title: "Measure lines of code and PR volume",
        summary: "Use easy output metrics to see whether AI tools increase activity.",
        pros: ["Simple to collect", "Fast executive dashboard"],
        tradeoffs: ["Can reward low-value activity", "Misses quality and flow"],
        frameworkSignals: ["Output"]
      },
      {
        id: "dev-prod-b",
        label: "B",
        title: "Define the productivity goal before choosing metrics",
        summary: "Clarify whether the problem is friction, delivery speed, quality, wellbeing, or business impact.",
        pros: ["Aligns teams", "Avoids misleading metrics"],
        tradeoffs: ["Requires deeper discovery", "Feels slower than dashboarding"],
        frameworkSignals: ["Measurement", "Alignment"],
        isHistoricalChoice: true
      },
      {
        id: "dev-prod-c",
        label: "C",
        title: "Let each team choose its own metric",
        summary: "Allow local autonomy because teams have different workflows.",
        pros: ["Context-sensitive", "Low central process"],
        tradeoffs: ["Hard to compare", "May fragment strategy"],
        frameworkSignals: ["Autonomy"]
      }
    ]
  },
  {
    id: "scenario-block-ai-agents",
    slug: "block-ai-agents",
    title: "Block Needs AI Adoption Beyond Engineers",
    company: "Block",
    guest: "Dhanji R. Prasanna",
    difficulty: "WORLD_CLASS",
    stage: "SCALE",
    decisionType: "TEAM",
    recommendedSkill: "execution",
    shortPitch:
      "AI agents are improving engineering work, but the biggest unlock may come from changing how every function works.",
    context:
      "Your engineering org uses AI tools heavily. Non-technical teams are curious but unsure whether agents are relevant to their work.",
    stakes:
      "If AI stays inside engineering, the company captures only part of the productivity gain. If rollout is too loose, quality and governance become uneven.",
    actualOutcome:
      "Prasanna highlights broad AI-native adoption at Block, including non-technical people using agents and programming tools to optimize their own workdays.",
    expertReasoning:
      "The opportunity is not just faster code. It is helping every team redesign repetitive work around tools that can act on their behalf.",
    sourceQuote:
      "Non-technical people using AI agents and programming tools are showing impact.",
    sourceFile: "podcasts/dhanji-r-prasanna.md",
    frameworks: ["AI-native operating model", "Distributed tool adoption", "Workflow leverage"],
    options: [
      {
        id: "block-ai-a",
        label: "A",
        title: "Keep AI agents focused on engineering",
        summary: "Maximize impact where the tools are most mature and measurable.",
        pros: ["Clear use case", "Easier quality control"],
        tradeoffs: ["Limits company-wide leverage", "Frames AI too narrowly"],
        frameworkSignals: ["Engineering"]
      },
      {
        id: "block-ai-b",
        label: "B",
        title: "Help every function redesign work with agents",
        summary: "Enable non-technical teams to build workflows and use agents for their own tasks with guardrails.",
        pros: ["Broad productivity upside", "Creates ownership across functions"],
        tradeoffs: ["Needs enablement", "Requires governance"],
        frameworkSignals: ["Adoption", "Execution"],
        isHistoricalChoice: true
      },
      {
        id: "block-ai-c",
        label: "C",
        title: "Centralize agent building in a platform team",
        summary: "Let specialists build approved workflows for the rest of the company.",
        pros: ["Consistent tooling", "Lower risk"],
        tradeoffs: ["Creates bottlenecks", "May miss local workflow nuance"],
        frameworkSignals: ["Platform"]
      }
    ]
  },
  {
    id: "scenario-surge-ai-quality",
    slug: "surge-ai-quality",
    title: "Surge AI Must Define Quality",
    company: "Surge AI",
    guest: "Edwin Chen",
    difficulty: "LEGENDARY",
    stage: "GROWTH",
    decisionType: "STRATEGY",
    recommendedSkill: "analytics",
    shortPitch:
      "AI labs need training data, but throwing bodies at labeling will not create frontier-level model quality.",
    context:
      "You are building an AI data company. Demand is exploding, and the fastest way to scale appears to be hiring large pools of low-cost labelers.",
    stakes:
      "If you scale volume without quality, the company becomes a commodity vendor. If you focus on elite quality, growth is harder but the work is more defensible.",
    actualOutcome:
      "Chen built Surge around elite data quality, expert environments, and evaluations, arguing that model behavior reflects the quality and values of the training signal.",
    expertReasoning:
      "The scarce resource is not generic labor. It is reliable judgment about what good looks like in complex domains.",
    sourceQuote:
      "People don't understand what quality even means in this space.",
    sourceFile: "podcasts/edwin-chen.md",
    frameworks: ["Quality as moat", "Expert judgment", "Evaluation-driven AI"],
    options: [
      {
        id: "surge-quality-a",
        label: "A",
        title: "Scale labeling volume as fast as possible",
        summary: "Meet demand by expanding the workforce and throughput quickly.",
        pros: ["Fast capacity growth", "Captures market demand"],
        tradeoffs: ["Commodity risk", "Quality inconsistency"],
        frameworkSignals: ["Scale"]
      },
      {
        id: "surge-quality-b",
        label: "B",
        title: "Build around elite data quality and expert evaluation",
        summary: "Prioritize the judgment and environments needed to teach models what good means.",
        pros: ["Defensible quality", "Better fit for frontier labs"],
        tradeoffs: ["Harder operating model", "Requires talent density"],
        frameworkSignals: ["Quality", "Evals"],
        isHistoricalChoice: true
      },
      {
        id: "surge-quality-c",
        label: "C",
        title: "Automate quality review with generic model checks",
        summary: "Use AI to judge the data and reduce dependence on expert humans.",
        pros: ["Lower cost", "Scales quickly"],
        tradeoffs: ["May reinforce model blind spots", "Weak for frontier gaps"],
        frameworkSignals: ["Automation"]
      }
    ]
  },
  {
    id: "scenario-scale-new-business-insight",
    slug: "scale-new-business-insight",
    title: "Scale Needs a Real New-Business Insight",
    company: "Scale AI / Uber Eats",
    guest: "Jason Droege",
    difficulty: "WORLD_CLASS",
    stage: "EARLY",
    decisionType: "STRATEGY",
    recommendedSkill: "strategy",
    shortPitch:
      "A new venture looks promising, but the team must prove it has an insight others do not.",
    context:
      "You are evaluating a new business idea inside a company with many smart people and many possible markets. The concept is exciting, but the reason you should win is still vague.",
    stakes:
      "If you launch without a differentiated insight, you enter a crowded race. If you over-scrutinize, you may miss a window.",
    actualOutcome:
      "Droege's product lesson centers on asking what insight you uniquely have and why you are lucky enough to have it before committing to a new business.",
    expertReasoning:
      "Entrepreneurial conviction should come from a specific edge, not generic market excitement.",
    sourceQuote:
      "What insight do I have, and why am I so lucky to have this insight?",
    sourceFile: "podcasts/jason-droege.md",
    frameworks: ["Unique insight test", "New-business validation", "Strategic edge"],
    options: [
      {
        id: "scale-insight-a",
        label: "A",
        title: "Launch because the market is large",
        summary: "Prioritize a big market with obvious demand and move quickly.",
        pros: ["Large upside", "Easy executive story"],
        tradeoffs: ["No clear right to win", "Crowded competitive field"],
        frameworkSignals: ["Market size"]
      },
      {
        id: "scale-insight-b",
        label: "B",
        title: "Pressure-test the unique insight before scaling",
        summary: "Identify the specific non-obvious truth that gives the team an advantage.",
        pros: ["Clarifies right to win", "Improves strategic focus"],
        tradeoffs: ["May slow launch", "Can kill exciting but weak ideas"],
        frameworkSignals: ["Insight", "Strategy"],
        isHistoricalChoice: true
      },
      {
        id: "scale-insight-c",
        label: "C",
        title: "Copy the fastest-growing competitor",
        summary: "Use a proven pattern and compete through execution speed.",
        pros: ["Known demand", "Fast path to product"],
        tradeoffs: ["Weak differentiation", "Execution alone may not be enough"],
        frameworkSignals: ["Execution"]
      }
    ]
  },
  {
    id: "scenario-claude-design-shift",
    slug: "claude-design-shift",
    title: "Design Cannot Stay a Mockup Factory",
    company: "Claude / Figma",
    guest: "Jenny Wen",
    difficulty: "PRO",
    stage: "SCALE",
    decisionType: "TEAM",
    recommendedSkill: "leadership",
    shortPitch:
      "AI has changed engineering speed, and design must decide how to create leverage without blocking builders.",
    context:
      "Engineers can now prototype quickly with AI tools. Designers are worried that moving too fast will reduce taste and coherence, but old design handoff cycles are slowing the team.",
    stakes:
      "If design stays in long mockup cycles, it becomes a bottleneck. If design steps back too far, product quality and judgment suffer.",
    actualOutcome:
      "Wen describes design shifting away from mostly mocks toward judgment, direction, taste, and helping teams execute in a faster AI-assisted environment.",
    expertReasoning:
      "The durable design value is deciding what should be built and what matters, not only producing polished artifacts.",
    sourceQuote:
      "Someone still needs to be accountable for the decision.",
    sourceFile: "podcasts/jenny-wen.md",
    frameworks: ["Design judgment", "AI-era collaboration", "Prototype-led direction"],
    options: [
      {
        id: "claude-design-a",
        label: "A",
        title: "Require polished mocks before engineering starts",
        summary: "Protect quality by preserving the traditional design gate.",
        pros: ["High visual control", "Clear handoff"],
        tradeoffs: ["Slows AI-assisted teams", "Can reduce learning speed"],
        frameworkSignals: ["Quality"]
      },
      {
        id: "claude-design-b",
        label: "B",
        title: "Shift design toward judgment and fast directional prototypes",
        summary: "Help teams make better product calls while moving with the new speed of building.",
        pros: ["Keeps design influential", "Improves speed and taste together"],
        tradeoffs: ["Requires new designer habits", "Less reliance on polished artifacts"],
        frameworkSignals: ["Judgment", "Collaboration"],
        isHistoricalChoice: true
      },
      {
        id: "claude-design-c",
        label: "C",
        title: "Let engineers own most design decisions",
        summary: "Remove design as a dependency so builders can ship faster.",
        pros: ["Fastest execution", "Less coordination"],
        tradeoffs: ["Risks incoherent UX", "Undervalues product taste"],
        frameworkSignals: ["Autonomy"]
      }
    ]
  },
  {
    id: "scenario-claude-code-builder-shift",
    slug: "claude-code-builder-shift",
    title: "Claude Code Is Turning Everyone Into Builders",
    company: "Anthropic",
    guest: "Boris Cherny",
    difficulty: "LEGENDARY",
    stage: "GROWTH",
    decisionType: "TEAM",
    recommendedSkill: "execution",
    shortPitch:
      "AI coding tools are changing who can build software and how product teams should divide work.",
    context:
      "Your product organization is debating whether PMs should stay focused on specs and coordination or start building prototypes and workflows directly with AI tools.",
    stakes:
      "If PMs do not adapt, they may slow down teams that can already build faster. If everyone builds without product judgment, the roadmap fragments.",
    actualOutcome:
      "Cherny argues that roles are shifting toward builders, with AI changing the boundary between product management and software creation.",
    expertReasoning:
      "The opportunity is not to replace product judgment. It is to pair judgment with the ability to make ideas concrete much faster.",
    sourceQuote:
      "Everyone is going to be a product manager, and everyone codes.",
    sourceFile: "podcasts/boris-cherny.md",
    frameworks: ["Builder mindset", "Role boundary shift", "AI-assisted execution"],
    options: [
      {
        id: "claude-code-a",
        label: "A",
        title: "Keep PMs out of building workflows",
        summary: "Maintain clean role boundaries so engineering owns implementation.",
        pros: ["Clear accountability", "Avoids messy prototypes"],
        tradeoffs: ["May slow learning", "Underuses new AI leverage"],
        frameworkSignals: ["Roles"]
      },
      {
        id: "claude-code-b",
        label: "B",
        title: "Train PMs to prototype and specify through AI tools",
        summary: "Let PMs turn product judgment into working artifacts while partnering with engineering.",
        pros: ["Faster idea validation", "Better product-engineering collaboration"],
        tradeoffs: ["Requires new skills", "Needs standards for quality"],
        frameworkSignals: ["Builder", "Execution"],
        isHistoricalChoice: true
      },
      {
        id: "claude-code-c",
        label: "C",
        title: "Replace specs with autonomous agent tasks",
        summary: "Skip detailed product docs and let agents generate solutions from loose goals.",
        pros: ["Very fast starts", "Less documentation overhead"],
        tradeoffs: ["Weak decision accountability", "Can create unfocused output"],
        frameworkSignals: ["Automation"]
      }
    ]
  },
  {
    id: "scenario-openai-api-model-future",
    slug: "openai-api-model-future",
    title: "OpenAI API Has to Build for Future Models",
    company: "OpenAI Developer Platform",
    guest: "Sherwin Wu",
    difficulty: "WORLD_CLASS",
    stage: "SCALE",
    decisionType: "STRATEGY",
    recommendedSkill: "strategy",
    shortPitch:
      "Customers need reliable tooling today, but model capabilities are changing fast enough to obsolete today's scaffolding.",
    context:
      "Your developer platform team is deciding whether to optimize around current model limitations or design abstractions for the capabilities likely to arrive soon.",
    stakes:
      "If you build only for today's gaps, models may eat your scaffolding. If you design too far ahead, developers may not understand the platform now.",
    actualOutcome:
      "Wu's guidance is to build for where models are going and remember that current models are the worst they will ever be.",
    expertReasoning:
      "AI platform strategy needs to separate durable developer jobs from temporary workarounds around current model limits.",
    sourceQuote:
      "Build for where the models are going and not where they are today.",
    sourceFile: "podcasts/sherwin-wu-v2.md",
    frameworks: ["Future-capability planning", "Durable abstractions", "Avoid temporary scaffolding traps"],
    options: [
      {
        id: "openai-api-a",
        label: "A",
        title: "Optimize for current model weaknesses",
        summary: "Build strong scaffolding around the limitations customers experience today.",
        pros: ["Solves immediate pain", "Easy for developers to value now"],
        tradeoffs: ["May become obsolete", "Can overfit to temporary constraints"],
        frameworkSignals: ["Today"]
      },
      {
        id: "openai-api-b",
        label: "B",
        title: "Design around durable jobs and future model gains",
        summary: "Support current needs while avoiding abstractions that assume today's limits are permanent.",
        pros: ["More future-proof", "Keeps platform flexible"],
        tradeoffs: ["Requires judgment", "May be harder to explain"],
        frameworkSignals: ["Platform", "Strategy"],
        isHistoricalChoice: true
      },
      {
        id: "openai-api-c",
        label: "C",
        title: "Wait for the model roadmap to stabilize",
        summary: "Avoid major platform commitments until capabilities settle down.",
        pros: ["Less rework risk"],
        tradeoffs: ["Too slow for developers", "Misses platform adoption window"],
        frameworkSignals: ["Caution"]
      }
    ]
  },
  {
    id: "scenario-devin-production-trust",
    slug: "devin-production-trust",
    title: "Devin Needs Production Trust",
    company: "Cognition",
    guest: "Scott Wu",
    difficulty: "WORLD_CLASS",
    stage: "GROWTH",
    decisionType: "LAUNCH",
    recommendedSkill: "execution",
    shortPitch:
      "An autonomous engineering agent can do real work, but customers need to trust it in production workflows.",
    context:
      "Your AI engineering product can complete increasingly complex tasks. Some customers see it as a demo novelty, while others are ready to use it like a remote teammate.",
    stakes:
      "If positioning overpromises autonomy, trust breaks. If positioning is too timid, the market misses the product's real shift.",
    actualOutcome:
      "Wu frames Devin as an autonomous engineer that teams work with through normal collaboration surfaces, while grounding credibility in real production usage.",
    expertReasoning:
      "For agentic products, the adoption challenge is not just capability. It is making the operating model legible and trustworthy.",
    sourceQuote:
      "Devin is designed to act like an actual remote engineer.",
    sourceFile: "podcasts/scott-wu.md",
    frameworks: ["Trust through production usage", "Agent operating model", "Capability with guardrails"],
    options: [
      {
        id: "devin-trust-a",
        label: "A",
        title: "Market Devin as a full engineer replacement",
        summary: "Lead with the boldest possible promise to capture attention.",
        pros: ["High attention", "Clear category creation"],
        tradeoffs: ["Trust risk", "Overpromising can damage adoption"],
        frameworkSignals: ["Positioning"]
      },
      {
        id: "devin-trust-b",
        label: "B",
        title: "Position Devin as a production teammate with visible workflows",
        summary: "Show how teams assign, review, and integrate agent work through normal engineering processes.",
        pros: ["Builds trust", "Makes adoption concrete"],
        tradeoffs: ["Requires proof points", "More nuanced story"],
        frameworkSignals: ["Trust", "Launch"],
        isHistoricalChoice: true
      },
      {
        id: "devin-trust-c",
        label: "C",
        title: "Keep Devin as an experimental developer tool",
        summary: "Avoid production claims until the technology is mature enough for any task.",
        pros: ["Low expectation risk"],
        tradeoffs: ["Undersells current value", "Slows category adoption"],
        frameworkSignals: ["Experiment"]
      }
    ]
  },
  {
    id: "scenario-every-ai-native-operating-model",
    slug: "every-ai-native-operating-model",
    title: "Every Wants a Tiny Team With Massive Output",
    company: "Every",
    guest: "Dan Shipper",
    difficulty: "PRO",
    stage: "EARLY",
    decisionType: "TEAM",
    recommendedSkill: "execution",
    shortPitch:
      "A small team can ship far more with AI, but only if workflows are redesigned instead of casually adopting tools.",
    context:
      "Your startup wants to operate AI-natively. People are using tools individually, but there is no shared workflow for prompts, requirements, product building, or operational leverage.",
    stakes:
      "If AI usage stays ad hoc, gains depend on individual enthusiasm. If workflows are systematized, the whole company can compound learning.",
    actualOutcome:
      "Shipper describes Every operating with AI-first workflows, AI-written code, and a role focused on helping the team automate and improve how work gets done.",
    expertReasoning:
      "The advantage comes from changing the operating system of the company, not merely giving everyone access to tools.",
    sourceQuote:
      "Organizations playing at the edge are doing things everybody else will be doing.",
    sourceFile: "podcasts/dan-shipper.md",
    frameworks: ["AI-native operating system", "Workflow codification", "Small-team leverage"],
    options: [
      {
        id: "every-ai-a",
        label: "A",
        title: "Let each employee find their own AI workflow",
        summary: "Encourage experimentation without adding process.",
        pros: ["Low friction", "High individual creativity"],
        tradeoffs: ["Learning does not compound", "Quality varies widely"],
        frameworkSignals: ["Autonomy"]
      },
      {
        id: "every-ai-b",
        label: "B",
        title: "Create shared AI workflows and operational leverage",
        summary: "Codify prompts, workflows, and practices so every team member improves faster.",
        pros: ["Company-wide compounding", "Scales small-team output"],
        tradeoffs: ["Requires ongoing maintenance", "Needs ownership"],
        frameworkSignals: ["Systems", "Execution"],
        isHistoricalChoice: true
      },
      {
        id: "every-ai-c",
        label: "C",
        title: "Use AI only for internal productivity tasks",
        summary: "Keep product development conventional while automating back-office work.",
        pros: ["Lower product risk", "Useful efficiency gains"],
        tradeoffs: ["Misses product-building leverage", "Keeps AI at the margins"],
        frameworkSignals: ["Efficiency"]
      }
    ]
  },
  {
    id: "scenario-jellyfish-founder-sales",
    slug: "jellyfish-founder-sales",
    title: "Founder Sales Is Really Customer Learning",
    company: "Jellyfish / State Affairs",
    guest: "Jen Abel",
    difficulty: "ROOKIE",
    stage: "EARLY",
    decisionType: "GROWTH",
    recommendedSkill: "communication",
    shortPitch:
      "Early founders want revenue, but the first sales conversations should teach them what the market actually feels.",
    context:
      "You are taking a B2B product from zero to one. The team wants a polished sales pitch, but prospects barely understand why the problem should matter now.",
    stakes:
      "If you sell too hard too early, you miss the learning needed for repeatable demand. If you only research, you may never earn the right to sell.",
    actualOutcome:
      "Abel teaches founders to use early sales conversations for fast learning, vulnerability, and earning the right to sell before forcing a close.",
    expertReasoning:
      "Founder-led sales is not just a revenue motion. It is the fastest path to understanding how the problem manifests for real buyers.",
    sourceQuote:
      "Founder-led sales is not about revenue on day one. It is about learning as fast as humanly possible.",
    sourceFile: "podcasts/jen-abel.md",
    frameworks: ["Founder-led learning", "Earn the right to sell", "Problem pulse"],
    options: [
      {
        id: "jellyfish-sales-a",
        label: "A",
        title: "Lead with a polished product pitch",
        summary: "Try to convince prospects quickly that the solution is ready and valuable.",
        pros: ["Confident narrative", "Can create early revenue"],
        tradeoffs: ["May skip discovery", "Can hide weak problem understanding"],
        frameworkSignals: ["Pitch"]
      },
      {
        id: "jellyfish-sales-b",
        label: "B",
        title: "Use sales calls to learn before pushing the close",
        summary: "Be transparent about stage and dig into how the problem shows up for buyers.",
        pros: ["Faster market learning", "Builds trust"],
        tradeoffs: ["Requires vulnerability", "May delay revenue ask"],
        frameworkSignals: ["Discovery", "Communication"],
        isHistoricalChoice: true
      },
      {
        id: "jellyfish-sales-c",
        label: "C",
        title: "Hire sales before founders spend time selling",
        summary: "Bring in an experienced seller to professionalize the motion immediately.",
        pros: ["Adds sales expertise", "Frees founder time"],
        tradeoffs: ["Too early for repeatability", "Outsources critical learning"],
        frameworkSignals: ["Hiring"]
      }
    ]
  }
];

export const featuredScenario = scenarios[0];
export const featuredPlayers = playerCards.slice(0, 4);

export function getScenarioBySlug(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}

export function getPlayerBySlug(slug: string) {
  return playerCards.find((player) => player.slug === slug);
}

export function buildFallbackEvaluation(
  scenarioId: string,
  optionId: string,
  reasoning: string
): EvaluationResult {
  const scenario = scenarios.find((entry) => entry.id === scenarioId);

  if (!scenario) {
    throw new Error("Scenario not found.");
  }

  const selectedOption = scenario.options.find((entry) => entry.id === optionId);
  const historicalOption = scenario.options.find((entry) => entry.isHistoricalChoice);

  if (!selectedOption || !historicalOption) {
    throw new Error("Scenario data is incomplete.");
  }

  const normalizedReasoning = reasoning.toLowerCase();
  const matchingFrameworks = scenario.frameworks.filter((framework) => {
    return normalizedReasoning.includes(framework.toLowerCase().split(" ")[0]);
  });

  const choiceAlignment = selectedOption.id === historicalOption.id ? 40 : 22;
  const reasoningAlignment = Math.min(30, 8 + matchingFrameworks.length * 6 + Math.min(12, reasoning.length / 24));
  const frameworkCoverage = Math.min(20, matchingFrameworks.length * 6);
  const completeness = Math.min(10, Math.max(3, Math.floor(reasoning.trim().split(/\s+/).length / 18)));
  const score = Math.min(
    100,
    Math.round(choiceAlignment + reasoningAlignment + frameworkCoverage + completeness)
  );

  const delta =
    selectedOption.id === historicalOption.id
      ? [
          "You matched the historical direction and focused on the right pressure point.",
          `You can strengthen the answer further by explicitly naming ${scenario.frameworks[0].toLowerCase()}.`
        ]
      : [
          `You chose ${selectedOption.label}, while the historical path was ${historicalOption.label}.`,
          `Your answer would improve if it dealt more directly with ${scenario.frameworks[0].toLowerCase()}.`
        ];

  const coaching = [
    `Name the tradeoff more sharply: ${historicalOption.tradeoffs[0].toLowerCase()}.`,
    `Anchor your reasoning to the governing framework: ${scenario.frameworks.join(", ")}.`,
    "Finish with an execution consequence so the recommendation feels operational, not abstract."
  ];

  return {
    score,
    choiceAlignment,
    reasoningAlignment,
    frameworkCoverage,
    completeness,
    verdict:
      score >= 80
        ? "World-class call. You were directionally aligned with the leader's actual move."
        : score >= 60
          ? "Strong instinct. The recommendation works, but it needs a clearer strategic spine."
          : "Playable, but not decisive enough. You saw part of the problem and missed the main leverage point.",
    delta,
    coaching,
    expertChoice: `${historicalOption.label} - ${historicalOption.title}`,
    expertQuote: scenario.sourceQuote
  };
}
