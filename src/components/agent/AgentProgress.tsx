import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Settings2,
  XCircle
} from "lucide-react"

import {
  ApprovalCard
} from "@/components/agent/ApprovalCard"

import {
  useAgentStore
} from "@/stores/agentStore"

import type {
  ToolCall
} from "@/models/ToolCall"

export function AgentProgress() {

  const toolCalls =
    useAgentStore(
      state =>
        state.toolCalls
    )

  const approvals =
    useAgentStore(
      state =>
        state.approvals
    )

  const error =
    useAgentStore(
      state =>
        state.error
    )

  const hasToolCalls =
    toolCalls.length > 0

  const hasApprovals =
    approvals.length > 0

  const hasError =
    Boolean(
      error
    )

  const hasContent =
    hasToolCalls ||
    hasApprovals ||
    hasError

  if (!hasContent) {

    return null
  }

  return (
    <div
      className="
        shrink-0
        border-t
        border-border/80
        bg-[var(--goms-surface-subtle)]
        px-5
        py-4
        max-sm:px-3
        max-sm:py-3
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
        "
      >
        {
          hasToolCalls && (
            <section
              className="
                rounded-[var(--goms-radius-lg)]
                border
                border-border
                bg-card
                p-4
                shadow-[var(--goms-shadow-xs)]
              "
            >
              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-[var(--goms-radius-sm)]
                      bg-[var(--goms-primary-soft)]
                      text-primary
                    "
                  >
                    <Settings2
                      className="
                        size-4
                      "
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm
                        font-bold
                        text-foreground
                      "
                    >
                      Tool 실행
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        text-muted-foreground
                      "
                    >
                      Agent 작업 진행 상태
                    </p>
                  </div>
                </div>

                <span
                  className="
                    rounded-[var(--goms-radius-round)]
                    bg-[var(--goms-primary-soft)]
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-primary
                  "
                >
                  {
                    toolCalls.length
                  }개
                </span>
              </div>


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
                      <ToolCallItem
                        key={
                          toolCall.toolCallId
                        }
                        toolCall={
                          toolCall
                        }
                      />
                    )
                  )
                }
              </div>
            </section>
          )
        }


        {
          hasApprovals && (
            <section
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
                      key={
                        approval.approvalId
                      }
                      approval={
                        approval
                      }
                    />
                  )
                )
              }
            </section>
          )
        }


        {
          hasError && (
            <div
              className="
                flex
                items-start
                gap-3
                rounded-[var(--goms-radius-md)]
                border
                border-destructive/20
                bg-destructive/5
                px-4
                py-3
                text-left
              "
              role="alert"
            >
              <CircleAlert
                className="
                  mt-0.5
                  size-4
                  shrink-0
                  text-destructive
                "
              />

              <div
                className="
                  min-w-0
                "
              >
                <div
                  className="
                    text-xs
                    font-bold
                    text-destructive
                  "
                >
                  Agent 오류
                </div>

                <div
                  className="
                    mt-1
                    break-words
                    text-xs
                    leading-5
                    text-destructive
                  "
                >
                  {
                    error
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}


interface ToolCallItemProps {
  toolCall: ToolCall
}


function ToolCallItem({
  toolCall
}: ToolCallItemProps) {

  const status =
    toolCall.status

  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-[var(--goms-radius-md)]
        border
        border-border
        bg-[var(--goms-surface-subtle)]
        px-3
        py-3
      "
    >
      <div
        className={`
          flex
          size-8
          shrink-0
          items-center
          justify-center
          rounded-[var(--goms-radius-sm)]
          ${getToolStatusIconContainerClassName(
            status
          )}
        `}
      >
        {
          getToolStatusIcon(
            status
          )
        }
      </div>


      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              truncate
              font-mono
              text-xs
              font-semibold
              text-foreground
            "
            title={
              toolCall.toolName
            }
          >
            {
              toolCall.toolName
            }
          </span>

          <span
            className={`
              shrink-0
              rounded-[var(--goms-radius-round)]
              px-2
              py-0.5
              text-[10px]
              font-bold
              ${getToolStatusBadgeClassName(
                status
              )}
            `}
          >
            {
              getToolStatusText(
                status
              )
            }
          </span>
        </div>


        {
          toolCall.error && (
            <div
              className="
                mt-2
                break-words
                rounded-[var(--goms-radius-sm)]
                bg-destructive/5
                px-3
                py-2
                text-xs
                leading-5
                text-destructive
              "
            >
              {
                toolCall.error
              }
            </div>
          )
        }
      </div>
    </div>
  )
}


function getToolStatusText(
  status: ToolCall["status"]
): string {

  switch (
    status
  ) {

    case "RUNNING":
      return "실행 중"

    case "SUCCESS":
      return "완료"

    case "ERROR":
      return "실패"

    default:
      return "대기"
  }
}


function getToolStatusIcon(
  status: ToolCall["status"]
) {

  switch (
    status
  ) {

    case "RUNNING":
      return (
        <LoaderCircle
          className="
            size-4
            animate-spin
          "
        />
      )

    case "SUCCESS":
      return (
        <CheckCircle2
          className="
            size-4
          "
        />
      )

    case "ERROR":
      return (
        <XCircle
          className="
            size-4
          "
        />
      )

    default:
      return (
        <Settings2
          className="
            size-4
          "
        />
      )
  }
}


function getToolStatusIconContainerClassName(
  status: ToolCall["status"]
): string {

  switch (
    status
  ) {

    case "RUNNING":
      return `
        bg-[var(--goms-primary-soft)]
        text-primary
      `

    case "SUCCESS":
      return `
        bg-[var(--goms-success-soft)]
        text-[var(--goms-success)]
      `

    case "ERROR":
      return `
        bg-[var(--goms-danger-soft)]
        text-destructive
      `

    default:
      return `
        bg-muted
        text-muted-foreground
      `
  }
}


function getToolStatusBadgeClassName(
  status: ToolCall["status"]
): string {

  switch (
    status
  ) {

    case "RUNNING":
      return `
        bg-[var(--goms-primary-soft)]
        text-primary
      `

    case "SUCCESS":
      return `
        bg-[var(--goms-success-soft)]
        text-[var(--goms-success)]
      `

    case "ERROR":
      return `
        bg-[var(--goms-danger-soft)]
        text-destructive
      `

    default:
      return `
        bg-muted
        text-muted-foreground
      `
  }
}