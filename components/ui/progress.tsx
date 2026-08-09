"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-3.5 w-full items-center overflow-hidden rounded-full border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,247,248,0.72))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(29,30,34,0.05)] backdrop-blur-sm",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "progress-indicator-glass relative h-full rounded-full bg-[linear-gradient(90deg,rgba(29,30,34,0.88),rgba(44,45,50,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] data-[status=indeterminate]:w-[32%] data-[status=indeterminate]:progress-indicator-indeterminate",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "absolute inset-y-0 right-3 z-10 inline-flex items-center text-[0.72rem] font-medium text-white mix-blend-screen tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
