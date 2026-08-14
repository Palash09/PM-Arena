import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of Product Decision League."
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="League rules"
      title="Terms of Use"
      summary="These terms set the rules for using Product Decision League during its public alpha and beyond."
    >
      <section><h2>Using the service</h2><p>You may use Product Decision League for personal learning and professional development. You must provide accurate account information, protect your login credentials, and be legally able to agree to these terms.</p></section>
      <section><h2>Learning simulation, not professional advice</h2><p>Scenarios simplify real events for educational gameplay. Scores and AI-generated feedback are coaching signals, not a definitive assessment of your ability and not legal, financial, employment, or other professional advice. You remain responsible for real-world decisions.</p></section>
      <section><h2>Your content</h2><p>You keep ownership of reasoning and feedback you submit. You grant us a limited license to process that content to operate, secure, evaluate, and improve the service. Do not submit confidential, unlawful, infringing, or harmful content.</p></section>
      <section><h2>Acceptable use</h2><p>Do not attempt to disrupt the service, bypass usage limits, scrape protected content, access another user&apos;s account, introduce malicious code, or use the service in violation of law. We may suspend access needed to protect users or the platform.</p></section>
      <section><h2>Intellectual property and attribution</h2><p>The Product Decision League software, design, and original game content belong to the platform owner. Guest names, company names, marks, and attributed excerpts belong to their respective owners. Their inclusion does not imply sponsorship or endorsement. See our <Link href="/attribution">attribution statement</Link>.</p></section>
      <section><h2>Availability and changes</h2><p>The alpha may change, experience interruptions, or contain errors. We may modify features, limits, scenarios, or these terms. Continued use after a material update means you accept the revised terms.</p></section>
      <section><h2>Disclaimers and liability</h2><p>The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the extent permitted by law. We disclaim implied warranties and are not liable for indirect, incidental, special, consequential, or lost-profit damages arising from use of the service.</p></section>
      <section><h2>Contact</h2><p>Questions about these terms can be sent through the <Link href="/contact">contact page</Link>.</p></section>
    </LegalPage>
  );
}
