import Image from "next/image"

import { cn } from "@/lib/utils"

export function YoumanizeMark({
  className,
  inverse = false,
}: {
  className?: string
  inverse?: boolean
}) {
  return (
    <Image
      src="/youmanize-mark.svg"
      alt=""
      aria-hidden="true"
      width={48}
      height={48}
      className={cn("size-5", inverse && "invert", className)}
    />
  )
}

export function BrandLockup({
  className,
  markClassName,
  compact = false,
  inverse = false,
}: {
  className?: string
  markClassName?: string
  compact?: boolean
  inverse?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          inverse
            ? "bg-primary-foreground"
            : "bg-primary text-primary-foreground",
          compact ? "size-8 rounded-[10px]" : "size-10 rounded-[13px]",
          markClassName
        )}
      >
        <YoumanizeMark
          inverse={!inverse}
          className={compact ? "size-4.5" : "size-5"}
        />
      </span>
      <span className="font-semibold tracking-[-0.035em]">Youmanize</span>
    </span>
  )
}
