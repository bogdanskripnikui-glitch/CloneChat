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
      <circle
        r="4.25"
        fill="currentColor"
        stroke="white"
        strokeWidth="2"
      />
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

export function VoiceFlowDiagram({ isActive }: { isActive: boolean }) {
  return (
    <figure
      aria-labelledby="voice-flow-title voice-flow-description"
      className="screen-shift screen-shift-visible screen-shift-delay-4 relative mx-auto aspect-[720/520] w-full max-w-[46rem]"
    >
      <figcaption className="sr-only">
        <span id="voice-flow-title">How Voxform learns your voice</span>
        <span id="voice-flow-description">
          Writing samples and voice messages are analyzed into a reusable voice
          profile, then used to create messages, chatbot conversations, emails,
          and replies.
        </span>
      </figcaption>

      <svg
        aria-hidden="true"
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

      <div className="absolute right-[4%] bottom-[1%] text-xs text-muted-foreground">
        One voice, adapted to every format
      </div>
    </figure>
  )
}
