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
        flex-col
        bg-background
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          px-4
          py-3
        "
      >
        <div>
          <h2
            className="
              text-base
              font-semibold
            "
          >
            GomsBook AI
          </h2>

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            EPUB 제작 및 검증 Agent
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-muted-foreground
          "
        >
          {
            running && (
              <LoaderCircle
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            )
          }

          <span>
            {getStatusText(status)}
          </span>

          <span>
            ·
          </span>

          <span>
            {
              streamConnected
                ? "SSE 연결됨"
                : running
                  ? "SSE 연결 대기"
                  : "대기"
            }
          </span>
        </div>
      </div>

      <ChatMessageList />

      <RagContextPanel />

      <AgentProgress />

      <ChatInput />

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