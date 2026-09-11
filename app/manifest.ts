import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Youmanize",
    short_name: "Youmanize",
    description:
      "Build a personal writing voice and create text that still sounds like you.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f3",
    theme_color: "#f7f5f3",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
