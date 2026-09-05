export interface AgentRunRequest {
  projectId: string
  conversationId: string
  message: string
  agent: string
  model: string
  ragEnabled: boolean
  mcpEnabled: boolean
}