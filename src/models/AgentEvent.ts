export type AgentEventType =
  | "AGENT_STARTED"
  | "ASSISTANT_MESSAGE"
  | "RAG_STARTED"
  | "RAG_CONTEXT"
  | "RAG_COMPLETED"
  | "TOOL_STARTED"
  | "TOOL_COMPLETED"
  | "TOOL_FAILED"
  | "APPROVAL_REQUIRED"
  | "APPROVAL_APPROVED"
  | "APPROVAL_REJECTED"
  | "APPROVAL_EXPIRED"
  | "AGENT_COMPLETED"
  | "AGENT_FAILED"

export interface AgentEvent<T = unknown> {

  runId: string

  type: AgentEventType

  message?: string | null

  content?: string | null

  toolCallId?: string | null

  toolName?: string | null

  data?: T | null

  approvalId?: string | null

  title?: string | null

  fileName?: string | null

  text?: string | null

  sourcePath?: string | null

  score?: number | null

  timestamp?: string
}