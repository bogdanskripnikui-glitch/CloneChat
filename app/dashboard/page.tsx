import type { Metadata } from "next"

import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Voxform Dashboard",
  description:
    "Dashboard preview for voices, writing workspace, subscriptions, and settings.",
}

export default function DashboardPage() {
  return <DashboardShell />
}
