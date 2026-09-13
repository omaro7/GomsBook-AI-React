import {
  useState
} from "react"

import {
  Check,
  FileText,
  LoaderCircle,
  ShieldAlert,
  Wrench,
  X
} from "lucide-react"

import {
  Button
} from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import type {
  ApprovalRequest
} from "@/models/Approval"

import {
  approveAgentApproval,
  rejectAgentApproval
} from "@/api/approvalApi"

import {
  useAgentStore
} from "@/stores/agentStore"

interface ApprovalCardProps {
  approval: ApprovalRequest
}

type ApprovalAction =
  | "APPROVE"
  | "REJECT"
  | null

export function ApprovalCard({
  approval
}: ApprovalCardProps) {

  const [
    processing,
    setProcessing
  ] = useState<ApprovalAction>(
    null
  )

  const [
    error,
    setError
  ] = useState<string | null>(
    null
  )

  const pending =
    useAgentStore(
      state =>
        state.approvals.some(
          item =>
            item.approvalId ===
            approval.approvalId
        )
    )

  async function handleApprove() {

    if (
      processing ||
      !pending
    ) {

      return
    }

    setProcessing(
      "APPROVE"
    )

    setError(
      null
    )

    try {

      await approveAgentApproval(
        approval.runId,
        approval.approvalId
      )

    } catch (
      exception
    ) {

      setProcessing(
        null
      )

      setError(
        getErrorMessage(
          exception
        )
      )
    }
  }

  async function handleReject() {

    if (
      processing ||
      !pending
    ) {

      return
    }

    setProcessing(
      "REJECT"
    )

    setError(
      null
    )

    try {

      await rejectAgentApproval(
        approval.runId,
        approval.approvalId
      )

    } catch (
      exception
    ) {

      setProcessing(
        null
      )

      setError(
        getErrorMessage(
          exception
        )
      )
    }
  }

  return (
    <Card
      className="
        overflow-hidden
        rounded-[var(--goms-radius-lg)]
        border
        border-[color-mix(in_srgb,var(--goms-warning)_35%,var(--goms-border))]
        bg-card
        shadow-[var(--goms-shadow-sm)]
      "
    >
      <CardHeader
        className="
          border-b
          border-border/80
          bg-[var(--goms-warning-soft)]
          px-4
          py-4
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              size-9
              shrink-0
              items-center
              justify-center
              rounded-[var(--goms-radius-sm)]
              bg-[var(--goms-warning-soft)]
              text-[var(--goms-warning)]
            "
          >
            <ShieldAlert
              className="
                size-5
              "
            />
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                mb-1
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <CardTitle
                className="
                  text-sm
                  font-bold
                  leading-5
                  text-foreground
                "
              >
                {
                  approval.title ||
                  "사용자 승인이 필요합니다."
                }
              </CardTitle>

              {
                pending && (
                  <span
                    className="
                      shrink-0
                      rounded-[var(--goms-radius-round)]
                      bg-[var(--goms-warning-soft)]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[var(--goms-warning)]
                    "
                  >
                    승인 대기
                  </span>
                )
              }
            </div>

            <p
              className="
                text-xs
                leading-5
                text-muted-foreground
              "
            >
              실제 EPUB 파일에 변경사항을 반영하기 전에 확인이 필요합니다.
            </p>
          </div>
        </div>
      </CardHeader>


      <CardContent
        className="
          flex
          flex-col
          gap-4
          px-4
          py-4
        "
      >
        <div
          className="
            rounded-[var(--goms-radius-md)]
            border
            border-border
            bg-[var(--goms-warning-soft)]
            px-4
            py-3
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-[var(--goms-text-secondary)]
            "
          >
            {
              approval.message ||
              "Agent 작업을 승인하시겠습니까?"
            }
          </p>
        </div>


        {
          (
            approval.toolName ||
            approval.fileName
          ) && (
            <div
              className="
                grid
                gap-2
              "
            >
              {
                approval.toolName && (
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
                    <Wrench
                      className="
                        mt-0.5
                        size-4
                        shrink-0
                        text-primary
                      "
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.06em]
                          text-muted-foreground
                        "
                      >
                        Tool
                      </div>

                      <div
                        className="
                          mt-1
                          break-all
                          font-mono
                          text-xs
                          font-semibold
                          text-foreground
                        "
                      >
                        {
                          approval.toolName
                        }
                      </div>
                    </div>
                  </div>
                )
              }


              {
                approval.fileName && (
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
                    <FileText
                      className="
                        mt-0.5
                        size-4
                        shrink-0
                        text-primary
                      "
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.06em]
                          text-muted-foreground
                        "
                      >
                        File
                      </div>

                      <div
                        className="
                          mt-1
                          break-all
                          font-mono
                          text-xs
                          text-[var(--goms-text-secondary)]
                        "
                        title={
                          approval.fileName
                        }
                      >
                        {
                          approval.fileName
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )
        }


        {
          error && (
            <div
              className="
                rounded-[var(--goms-radius-md)]
                border
                border-destructive/20
                bg-destructive/5
                px-4
                py-3
                text-sm
                leading-6
                text-destructive
              "
              role="alert"
            >
              {
                error
              }
            </div>
          )
        }
      </CardContent>


      {
        pending && (
          <CardFooter
            className="
              flex
              justify-end
              gap-2
              border-t
              border-border/80
              bg-[var(--goms-surface-subtle)]
              px-4
              py-3
            "
          >
            <Button
              type="button"
              variant="outline"
              disabled={
                processing !== null
              }
              onClick={
                () =>
                  void handleReject()
              }
              className="
                min-w-24
                rounded-[var(--goms-radius-sm)]
                border-border
                bg-card
                text-muted-foreground
                shadow-none
                hover:border-destructive/30
                hover:bg-destructive/5
                hover:text-destructive
              "
            >
              {
                processing ===
                "REJECT"
                  ? (
                    <LoaderCircle
                      className="
                        size-4
                        animate-spin
                      "
                    />
                  )
                  : (
                    <X
                      className="
                        size-4
                      "
                    />
                  )
              }

              <span>
                {
                  processing ===
                  "REJECT"
                    ? "처리 중"
                    : "취소"
                }
              </span>
            </Button>


            <Button
              type="button"
              disabled={
                processing !== null
              }
              onClick={
                () =>
                  void handleApprove()
              }
              className="
                min-w-24
                rounded-[var(--goms-radius-sm)]
                bg-primary
                font-semibold
                text-primary-foreground
                shadow-[var(--goms-shadow-xs)]
                hover:bg-[var(--goms-primary-hover)]
                hover:shadow-[var(--goms-shadow-sm)]
              "
            >
              {
                processing ===
                "APPROVE"
                  ? (
                    <LoaderCircle
                      className="
                        size-4
                        animate-spin
                      "
                    />
                  )
                  : (
                    <Check
                      className="
                        size-4
                      "
                    />
                  )
              }

              <span>
                {
                  processing ===
                  "APPROVE"
                    ? "처리 중"
                    : "승인"
                }
              </span>
            </Button>
          </CardFooter>
        )
      }
    </Card>
  )
}


function getErrorMessage(
  exception: unknown
): string {

  if (
    exception instanceof Error
  ) {

    return exception.message
  }

  return "승인 처리 중 오류가 발생했습니다."
}