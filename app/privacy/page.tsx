import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Product Decision League collects, uses, and protects personal information."
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Trust center"
      title="Privacy Policy"
      summary="This policy explains the limited information we collect to run the game, save progress, improve scenarios, and respond to feedback."
    >
      <section>
        <h2>Information we collect</h2>
        <p>We collect account details you provide, such as your email address, display name, and authentication method. We also store scenario choices, reasoning you submit, scores, saved career progress, feedback messages, and basic technical or campaign data such as page path, referrer, device information, and UTM parameters.</p>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>We use this information to authenticate you, deliver and save gameplay, generate decision feedback, measure whether the experience works, prevent abuse, monitor errors and AI spend, respond to support requests, and improve Product Decision League. We do not sell personal information.</p>
      </section>
      <section>
        <h2>AI processing</h2>
        <p>Your selected option and written reasoning may be sent to Anthropic to generate coaching feedback. When AI evaluation is unavailable or a usage limit is reached, the app uses rules-based scoring. Do not submit confidential employer, customer, or personal information in your reasoning.</p>
      </section>
      <section>
        <h2>Service providers</h2>
        <p>We use infrastructure and service providers including Netlify for hosting, PostgreSQL for application data, Google for optional OAuth, Anthropic for AI evaluation, and Resend for password-reset, feedback, and support email delivery. These providers process information under their own terms and privacy practices.</p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>We keep account and saved-progress data while your account is active and retain operational records only as long as reasonably needed for product, security, legal, and support purposes. We use reasonable safeguards, but no online system can guarantee absolute security.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You can use public playable challenges without creating an account. You may request access, correction, or deletion of your account data by contacting us. You can also clear locally saved browser progress through your browser settings.</p>
      </section>
      <section>
        <h2>Children and changes</h2>
        <p>The service is not directed to children under 13. We may update this policy as the product changes and will revise the effective date when we do.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions or privacy requests can be sent through the <Link href="/contact">contact page</Link>.</p>
      </section>
    </LegalPage>
  );
}
