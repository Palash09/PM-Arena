import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Contact and Feedback",
  description: "Contact Product Decision League or share feedback on the public alpha."
};

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Alpha support"
      title="Contact and Feedback"
      summary="Report a problem, request a correction, or tell us where the simulation lost credibility."
    >
      <section>
        <h2>Alpha feedback</h2>
        <p className="rounded-lg border border-mint/25 bg-mint/10 p-4 text-base font-black text-white">What felt least credible or most confusing?</p>
        <p>Signed-in players can send feedback directly from the <Link href="/profile">profile page</Link>. The form is delivered to the Product Decision League inbox through Resend.</p>
      </section>
      <section>
        <h2>Email</h2>
        <p>For support, privacy requests, attribution corrections, or security concerns, email <a href="mailto:palaasharma@gmail.com">palaasharma@gmail.com</a>. Please include the scenario URL and device type when reporting a gameplay issue.</p>
      </section>
      <section>
        <h2>Response scope</h2>
        <p>This is a small public alpha. We prioritize account access, scoring failures, privacy requests, attribution corrections, and issues that block mobile gameplay.</p>
      </section>
    </LegalPage>
  );
}
