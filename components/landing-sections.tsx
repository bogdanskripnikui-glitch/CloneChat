"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CrownIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function useSectionVisible(threshold = 0.45) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold])

  return { isVisible, ref }
}

type BillingCycle = "monthly" | "yearly"

const planCatalog = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      note: "for first analysis",
      description: "Try the core workflow without an account.",
      features: [
        "1 voice profile",
        "5 generations per week",
        "Paste text and file upload",
      ],
      cta: "Start free",
      featured: false,
      action: "#voice-training",
    },
    {
      name: "Pro",
      price: "$24",
      note: "per month",
      description: "For creators and operators who need daily output.",
      features: [
        "Unlimited generations",
        "Telegram chat imports",
        "Separate business and casual modes",
      ],
      cta: "Join Pro waitlist",
      featured: true,
      action: "#footer-cta",
    },
    {
      name: "Teams",
      price: "$79",
      note: "per workspace",
      description: "For teams that want shared voice systems and review flow.",
      features: [
        "Shared style libraries",
        "Approval-ready draft pipeline",
        "Priority onboarding",
      ],
      cta: "Request access",
      featured: false,
      action: "#footer-cta",
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      note: "always free",
      description: "Try the core workflow without an account.",
      features: [
        "1 voice profile",
        "5 generations per week",
        "Paste text and file upload",
      ],
      cta: "Start free",
      featured: false,
      action: "#voice-training",
    },
    {
      name: "Pro",
      price: "$228",
      note: "per year · save 21%",
      description: "For creators and operators who need daily output.",
      features: [
        "Unlimited generations",
        "Telegram chat imports",
        "Separate business and casual modes",
      ],
      cta: "Join Pro waitlist",
      featured: true,
      action: "#footer-cta",
    },
    {
      name: "Teams",
      price: "$790",
      note: "per year",
      description: "For teams that want shared voice systems and review flow.",
      features: [
        "Shared style libraries",
        "Approval-ready draft pipeline",
        "Priority onboarding",
      ],
      cta: "Request access",
      featured: false,
      action: "#footer-cta",
    },
  ],
} as const

