export type ToolCallStatus =
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"

export interface ToolCall {

  toolCallId: string

  toolName: string

  status: ToolCallStatus

  arguments?: unknown

  result?: unknown

  error?: string
}