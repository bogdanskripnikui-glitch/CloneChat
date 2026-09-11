import Link from "next/link"

import { BrandLockup } from "@/components/site-brand"

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/support", label: "Support" },
  { href: "/data-deletion", label: "Data deletion" },
] as const

export function SiteLegalFooter({ inverse = false }: { inverse?: boolean }) {
  return (
    <footer
      className={
        inverse
          ? "border-t border-white/14 text-primary-foreground/64"
          : "border-t border-border/80 text-muted-foreground"
      }
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <BrandLockup
            compact
            inverse={inverse}
            className="text-sm text-current"
          />
          <span aria-hidden="true" className="text-current/40">
            ·
          </span>
          <p className="text-sm">© 2026</p>
        </div>
        <nav aria-label="Legal and support">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm underline-offset-4 transition-colors duration-160 hover:text-current hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
