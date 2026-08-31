export type AgentRunStatus =
  | "IDLE"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "EXPIRED"
  | "COMPLETED"
  | "FAILED"

export interface AgentRun {

  runId: string

  status: AgentRunStatus

  startedAt?: string

  completedAt?: string
}