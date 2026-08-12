# Product Decision League Distribution Roadmap

## Objective

Build a low-cost, founder-led distribution system that turns useful participation in product-management conversations into qualified visits, completed playable challenges, feedback, and repeat use.

The initial loop is:

```text
Find a real PM discussion
        -> contribute a useful answer
        -> share a relevant playable decision when appropriate
        -> user completes the challenge
        -> ask for one specific piece of feedback
        -> publish what was learned
```

Product Decision League does not need an existing audience or access to prominent product leaders to start. It needs a reliable application, relevant conversations, useful contributions, and disciplined measurement.

## Positioning

### Primary audience

- Aspiring product managers learning how to apply frameworks
- Associate and mid-level PMs practicing higher-scope decisions
- PM interview candidates who need judgment practice rather than more theory
- Product builders who enjoy comparing approaches to real company decisions

### Core promise

> Practice real product decisions, explain your reasoning, and compare your approach with the product leader who lived the situation.

### Launch message

Product Decision League is not a podcast search tool or framework library. It converts real product-leadership stories into two-minute decision challenges that require the player to make and defend a call.

## Distribution Principles

1. Contribute before linking. Every comment or reply must be useful without a product click.
2. Share only a scenario that directly extends the conversation.
3. Disclose the relationship: "I built Product Decision League" rather than presenting the link as an independent recommendation.
4. Do not mass-post identical copy across communities.
5. Respect community promotion rules and moderator decisions.
6. Do not use scraped emails, automated replies, unsolicited bulk DMs, or fake engagement.
7. Ask for a small feedback action: confusing moment, scoring quality, or whether they would play another scenario.
8. Treat early distribution as research. Optimize for completed challenges and useful feedback, not impressions.

## Launch Readiness Gate

Distribution begins only after all P0 items pass in production.

| ID | Priority | Task | Done when |
| --- | --- | --- | --- |
| BRD-01 | P0 | Complete Product Decision League rebrand | UI, email, metadata, social previews, assets, docs, and dashboard use the canonical name |
| DOM-01 | P0 | Purchase and connect the final domain to Netlify | HTTPS works and the custom domain is the primary production URL |
| DOM-02 | P0 | Set `NEXT_PUBLIC_APP_URL` | Canonicals, social images, email links, and OAuth use the custom domain |
| DEP-01 | P0 | Commit, push, and deploy the playable challenge | Production matches the verified mobile prototype |
| DB-01 | P0 | Verify hosted Postgres schema | Signup, sessions, progress, password reset, and analytics persist |
| AI-01 | P0 | Verify the production Anthropic model and fallback | Scoring works and rules-based scoring survives provider failure |
| SEC-01 | P0 | Add public evaluation rate limiting | A traffic spike cannot create uncontrolled Anthropic cost |
| DAT-01 | P0 | Persist first-touch attribution | Source survives navigation, challenge completion, and signup |
| DAT-02 | P0 | Track account creation and second completion | The activation funnel is measurable |
| LEG-01 | P0 | Publish privacy, terms, content attribution, and contact pages | Pages are linked from all public surfaces |
| OPS-01 | P0 | Add error and API-cost monitoring | Production failures and spend are visible quickly |
| QA-01 | P0 | Run production mobile and desktop smoke tests | Challenge, signup, OAuth, reset, progress, share preview, and leader unlock pass |
| SEO-01 | P1 | Add robots, sitemap, canonical metadata, and structured page titles | Search engines receive the custom-domain URLs |
| SHR-01 | P1 | Add result-image sharing | A user can share a score and scenario as a recognizable visual |

## Measurement

### North-star metric

**Weekly Activated Players:** unique users who complete at least two scenarios within seven days.

### Early funnel

| Stage | Event | Diagnostic target |
| --- | --- | ---: |
| Qualified visit | `challenge_view` | Establish baseline |
| Decision intent | `challenge_started` | 25% of qualified views |
| Value experienced | `challenge_completed` | 60% of starts |
| Product interest | `challenge_cta_clicked` | 15% of completions |
| Account/save intent | `account_created` | 10% of completions |
| Activation | `second_scenario_completed` | 20% of accounts within seven days |
| Organic distribution | `challenge_shared` | 8% of completions |

These are diagnostic hypotheses, not external benchmarks. Recalibrate after the first 100 qualified visits.

### Channel tagging

Use one URL per post or conversation:

```text
utm_source=linkedin|x|reddit
utm_medium=founder_post|reply|community_post
utm_campaign=alpha_<scenario_slug>
utm_content=<short_post_identifier>
```

## Channel Playbooks

### LinkedIn

LinkedIn is the primary launch channel because the product is professional, scenario-led, and easy to demonstrate in a founder post.

#### Weekly actions

- Publish two original posts from the founder profile.
- Leave five thoughtful comments on active PM discussions across the week.
- Share at most two product links in comments, and only when directly relevant.
- Reply to every substantive comment on Product Decision League posts.

#### Post formats

1. **Decision prompt:** give enough context, list three options, ask readers to choose before showing the link.
2. **Build insight:** explain why consuming PM advice did not create decision muscle and what the prototype is testing.
3. **Result insight:** share anonymized reasoning patterns from completed challenges.
4. **Framework critique:** discuss where a known framework helps and where it fails under pressure, followed by a relevant scenario.

#### First launch post structure

