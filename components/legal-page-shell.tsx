import Link from "next/link"

import { BrandLockup } from "@/components/site-brand"
import { SiteLegalFooter } from "@/components/site-legal-footer"

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background text-foreground" translate="no">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex min-h-20 w-full max-w-[1120px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link
            href="/"
            aria-label="Youmanize home"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <BrandLockup />
          </Link>
          <Link
            href="/"
            className="rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Back to home
          </Link>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-[900px] px-5 py-14 sm:px-8 sm:py-20"
      >
        <article>
          <p className="text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-[16ch] text-[clamp(2.6rem,7vw,5rem)] leading-[0.94] font-medium tracking-[-0.05em] text-balance">
            {title}
          </h1>
          <p className="mt-6 max-w-[70ch] text-lg leading-8 text-muted-foreground">
            {intro}
          </p>
          <div className="mt-12 space-y-10 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.03em] [&_li]:pl-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mt-3 [&_p]:leading-7 [&_p]:text-muted-foreground [&_section]:scroll-mt-24 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:text-muted-foreground">
            {children}
          </div>
        </article>
      </main>
      <SiteLegalFooter />
    </div>
  )
}
