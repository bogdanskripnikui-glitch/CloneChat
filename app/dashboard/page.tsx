import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Youmanize Dashboard",
  description:
    "Dashboard preview for voices, writing workspace, subscriptions, and settings.",
}

export default function DashboardPage() {
  redirect("/")
}
