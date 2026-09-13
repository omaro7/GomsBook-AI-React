import {
  LoaderCircle
} from "lucide-react"

import {
  ChatInput
} from "@/components/chat/ChatInput"

import {
  ChatMessageList
} from "@/components/chat/ChatMessageList"

import {
  AgentProgress
} from "@/components/agent/AgentProgress"

import {
  RagContextPanel
} from "@/components/agent/RagContextPanel"

import {
  useAgentStore
} from "@/stores/agentStore"

import {
  CurrentProjectBadge
} from "@/components/project/CurrentProjectBadge"

export function ChatPanel() {

  const running =
    useAgentStore(
      state => state.running
    )

  const status =
    useAgentStore(
      state => state.status
    )

  const streamConnected =
    useAgentStore(
      state => state.streamConnected
    )

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        min-w-0
        w-full
        flex-col
        bg-transparent
      "
    >
      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          gap-4
          border-b
          border-border/80
          bg-[var(--goms-surface-subtle)]
          px-5
          py-3
          max-sm:items-start
          max-sm:px-4
        "
      >
        <div
          className="
            min-w-0
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <h2
              className="
                shrink-0
                text-sm
                font-bold
                tracking-[-0.02em]
                text-foreground
              "
            >
              GomsBook AI
            </h2>

            <CurrentProjectBadge />
          </div>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            EPUB 제작 · 검증 · 접근성 · AI Agent
          </p>
        </div>


        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            rounded-[var(--goms-radius-round)]
            border
            border-border
            bg-card
            px-3
            py-1.5
            text-xs
            font-medium
            text-muted-foreground
            shadow-[var(--goms-shadow-xs)]
            max-sm:px-2
          "
        >
          {
            running && (
              <LoaderCircle
                className="
                  size-3.5
                  shrink-0
                  animate-spin
                  text-primary
                "
              />
            )
          }

          <span
            className={getStatusClassName(
              status
            )}
          >
            {
              getStatusText(
                status
              )
            }
          </span>

          <span
            className="
              text-border
            "
            aria-hidden="true"
          >
            |
          </span>

          <span
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <span
              className={`
                size-1.5
                shrink-0
                rounded-full
                ${
                  streamConnected
                    ? "bg-[var(--goms-success)]"
                    : running
                      ? "bg-[var(--goms-warning)]"
                      : "bg-[var(--goms-text-disabled)]"
                }
              `}
            />

            <span>
              {
                streamConnected
                  ? "SSE 연결됨"
                  : running
                    ? "SSE 연결 대기"
                    : "대기"
              }
            </span>
          </span>
        </div>
      </div>


      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
        "
      >
        <ChatMessageList />

        <RagContextPanel />

        <AgentProgress />
      </div>


      <div
        className="
          shrink-0
        "
      >
        <ChatInput />
      </div>
    </div>
  )
}


function getStatusText(
  status: string
): string {

  switch (
    status
  ) {

    case "RUNNING":
      return "실행 중"

    case "WAITING_APPROVAL":
      return "승인 대기"

    case "COMPLETED":
      return "완료"

    case "FAILED":
      return "실행 실패"

    case "IDLE":
    default:
      return "준비됨"
  }
}


function getStatusClassName(
  status: string
): string {

  switch (
    status
  ) {

    case "RUNNING":
      return "font-semibold text-primary"

    case "WAITING_APPROVAL":
      return "font-semibold text-[var(--goms-warning)]"

    case "COMPLETED":
      return "font-semibold text-[var(--goms-success)]"

    case "FAILED":
      return "font-semibold text-destructive"

    case "IDLE":
    default:
      return "font-medium text-muted-foreground"
  }
}