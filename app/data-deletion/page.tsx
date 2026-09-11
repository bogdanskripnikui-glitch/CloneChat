import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata: Metadata = {
  title: "Data Deletion",
  description:
    "How to export or delete local Youmanize data and revoke AI consent.",
}

export default function DataDeletionPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy and data"
      title="Delete your Youmanize data"
      intro="Youmanize does not currently use user accounts. Most app data is stored locally on your device, so there is no separate online account to delete."
    >
      <section>
        <h2>Delete a profile and its data</h2>
        <ol className="space-y-2 text-muted-foreground">
          <li>Open Youmanize.</li>
          <li>Go to Settings → Privacy and data.</li>
          <li>
            Choose the profile or local data you want to remove, then confirm
            deletion.
          </li>
        </ol>
        <p>
          You can export local profile data from the same screen before deleting
          it.
        </p>
      </section>
      <section>
        <h2>Delete all local data</h2>
        <p>
          Use the in-app deletion controls, or delete Youmanize from your device
          to remove all remaining data stored locally by the app on that device.
        </p>
      </section>
      <section>
        <h2>Revoke AI consent</h2>
        <p>
          Go to Settings → Privacy and data and turn off consent for AI
          processing. AI-powered features will remain unavailable until you
          consent again.
        </p>
      </section>
      <section>
        <h2>Security and App Attest requests</h2>
        <p>
          For a privacy request concerning Cloudflare/OpenAI processing or App
          Attest security records, email{" "}
          <a href="mailto:bogdan.skripnikui@gmail.com">
            bogdan.skripnikui@gmail.com
          </a>
          . App Attest records are normally retained for 90 days after the last
          verified request.
        </p>
      </section>
      <section>
        <h2>Your subscription is separate</h2>
        <p>
          Deleting app data or deleting the app does not cancel Youmanize Plus.
          Manage or cancel the subscription in{" "}
          <a href="https://support.apple.com/en-us/118428">
            Apple subscription settings
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
