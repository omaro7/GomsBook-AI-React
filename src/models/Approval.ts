export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"

export interface ApprovalRequest {

  runId: string

  approvalId: string

  status: ApprovalStatus

  title?: string

  message?: string

  toolName?: string

  fileName?: string

  content?: string

  createdAt?: string

  resolvedAt?: string
}