import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of Youmanize and Youmanize Plus subscriptions.",
}

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Effective September 11, 2026"
      title="Terms of Use"
      intro="These terms govern your use of Youmanize, operated by Skrypnyk Bohdan, an individual in Ukraine. You must be at least 16 years old to use the service."
    >
      <section>
        <h2>1. Acceptable use</h2>
        <p>
          You may upload or process only material you own or are authorized to
          use.
        </p>
        <p>
          You may not use Youmanize to impersonate others, harass or harm
          people, create illegal content, violate privacy, or infringe
          intellectual-property rights.
        </p>
      </section>
      <section>
        <h2>2. AI output</h2>
        <p>
          AI-generated output may be inaccurate, incomplete, or inappropriate.
          You are responsible for reviewing output before relying on,
          publishing, or sending it. Youmanize does not guarantee that output is
          unique or fit for a particular purpose.
        </p>
      </section>
      <section>
        <h2>3. Youmanize Plus</h2>
        <p>
          Youmanize Plus is offered as an auto-renewable monthly or annual
          subscription. Eligible new users may receive a three-day free trial.
          Each Apple subscription group permits one introductory offer per
          eligible customer. Apple shows the exact price, billing period, trial
          eligibility, and renewal terms before purchase.
        </p>
        <p>
          Subscription payment and renewal are handled through your Apple
          Account. Manage or cancel renewal in Apple subscription settings.
          Refund requests are handled by Apple at{" "}
          <a href="https://reportaproblem.apple.com/">
            reportaproblem.apple.com
          </a>
          .
        </p>
      </section>
      <section>
        <h2>4. Usage limits and availability</h2>
        <p>
          The trial includes up to 1 million AI tokens in total. Youmanize Plus
          includes up to 5 million AI tokens per subscription month. Limits are
          measured across supported AI features and do not roll over. Reasonable
          fair-use, security, technical, and provider limits may apply. Features
          may be changed, interrupted, or unavailable from time to time.
        </p>
      </section>
      <section>
        <h2>5. Apple terms</h2>
        <p>
          Your use of the iOS app is also governed by Apple’s{" "}
          <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
            Standard Licensed Application End User License Agreement
          </a>
          . If these terms conflict with mandatory Apple terms, the mandatory
          Apple terms control.
        </p>
      </section>
      <section>
        <h2>6. Ownership and termination</h2>
        <p>
          You retain rights in your source material. Youmanize and its software,
          branding, and original interface remain the property of the operator
          and licensors. We may suspend access when necessary to prevent abuse,
          protect the service, or comply with law.
        </p>
      </section>
      <section>
        <h2>7. Governing terms and contact</h2>
        <p>
          These terms are governed by the laws applicable to the operator in
          Ukraine, subject to any mandatory consumer protections in your
          country. Courts with jurisdiction under applicable law may hear
          disputes. Questions may be sent to Skrypnyk Bohdan at{" "}
          <a href="mailto:bogdan.skripnikui@gmail.com">
            bogdan.skripnikui@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
