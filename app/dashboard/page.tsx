import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Voxform Dashboard",
  description:
    "Dashboard preview for voices, writing workspace, subscriptions, and settings.",
}

export default function DashboardPage() {
  redirect("/")
}
