import {
  CheckCircle2,
  CircleX,
  LoaderCircle,
  ShieldAlert,
  Wrench
} from "lucide-react"

import {
  ApprovalCard
} from "@/components/agent/ApprovalCard"

import type {
  ToolCall
} from "@/models/ToolCall"

import {
  useAgentStore
} from "@/stores/agentStore"

export function AgentProgress() {

  const running =
    useAgentStore(
      state => state.running
    )

  const status =
    useAgentStore(
      state => state.status
    )

  const toolCalls =
    useAgentStore(
      state => state.toolCalls
    )

  const approvals =
    useAgentStore(
      state => state.approvals
    )

  const error =
    useAgentStore(
      state => state.error
    )

  const visible =
    running ||
    toolCalls.length > 0 ||
    approvals.length > 0 ||
    status === "FAILED"

  if (!visible) {
    return null
  }

  return (
    <div
      className="
        border-t
        bg-muted/20
        px-4
        py-3
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-5xl
          flex-col
          gap-3
        "
      >
        <AgentStatus
          status={status}
          approvalCount={approvals.length}
        />

        {
          approvals.length > 0 && (
            <div
              className="
                flex
                flex-col
                gap-3
              "
            >
              {
                approvals.map(
                  approval => (
                    <ApprovalCard
                      key={approval.approvalId}
                      approval={approval}
                    />
                  )
                )
              }
            </div>
          )
        }

        {
          toolCalls.length > 0 && (
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              {
                toolCalls.map(
                  toolCall => (
                    <ToolProgress
                      key={toolCall.toolCallId}
                      toolCall={toolCall}
                    />
                  )
                )
              }
            </div>
          )
        }

        {
          error && (
            <div
              className="
                flex
                items-start
                gap-2
                text-sm
                text-destructive
              "
            >
              <CircleX
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                "
              />

              <span>
                {error}
              </span>
            </div>
          )
        }
      </div>
    </div>
  )
}

interface AgentStatusProps {
  status: string
  approvalCount: number
}

function AgentStatus({
  status,
  approvalCount
}: AgentStatusProps) {

  if (
    status === "WAITING_APPROVAL"
  ) {

    return (
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-amber-600
        "
      >
        <ShieldAlert
          className="
            h-4
            w-4
          "
        />

        <span>
          사용자 승인을 기다리고 있습니다.
          {
            approvalCount > 1 &&
            ` (${approvalCount}건)`
          }
        </span>
      </div>
    )
  }

  if (
    status === "FAILED"
  ) {

    return (
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-destructive
        "
      >
        <CircleX
          className="
            h-4
            w-4
          "
        />

        <span>
          Agent 실행에 실패했습니다.
        </span>
      </div>
    )
  }

  if (
    status === "EXPIRED"
    ) {

    return (
        <div
        className="
            flex
            items-center
            gap-2
            text-sm
            text-amber-600
        "
        >
        <ShieldAlert
            className="
            h-4
            w-4
            "
        />

        <span>
            승인 대기 시간이 만료되었습니다.
        </span>
        </div>
    )
  }

  if (
    status === "COMPLETED"
  ) {

    return (
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
        "
      >
        <CheckCircle2
          className="
            h-4
            w-4
          "
        />

        <span>
          Agent 작업이 완료되었습니다.
        </span>
      </div>
    )
  }

  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-sm
        text-muted-foreground
      "
    >
      <LoaderCircle
        className="
          h-4
          w-4
          animate-spin
        "
      />

      <span>
        GomsBook AI가 작업을 진행하고 있습니다.
      </span>
    </div>
  )
}

interface ToolProgressProps {
  toolCall: ToolCall
}

function ToolProgress({
  toolCall
}: ToolProgressProps) {

  return (
    <div
      className="
        flex
        items-start
        gap-2
        rounded-md
        border
        bg-background
        px-3
        py-2
      "
    >
      <ToolStatusIcon
        status={toolCall.status}
      />

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Wrench
            className="
              h-3.5
              w-3.5
              text-muted-foreground
            "
          />

          <span
            className="
              truncate
              text-sm
              font-medium
            "
          >
            {toolCall.toolName}
          </span>
        </div>

        <div
          className="
            mt-1
            text-xs
            text-muted-foreground
          "
        >
          {getToolStatusText(toolCall)}
        </div>
      </div>
    </div>
  )
}

function ToolStatusIcon({
  status
}: {
  status: ToolCall["status"]
}) {

  switch (status) {

    case "RUNNING":
      return (
        <LoaderCircle
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
            animate-spin
          "
        />
      )

    case "SUCCESS":
      return (
        <CheckCircle2
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
          "
        />
      )

    case "ERROR":
      return (
        <CircleX
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
            text-destructive
          "
        />
      )
  }
}

function getToolStatusText(
  toolCall: ToolCall
): string {

  switch (toolCall.status) {

    case "RUNNING":
      return "도구를 실행하고 있습니다."

    case "SUCCESS":
      return "도구 실행이 완료되었습니다."

    case "ERROR":
      return (
        toolCall.error ||
        "도구 실행에 실패했습니다."
      )
  }
}