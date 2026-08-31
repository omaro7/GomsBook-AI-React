export interface AgentRunRequest {
  message: string
  agent: string
  model: string
  ragEnabled: boolean
  mcpEnabled: boolean
}