```text
Hook: PMs consume more advice than they can apply.
Situation: one crisp real-company decision.
Question: A, B, or C and why?
Product: I built Product Decision League to turn these stories into practice.
CTA: Play this two-minute challenge and tell me whether the feedback is useful.
Disclosure: Based on a short, attributed product-leadership excerpt.
```

### X

X is a conversation channel, not a link-dumping channel.

#### Weekly actions

- Search for recent posts containing PM interview, product strategy, prioritization, product sense, roadmap, pricing, or PM career questions.
- Add three to five useful replies per day when there is a genuine contribution to make.
- Publish two standalone decision prompts per week.
- Share the challenge link only after providing the core reasoning in the post or reply.

#### Reply pattern

```text
1. Answer the person's question directly.
2. Name the tradeoff they may be overlooking.
3. Offer a compact framework or example.
4. If relevant: "I turned a similar real-company decision into a playable scenario here. I built it and would value feedback on the scoring."
```

Never use automated replies, repeated templates, or unrelated trending conversations.

### Reddit

Reddit requires the highest trust threshold. Community participation must precede promotion.

#### Discovery

- Identify active product-management, career, interview, startup, and product-strategy communities.
- Read each community's self-promotion and survey rules before posting.
- Maintain a simple community register: subreddit, rules, allowed format, relevant topics, last contribution, and moderator notes.

#### Weekly actions

- Contribute five to ten useful comments without links.
- Publish one discussion-first post only where self-promotion is permitted.
- Ask moderators before sharing if the rules are ambiguous.
- Use a text post that fully contains the decision and reasoning prompt; place the product link at the end as an optional interactive version.

#### Reddit post structure

```text
Title: A genuine PM decision question, not the product name.
Context: enough detail to debate the tradeoff.
Options: three plausible choices.
Founder disclosure: explain that the scenario is part of a tool you built.
Request: ask for critique of the decision and the feedback mechanism.
Optional link: tagged Reddit challenge URL.
```

Do not cross-post identical copy, ask for upvotes, or revive old threads to insert a link.

## Four-Week Organic Launch

### Week 0: Product and channel preparation

- Complete all P0 readiness items.
- Connect the final custom domain to Netlify.
- Prepare three flagship challenges across strategy, prioritization, and growth.
- Create one tagged link per channel and post.
- Create LinkedIn, X, and Reddit founder profile descriptions using the same positioning.
- Build the community register and a 20-conversation watchlist.
- Draft, but do not automatically publish, the first week's posts and replies.

### Week 1: Small public alpha

- Publish one LinkedIn founder story and one decision prompt.
- Publish one X decision prompt and participate in relevant discussions daily.
- Establish Reddit credibility through comments; post the first scenario only where rules clearly permit it.
- Target 20 qualified visitors, not a specific number of personal contacts.
- Ask every responding user one question: "What felt least credible or most confusing?"

### Week 2: Improve the handoff

- Fix the largest challenge-completion or post-result drop-off.
- Publish the expert reveal and anonymized reasoning patterns from Week 1.
- Test a second scenario with a different decision type.
- Compare completion and CTA rates by channel and post format.
- Continue discussion-first participation instead of increasing link frequency.

### Week 3: Repeat what works

- Double down on the strongest channel and content format.
- Add result-image sharing if the share rate is constrained by presentation.
- Publish a build-in-public post with real funnel numbers and lessons.
- Ask three activated users for a short feedback call or written response; no pre-existing relationship is required.

### Week 4: Decide expansion

- Review the first 100 qualified visits or all available evidence if traffic is lower.
- Keep, change, or stop each channel based on completed challenges and feedback quality.
- Create the next four-week calendar from proven topics.
- Consider PM newsletters, small communities, and Product Hunt only after the core loop is reliable.

## Daily Operating Rhythm

Budget 45-60 minutes per weekday:

```text
15 minutes: find current discussions
20 minutes: write useful replies without forcing a link
10 minutes: respond to Product Decision League feedback
10 minutes: record URLs, UTM tags, outcomes, and follow-ups
5 minutes: review errors and Anthropic usage
```

## Content Production System

One scenario should produce:

- One playable challenge
- One LinkedIn decision post
- One LinkedIn reveal or learning post
- One X prompt
- One short X thread explaining the tradeoff
- One Reddit discussion draft adapted to a specific community's rules
- Three response snippets that answer common PM questions without requiring a link

Draft generation and UTM creation can be automated. Publishing, replies, Reddit submissions, moderator outreach, and personal messages remain human-reviewed.

## Expansion Gates

Do not use paid ads or launch broadly on Product Hunt until:

- Production has no unresolved critical errors.
- AI requests are rate-limited and cost-monitored.
- At least 100 qualified challenge visits have been measured.
- Challenge start and completion rates are stable enough to diagnose.
- At least ten users have provided useful qualitative feedback.
- The second-scenario activation rate is measurable.
- Content and likeness use has a documented public-use boundary.

## Immediate Execution Order

1. Finish and verify the Product Decision League rebrand.
2. Confirm and connect the final domain while retaining Netlify hosting.
3. Implement P0 reliability, legal, attribution, and monitoring work.
4. Prepare three flagship challenges and tagged channel links.
5. Build the first one-week LinkedIn, X, and Reddit content pack.
6. Begin the small public alpha only after the production readiness gate passes.
