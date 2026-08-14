import {
  BotIcon,
  FileTextIcon,
  FingerprintIcon,
  MailIcon,
  MessageSquareTextIcon,
  MicIcon,
  ScanTextIcon,
  SendIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const paths = {
  writingToAnalysis: "M209 172 C244 172 240 99 274 99",
  voiceToAnalysis: "M209 286 C260 286 232 158 274 121",
  analysisToProfile: "M360 146 L360 312",
  profileToMessage: "M447 359 C496 359 489 88 540 88",
  profileToChatbot: "M447 359 C492 359 493 182 540 182",
  profileToEmail: "M447 359 C490 359 493 276 540 276",
  profileToReply: "M447 359 C490 359 494 369 540 369",
}

const compactPaths = {
  writingToAnalysis: "M90 65 C112 76 145 82 180 95",
  voiceToAnalysis: "M270 65 C248 76 215 82 180 95",
  analysisToProfile: "M180 155 L180 185",
  profileToMessage: "M180 245 C145 250 126 269 90 280",
  profileToChatbot: "M180 245 C215 250 234 269 270 280",
  profileToEmail: "M180 245 C122 253 25 294 25 340 L90 340",
  profileToReply: "M180 245 C238 253 335 294 335 340 L270 340",
}

function FlowNode({
  className,
  icon: Icon,
  label,
  detail,
  inverted = false,
}: {
  className: string
  icon: typeof FileTextIcon
  label: string
  detail?: string
  inverted?: boolean
}) {
  return (
    <div
      className={cn(
        "absolute flex min-w-0 items-center gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_4px_8px_rgba(29,30,34,0.08)]",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-foreground">
        <Icon aria-hidden="true" strokeWidth={1.6} className="size-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{label}</span>
        {detail ? (
          <span
            className={cn(
              "mt-0.5 block truncate text-xs",
              inverted ? "text-primary-foreground/68" : "text-muted-foreground"
            )}
          >
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function FlowParticle({
  path,
  delay,
  duration,
}: {
  path: string
  delay: string
  duration: string
}) {
  return (
    <g data-flow-particle opacity="0" className="text-foreground">
      <circle r="4.25" fill="currentColor" stroke="white" strokeWidth="2" />
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        begin={delay}
        dur="0.01s"
        fill="freeze"
      />
      <animateMotion
        path={path}
        begin={delay}
        dur={duration}
        repeatCount="indefinite"
      />
    </g>
  )
}

function CompactFlowNode({
  className,
  icon: Icon,
  label,
  detail,
  inverted = false,
}: {
  className: string
  icon: typeof FileTextIcon
  label: string
  detail?: string
  inverted?: boolean
}) {
  return (
    <div
      className={cn(
        "absolute flex min-w-0 items-center gap-1.5 rounded-[12px] bg-white px-2.5 py-2 shadow-[0_4px_8px_rgba(29,30,34,0.08)]",
        className
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-background text-foreground">
        <Icon aria-hidden="true" strokeWidth={1.6} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.78rem] leading-tight font-medium">
          {label}
        </span>
        {detail ? (
          <span
            className={cn(
              "mt-0.5 block truncate text-[0.66rem] leading-tight",
              inverted ? "text-primary-foreground/68" : "text-muted-foreground"
            )}
          >
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  )
}

export function VoiceFlowDiagram({ isActive }: { isActive: boolean }) {
  return (
    <div
      role="img"
      aria-label="Writing samples and voice messages move through voice analysis into a reusable voice profile, which creates messages, chatbot conversations, emails, and replies."
      className="screen-shift screen-shift-visible screen-shift-delay-4 relative mx-auto w-full"
    >
      <figure
        aria-hidden="true"
        className="hero-mobile-flow relative mx-auto aspect-[360/430] w-full max-w-[19rem] sm:max-w-[27rem] lg:hidden"
      >
        <svg
          viewBox="0 0 360 430"
          className="absolute inset-0 size-full overflow-visible"
        >
          {Object.values(compactPaths).map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="text-foreground/24"
            />
          ))}

          {isActive ? (
            <>
              <FlowParticle
                path={compactPaths.writingToAnalysis}
                delay="0s"
                duration="2s"
              />
              <FlowParticle
                path={compactPaths.voiceToAnalysis}
                delay="0.45s"
                duration="2s"
              />
              <FlowParticle
                path={compactPaths.analysisToProfile}
                delay="0.85s"
                duration="1.35s"
              />
              <FlowParticle
                path={compactPaths.profileToMessage}
                delay="1.2s"
                duration="2.1s"
              />
              <FlowParticle
                path={compactPaths.profileToChatbot}
                delay="1.55s"
                duration="2.1s"
              />
              <FlowParticle
                path={compactPaths.profileToEmail}
                delay="1.9s"
                duration="2.5s"
              />
              <FlowParticle
                path={compactPaths.profileToReply}
                delay="2.25s"
                duration="2.5s"
              />
            </>
          ) : null}
        </svg>

        <CompactFlowNode
          className="top-[1%] left-[2%] h-[14%] w-[46%]"
          icon={FileTextIcon}
          label="Your writing"
          detail="Samples & files"
        />
        <CompactFlowNode
          className="top-[1%] right-[2%] h-[14%] w-[46%]"
          icon={MicIcon}
          label="Voice message"
          detail="Upload & clone"
        />
        <CompactFlowNode
          className="top-[22%] left-[20%] h-[14%] w-[60%]"
          icon={ScanTextIcon}
          label="Voice analysis"
          detail="Tone & rhythm"
        />
        <CompactFlowNode
          className="top-[43%] left-[20%] h-[14%] w-[60%] bg-primary text-primary-foreground"
          icon={FingerprintIcon}
          label="Voice profile"
          detail="Reusable baseline"
          inverted
        />
        <CompactFlowNode
          className="top-[65%] left-[2%] h-[12%] w-[46%]"
          icon={MessageSquareTextIcon}
          label="Messages"
        />
        <CompactFlowNode
          className="top-[65%] right-[2%] h-[12%] w-[46%]"
          icon={BotIcon}
          label="Chatbot"
        />
        <CompactFlowNode
          className="top-[79%] left-[2%] h-[12%] w-[46%]"
          icon={MailIcon}
          label="Emails"
        />
        <CompactFlowNode
          className="top-[79%] right-[2%] h-[12%] w-[46%]"
          icon={SendIcon}
          label="Replies"
        />

        <figcaption className="absolute inset-x-0 bottom-[1%] text-center text-xs text-muted-foreground">
          One voice, adapted to every format
        </figcaption>
      </figure>

      <figure
        aria-hidden="true"
        className="relative mx-auto hidden aspect-[720/520] w-full max-w-[46rem] lg:block"
      >
        <svg
          viewBox="0 0 720 520"
          className="absolute inset-0 size-full overflow-visible"
        >
          {Object.values(paths).map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="text-foreground/24"
            />
          ))}

          {isActive ? (
            <>
              <FlowParticle
                path={paths.writingToAnalysis}
                delay="0s"
                duration="2.5s"
              />
              <FlowParticle
                path={paths.voiceToAnalysis}
                delay="0.6s"
                duration="2.7s"
              />
              <FlowParticle
                path={paths.analysisToProfile}
                delay="0.35s"
                duration="2.1s"
              />
              <FlowParticle
                path={paths.profileToMessage}
                delay="0.8s"
                duration="3.2s"
              />
              <FlowParticle
                path={paths.profileToChatbot}
                delay="1.4s"
                duration="3s"
              />
              <FlowParticle
                path={paths.profileToEmail}
                delay="2s"
                duration="2.8s"
              />
              <FlowParticle
                path={paths.profileToReply}
                delay="2.6s"
                duration="3s"
              />
            </>
          ) : null}
        </svg>

        <FlowNode
          className="top-[24%] left-[4%] h-[18%] w-[25%]"
          icon={FileTextIcon}
          label="Your writing"
          detail="Samples & files"
        />
        <FlowNode
          className="top-[46%] left-[4%] h-[18%] w-[25%]"
          icon={MicIcon}
          label="Voice message"
          detail="Upload & clone"
        />
        <FlowNode
          className="top-[10%] left-[38%] h-[18%] w-[24%]"
          icon={ScanTextIcon}
          label="Voice analysis"
          detail="Tone & rhythm"
        />
        <FlowNode
          className="top-[60%] left-[38%] h-[18%] w-[24%] bg-primary text-primary-foreground"
          icon={FingerprintIcon}
          label="Voice profile"
          detail="Reusable baseline"
          inverted
        />
        <FlowNode
          className="top-[10%] left-[75%] h-[14%] w-[21%]"
          icon={MessageSquareTextIcon}
          label="Messages"
        />
        <FlowNode
          className="top-[28%] left-[75%] h-[14%] w-[21%]"
          icon={BotIcon}
          label="Chatbot"
        />
        <FlowNode
          className="top-[46%] left-[75%] h-[14%] w-[21%]"
          icon={MailIcon}
          label="Emails"
        />
        <FlowNode
          className="top-[64%] left-[75%] h-[14%] w-[21%]"
          icon={SendIcon}
          label="Replies"
        />

        <figcaption className="absolute right-[4%] bottom-[1%] text-xs text-muted-foreground">
          One voice, adapted to every format
        </figcaption>
      </figure>
    </div>
  )
}
