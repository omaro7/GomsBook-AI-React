export type ChatMessageRole =
  | "user"
  | "assistant"
  | "system"
  | "tool"

export interface ChatMessage {

  id: string

  runId: string | null

  role: ChatMessageRole

  content: string

  createdAt: string
}