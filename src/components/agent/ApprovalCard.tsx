import {
  useState
} from "react"

import {
  Check,
  FileText,
  LoaderCircle,
  ShieldAlert,
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

    } catch (exception) {

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

    } catch (exception) {

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
        border-amber-300
        bg-amber-50/40
        dark:bg-amber-950/10
      "
    >
      <CardHeader>
        <CardTitle
          className="
            flex
            items-center
            gap-2
            text-base
          "
        >
          <ShieldAlert
            className="
              h-5
              w-5
            "
          />

          {
            approval.title ||
            "사용자 승인이 필요합니다."
          }
        </CardTitle>
      </CardHeader>

      <CardContent
        className="
          flex
          flex-col
          gap-3
        "
      >
        <p
          className="
            text-sm
            leading-6
          "
        >
          {
            approval.message ||
            "Agent 작업을 승인하시겠습니까?"
          }
        </p>

        {
          approval.toolName && (
            <div
              className="
                text-sm
                text-muted-foreground
              "
            >
              도구: {approval.toolName}
            </div>
          )
        }

        {
          approval.fileName && (
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                text-muted-foreground
              "
            >
              <FileText
                className="
                  h-4
                  w-4
                "
              />

              <span>
                {approval.fileName}
              </span>
            </div>
          )
        }

        {
          error && (
            <div
              className="
                text-sm
                text-destructive
              "
            >
              {error}
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
            >
              {
                processing ===
                "REJECT"
                  ? (
                    <LoaderCircle
                      className="
                        mr-2
                        h-4
                        w-4
                        animate-spin
                      "
                    />
                  )
                  : (
                    <X
                      className="
                        mr-2
                        h-4
                        w-4
                      "
                    />
                  )
              }

              취소
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
            >
              {
                processing ===
                "APPROVE"
                  ? (
                    <LoaderCircle
                      className="
                        mr-2
                        h-4
                        w-4
                        animate-spin
                      "
                    />
                  )
                  : (
                    <Check
                      className="
                        mr-2
                        h-4
                        w-4
                      "
                    />
                  )
              }

              승인
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