export function PricingSection({
  onNavigate,
}: {
  onNavigate: (href: string) => void
}) {
  const { isVisible, ref } = useSectionVisible(0.35)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")

  return (
    <section
      ref={ref}
      id="pricing"
      aria-labelledby="pricing-title"
      className="flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden bg-transparent"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col justify-center px-4 pt-24 pb-4 sm:px-5 sm:pt-40 sm:pb-20 lg:px-8 lg:py-30">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div
              className={`screen-shift max-w-[40rem] ${
                isVisible ? "screen-shift-visible screen-shift-delay-1" : ""
              }`}
            >
              <p
                className={`screen-shift text-sm font-medium text-muted-foreground ${
                  isVisible ? "screen-shift-visible screen-shift-delay-1" : ""
                }`}
              >
                Pricing
              </p>
              <h2
                id="pricing-title"
                className={`screen-shift mt-2 text-[clamp(2.8rem,4.5vw,4.8rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance ${
                  isVisible ? "screen-shift-visible screen-shift-delay-2" : ""
                }`}
              >
                <span className="block">Start free.</span>
                <span className="block">Upgrade anytime.</span>
              </h2>
              <p
                className={`screen-shift mt-4 max-w-[34rem] text-lg leading-relaxed text-muted-foreground ${
                  isVisible ? "screen-shift-visible screen-shift-delay-3" : ""
                }`}
              >
                The free tier proves the voice fit. Paid plans unlock Telegram
                imports, more modes, unlimited drafts, and collaborative review.
              </p>
            </div>

            <div
              className={`screen-shift ${
                isVisible ? "screen-shift-visible screen-shift-delay-2" : ""
              }`}
            >
              <Tabs
                value={billingCycle}
                onValueChange={(value) =>
                  setBillingCycle(value as BillingCycle)
                }
              >
                <TabsList
                  aria-label="Billing cycle"
                  className="h-[52px] rounded-[20px] bg-white p-[4px] shadow-[0_14px_36px_rgba(29,30,34,0.06)]"
                >
                  <TabsTrigger
                    value="monthly"
                    className="h-full min-w-[7.25rem] rounded-[10px] px-6 text-[1rem] font-medium text-foreground/48 hover:text-foreground/72 data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-none"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="h-full min-w-[7.25rem] rounded-[10px] px-6 text-[1rem] font-medium text-foreground/48 hover:text-foreground/72 data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-none"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 overscroll-x-contain sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {planCatalog[billingCycle].map((plan, index) => (
              <div
                key={plan.name}
                className={`screen-shift ${
                  isVisible
                    ? `screen-shift-visible ${index === 0 ? "screen-shift-delay-2" : index === 1 ? "screen-shift-delay-3" : "screen-shift-delay-4"}`
                    : ""
                } shrink-0 snap-center basis-[calc(100vw-2rem)] sm:basis-[calc(100vw-2.5rem)] lg:min-w-0 lg:basis-auto`}
              >
              <article
                data-magnetic-proximity
                className={`flex min-h-[calc(100svh-20rem)] flex-col rounded-[24px] p-6 shadow-[0_20px_60px_rgba(29,30,34,0.05)] sm:p-7 lg:min-h-[30rem] lg:p-8 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/84 text-foreground"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-sm ${
                        plan.featured
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <p className="mt-3 text-[2.8rem] leading-none font-medium tracking-[-0.04em]">
                      {plan.price}
                    </p>
                    <p
                      className={`mt-2 text-sm ${
                        plan.featured
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.note}
                    </p>
                  </div>

                  {plan.featured ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/12 px-3 py-1 text-xs font-medium text-primary-foreground/80">
                      <CrownIcon aria-hidden="true" className="size-3.5" />
                      Most wanted
                    </span>
                  ) : null}
                </div>

                <p
                  className={`mt-6 text-sm leading-relaxed ${
                    plan.featured
                      ? "text-primary-foreground/78"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-8 flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckIcon
                        aria-hidden="true"
                        className={`mt-0.5 size-4 shrink-0 ${
                          plan.featured
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      />
                      <p
                        className={`text-sm leading-relaxed ${
                          plan.featured
                            ? "text-primary-foreground/82"
                            : "text-foreground/78"
                        }`}
                      >
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant={plan.featured ? "outline" : "default"}
                  size="lg"
                  className={plan.featured ? "mt-10" : "mt-10"}
                  onClick={() => onNavigate(plan.action)}
                >
                  {plan.cta}
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Button>
              </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FooterSection({
  onNavigate,
}: {
  onNavigate: (href: string) => void
}) {
  const { isVisible, ref } = useSectionVisible(0.35)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.includes("@")) {
      setError("Add a working email to continue.")
      return
    }

    setError("")
    setSubmitted(true)
  }

  return (
    <section
      ref={ref}
      id="footer-cta"
      aria-labelledby="footer-title"
      className="flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col justify-center px-4 pt-24 pb-4 sm:px-5 sm:pt-40 sm:pb-20 lg:px-8 lg:py-28">
        <div className="grid min-h-0 gap-8 lg:grid-cols-[minmax(20rem,0.76fr)_minmax(32rem,1.24fr)] lg:items-center lg:gap-12">
          <div
            className={`screen-shift flex h-full items-center ${
              isVisible ? "screen-shift-visible screen-shift-delay-1" : ""
            }`}
          >
            <div className="w-full max-w-[32rem]">
              <h2
                id="footer-title"
                className={`screen-shift max-w-[10ch] text-[clamp(3.25rem,4.7vw,5.25rem)] leading-[0.94] font-medium tracking-[-0.04em] text-balance ${
                  isVisible ? "screen-shift-visible screen-shift-delay-2" : ""
                }`}
              >
                Build a writing system that sounds like you.
              </h2>

              <div
                className={`screen-shift mt-8 ${
                  isVisible ? "screen-shift-visible screen-shift-delay-4" : ""
                }`}
              >
                {submitted ? (
                  <div className="max-w-[31rem] rounded-[20px] border border-white/14 bg-white/[0.035] p-5 sm:p-6">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/72">
                      <CheckIcon aria-hidden="true" className="size-4" />
                      Request captured
                    </span>
                    <h3 className="mt-3 text-[clamp(1.8rem,2.6vw,2.35rem)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
                      You’re on the list.
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-primary-foreground/68">
                      We saved <span className="text-primary-foreground">{email}</span> and will send early access details when the next release opens.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="mt-5 border-white/24 bg-transparent text-primary-foreground hover:bg-white hover:text-primary"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit another email
                    </Button>
                  </div>
                ) : (
                  <form className="max-w-[31rem] rounded-[20px] border border-white/14 bg-white/[0.035] p-5 sm:p-6" onSubmit={handleSubmit}>
                    <h3 className="text-[clamp(1.8rem,2.6vw,2.35rem)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
                      Get early access
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-primary-foreground/68">
                      Join the early group for voice profiles, Telegram imports, and assisted replies.
                    </p>

                    <FieldGroup className="mt-5">
                      <Field data-invalid={Boolean(error)}>
                        <FieldLabel className="text-primary-foreground" htmlFor="waitlist-email">Work email</FieldLabel>
                        <Input
                          id="waitlist-email"
                          name="waitlistEmail"
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setError("")
                          }}
                          aria-invalid={Boolean(error)}
                          placeholder="you@company.com"
                          className="border-white/18 bg-white/[0.07] text-primary-foreground placeholder:text-primary-foreground/42 focus-visible:border-white/48"
                        />
                        <FieldDescription className="text-primary-foreground/54">
                          We’ll only use it to send access updates.
                        </FieldDescription>
                        <FieldError className="text-primary-foreground">{error}</FieldError>
                      </Field>
                    </FieldGroup>

                    <Button type="submit" size="lg" variant="secondary" className="mt-5">
                      Join early access
                      <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                    </Button>
                  </form>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigate("#main-content")}
                aria-label="Back to first screen"
                className={`screen-shift mt-8 inline-flex size-16 items-center justify-center rounded-full border border-white/30 bg-white/[0.03] text-primary-foreground transition-[transform,border-color,background-color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.06] ${
                  isVisible ? "screen-shift-visible screen-shift-delay-5" : ""
                }`}
              >
                <ArrowUpIcon aria-hidden="true" strokeWidth={1.7} className="size-7" />
              </button>
            </div>
          </div>

          <div aria-hidden="true" className="relative hidden min-h-[36rem] items-center justify-center overflow-visible lg:flex">
            <div className="absolute inset-x-[14%] top-1/2 h-[62%] -translate-y-1/2 rounded-full bg-white/[0.05] blur-3xl" />
            <img
              src="/voxform-phone.png"
              alt=""
              className={`relative h-[min(72vh,48rem)] w-auto max-w-none object-contain transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-90"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
