import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Youmanize handles local app data, AI processing, purchases, and security records.",
}

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Effective September 11, 2026"
      title="Privacy Policy"
      intro="This policy explains how Youmanize handles information when you use the iOS app and related services. Youmanize is operated by Skrypnyk Bohdan, an individual in Ukraine."
    >
      <section>
        <h2>1. Information stored on your device</h2>
        <p>
          Your profiles, imported writing and conversations, style settings,
          learned facts, history, drafts, and images are primarily stored
          locally on your device. We do not currently require or provide a
          Youmanize account.
        </p>
      </section>
      <section>
        <h2>2. AI processing</h2>
        <p>
          When you intentionally use an AI feature, the text and context needed
          to complete that request are sent through a Cloudflare Worker to
          OpenAI. Cloudflare and OpenAI act as service providers that process
          this information to deliver the requested feature.
        </p>
        <p>
          OpenAI does not use API content to train its models by default. Unless
          Zero Data Retention applies, OpenAI may retain abuse-monitoring logs
          for up to 30 days. Do not submit information you are not authorized to
          process.
        </p>
      </section>
      <section>
        <h2>3. App Attest and security records</h2>
        <p>
          To protect the service and prevent abuse, we process an App Attest key
          identifier, cryptographic verification data, counters, timestamps, and
          usage totals. These security records are retained for 90 days after
          the last verified request and are then deleted or de-identified.
        </p>
      </section>
      <section>
        <h2>4. Purchases</h2>
        <p>
          Apple processes App Store purchases and payment details. Youmanize
          receives subscription and transaction status needed to unlock
          features, but does not receive your full payment-card details.
        </p>
      </section>
      <section>
        <h2>5. Advertising and tracking</h2>
        <p>
          Youmanize does not show third-party advertising, sell personal data,
          or track you across other companies’ apps or websites. The app does
          not request App Tracking Transparency permission.
        </p>
      </section>
      <section>
        <h2>6. Your choices</h2>
        <ul>
          <li>Revoke AI-processing consent in Settings → Privacy and data.</li>
          <li>
            Export or delete local profile data in Settings → Privacy and data.
          </li>
          <li>
            Delete the app to remove its remaining local data from that device.
          </li>
        </ul>
        <p>
          Because there is no account, account deletion is not applicable. For a
          privacy request concerning security or App Attest records, email{" "}
          <a href="mailto:bogdan.skripnikui@gmail.com">
            bogdan.skripnikui@gmail.com
          </a>
          .
        </p>
      </section>
      <section>
        <h2>7. International processing and security</h2>
        <p>
          Cloudflare and OpenAI may process data in countries outside yours. We
          use reasonable technical and organizational safeguards, including
          encrypted transport and App Attest verification, but no system can
          guarantee absolute security.
        </p>
      </section>
      <section>
        <h2>8. Children</h2>
        <p>Youmanize is intended for people aged 16 or older.</p>
      </section>
      <section>
        <h2>9. Changes and contact</h2>
        <p>
          We may update this policy as the app changes. The effective date above
          identifies the current version. Questions may be sent to Skrypnyk
          Bohdan at{" "}
          <a href="mailto:bogdan.skripnikui@gmail.com">
            bogdan.skripnikui@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
