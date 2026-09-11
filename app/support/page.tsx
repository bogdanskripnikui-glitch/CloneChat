import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get technical, subscription, privacy, and product support for Youmanize.",
}

export default function SupportPage() {
  return (
    <LegalPageShell
      eyebrow="Youmanize support"
      title="How can we help?"
      intro="Email us with enough detail to understand the issue. We review support messages and respond as soon as reasonably possible."
    >
      <section>
        <h2>Contact</h2>
        <p>
          Email{" "}
          <a href="mailto:bogdan.skripnikui@gmail.com">
            bogdan.skripnikui@gmail.com
          </a>
          . Use one of these subject lines: Technical issue, Billing or
          subscription, Privacy or data request, or Feature request.
        </p>
      </section>
      <section>
        <h2>Before contacting support</h2>
        <ol className="space-y-2 text-muted-foreground">
          <li>Update Youmanize and iOS to the latest available version.</li>
          <li>Check your internet connection for AI features.</li>
          <li>Close and reopen the app, then retry the action.</li>
          <li>
            Include the device model, iOS version, app version, and steps that
            reproduce the issue. Do not send sensitive source material unless
            necessary.
          </li>
        </ol>
      </section>
      <section>
        <h2>Subscriptions and refunds</h2>
        <p>
          Manage or cancel Youmanize Plus through{" "}
          <a href="https://support.apple.com/en-us/118428">
            Apple subscription settings
          </a>
          . Apple handles billing and refunds. To request a refund, visit{" "}
          <a href="https://reportaproblem.apple.com/">
            reportaproblem.apple.com
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Privacy and data</h2>
        <p>
          See the <a href="/privacy">Privacy Policy</a> and{" "}
          <a href="/data-deletion">data deletion instructions</a>. For a request
          concerning privacy or App Attest security records, email the address
          above.
        </p>
      </section>
    </LegalPageShell>
  )
}
