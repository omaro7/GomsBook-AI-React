export interface AgentRunRequest {
  projectId: string
  message: string
  agent: string
  model: string
  ragEnabled: boolean
  mcpEnabled: boolean
}