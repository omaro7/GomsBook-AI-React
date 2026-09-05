import {
  create
} from "zustand"

import type {
  AgentEvent
} from "@/models/AgentEvent"

import type {
  AgentRunStatus
} from "@/models/AgentRun"

import type {
  ApprovalRequest
} from "@/models/Approval"

import type {
  ToolCall
} from "@/models/ToolCall"

interface AgentState {

  runId: string | null

  status: AgentRunStatus

  running: boolean

  streamConnected: boolean

  toolCalls: ToolCall[]

  approvals: ApprovalRequest[]

  error: string | null

  startRun:
    (
      runId: string
    ) => void

  setStreamConnected:
    (
      connected: boolean
    ) => void

  handleEvent:
    (
      event: AgentEvent
    ) => void

  addToolCall:
    (
      toolCall: ToolCall
    ) => void

  updateToolCall:
    (
      toolCallId: string,
      patch: Partial<ToolCall>
    ) => void

  addApproval:
    (
      approval: ApprovalRequest
    ) => void

  removeApproval:
    (
      approvalId: string
    ) => void

  setError:
    (
      error: string | null
    ) => void

  completeRun:
    () => void

  failRun:
    (
      message?: string
    ) => void

  reset:
    () => void
}

const initialState = {

  runId:
    null,

  status:
    "IDLE" as AgentRunStatus,

  running:
    false,

  streamConnected:
    false,

  toolCalls:
    [] as ToolCall[],

  approvals:
    [] as ApprovalRequest[],

  error:
    null as string | null
}

export const useAgentStore =
  create<AgentState>(
    (
      set,
      get
    ) => ({

      ...initialState,

      startRun:
        runId => {

          set({
            runId,
            status:
              "RUNNING",
            running:
              true,
            streamConnected:
              false,
            toolCalls:
              [],
            approvals:
              [],
            error:
              null
          })
        },

      setStreamConnected:
        connected => {

          set({
            streamConnected:
              connected
          })
        },

      handleEvent:
        event => {

          switch (
            event.type
          ) {

            case "AGENT_STARTED": {

              set({
                status:
                  "RUNNING",

                running:
                  true,

                error:
                  null
              })

              break
            }

            case "TOOL_STARTED": {

              if (
                !event.toolCallId ||
                !event.toolName
              ) {
                break
              }

              get()
                .addToolCall({
                  toolCallId:
                    event.toolCallId,

                  toolName:
                    event.toolName,

                  status:
                    "RUNNING",

                  arguments:
                    event.data
                })

              break
            }

            case "TOOL_COMPLETED": {

              if (
                !event.toolCallId
              ) {
                break
              }

              get()
                .updateToolCall(
                  event.toolCallId,
                  {
                    status:
                      "SUCCESS",

                    result:
                      event.data,

                    error:
                      undefined
                  }
                )

              break
            }

            case "TOOL_FAILED": {

              if (
                !event.toolCallId
              ) {
                break
              }

              get()
                .updateToolCall(
                  event.toolCallId,
                  {
                    status:
                      "ERROR",

                    result:
                      event.data,

                    error:
                      event.message ||
                      "도구 실행에 실패했습니다."
                  }
                )

              break
            }

            case "APPROVAL_REQUIRED": {

              if (
                !event.runId ||
                !event.approvalId
              ) {

                set({
                  error:
                    "승인 요청에 runId 또는 approvalId가 없습니다."
                })

                break
              }

              get()
                .addApproval({
                  runId:
                    event.runId,

                  approvalId:
                    event.approvalId,

                  status:
                    "PENDING",

                  title:
                    event.title ??
                    undefined,

                  message:
                    event.message ??
                    undefined,

                  toolName:
                    event.toolName ??
                    undefined,

                  fileName:
                    event.fileName ??
                    undefined,

                  content:
                    event.content ??
                    undefined,

                  createdAt:
                    event.timestamp
                })

              set({
                status:
                  "WAITING_APPROVAL",

                running:
                  true
              })

              break
            }

            case "APPROVAL_APPROVED": {

              if (
                event.approvalId
              ) {

                get()
                  .removeApproval(
                    event.approvalId
                  )
              }

              const hasPendingApprovals =
                get()
                  .approvals
                  .length > 0

              set({
                status:
                  hasPendingApprovals
                    ? "WAITING_APPROVAL"
                    : "RUNNING",

                running:
                  true,

                error:
                  null
              })

              break
            }

            case "APPROVAL_REJECTED": {

              if (
                event.approvalId
              ) {

                get()
                  .removeApproval(
                    event.approvalId
                  )
              }

              const hasPendingApprovals =
                get()
                  .approvals
                  .length > 0

              set({
                status:
                  hasPendingApprovals
                    ? "WAITING_APPROVAL"
                    : "RUNNING",

                running:
                  true
              })

              break
            }

            case "APPROVAL_EXPIRED": {

              if (
                event.approvalId
              ) {

                get()
                  .removeApproval(
                    event.approvalId
                  )
              }

              set({
                status:
                  "EXPIRED",

                running:
                  false,

                error:
                  event.message ||
                  "승인 대기 시간이 만료되었습니다."
              })

              break
            }

            case "AGENT_COMPLETED": {

              const hasPendingApprovals =
                get()
                  .approvals
                  .length > 0

              if (
                hasPendingApprovals
              ) {

                set({
                  status:
                    "WAITING_APPROVAL",

                  running:
                    true,

                  error:
                    null
                })

                break
              }

              get()
                .completeRun()

              break
            }

            case "AGENT_FAILED": {

              get()
                .failRun(
                  event.message ||
                  undefined
                )

              break
            }

            default: {
              break
            }
          }
        },

      addToolCall:
        toolCall => {

          const exists =
            get()
              .toolCalls
              .some(
                item =>
                  item.toolCallId ===
                  toolCall.toolCallId
              )

          if (
            exists
          ) {
            return
          }

          set(
            state => ({
              toolCalls: [
                ...state.toolCalls,
                toolCall
              ]
            })
          )
        },

      updateToolCall:
        (
          toolCallId,
          patch
        ) => {

          set(
            state => ({
              toolCalls:
                state.toolCalls.map(
                  toolCall =>
                    toolCall.toolCallId ===
                    toolCallId
                      ? {
                          ...toolCall,
                          ...patch
                        }
                      : toolCall
                )
            })
          )
        },

      addApproval:
        approval => {

          const exists =
            get()
              .approvals
              .some(
                item =>
                  item.approvalId ===
                  approval.approvalId
              )

          if (
            exists
          ) {
            return
          }

          set(
            state => ({
              approvals: [
                ...state.approvals,
                approval
              ]
            })
          )
        },

      removeApproval:
        approvalId => {

          set(
            state => ({
              approvals:
                state.approvals.filter(
                  approval =>
                    approval.approvalId !==
                    approvalId
                )
            })
          )
        },

      setError:
        error => {

          set({
            error
          })
        },

      completeRun:
        () => {

          set({
            status:
              "COMPLETED",

            running:
              false,

            streamConnected:
              false,

            approvals:
              []
          })
        },

      failRun:
        message => {

          set({
            status:
              "FAILED",

            running:
              false,

            streamConnected:
              false,

            approvals:
              [],

            error:
              message ||
              "Agent 실행에 실패했습니다."
          })
        },

      reset:
        () => {

          set({
            ...initialState
          })
        }
    })
  )