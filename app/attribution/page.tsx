import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Attribution",
  description: "Source, excerpt, artwork, and trademark attribution for Product Decision League."
};

export default function AttributionPage() {
  return (
    <LegalPage
      eyebrow="Source integrity"
      title="Attribution"
      summary="Product Decision League turns attributed product-leadership conversations into short educational decision simulations."
    >
      <section><h2>Scenario sources</h2><p>Alpha scenarios are derived from the podcast transcript corpus included with this project, with the featured guest and company shown in each challenge. Reveals use short excerpts or concise paraphrases to identify the real-world approach and explain the expert&apos;s reasoning.</p></section>
      <section><h2>Editorial transformation</h2><p>Each challenge is an educational transformation, not a complete transcript or a claim that only one answer can work. Scenario context, options, scoring, and coaching may be condensed or editorialized for gameplay. Strong alternative reasoning can score well while the reveal clearly marks where it differs from the historical approach.</p></section>
      <section><h2>Leader artwork</h2><p>Leader-card portraits are stylized illustrations created for the game. They are not photographs, official likenesses, endorsements, or commissioned assets from the featured guests or companies.</p></section>
      <section><h2>Names and trademarks</h2><p>Guest names, company names, product names, podcast names, logos, and trademarks remain the property of their respective owners. Product Decision League is independent and is not affiliated with or endorsed by those people, companies, or publishers.</p></section>
      <section><h2>Corrections</h2><p>If a source, excerpt, role, outcome, or attribution needs correction, please use the <Link href="/contact">contact page</Link>. We will review credible correction requests promptly.</p></section>
    </LegalPage>
  );
}
