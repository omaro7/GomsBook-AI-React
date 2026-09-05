import type { AgentRunRequest } from "@/models/AgentRunRequest"
import type { AgentRunResponse } from "@/models/AgentRunResponse"

const AGENT_RUN_URL = "/api/agent/runs"

export async function runAgent(
  request: AgentRunRequest
): Promise<AgentRunResponse> {
  const normalizedRequest = normalizeRequest(request)

  const response = await fetch(AGENT_RUN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(normalizedRequest)
  })

  if (!response.ok) {
    throw new Error(
      await createApiErrorMessage(response)
    )
  }

  const result = await response.json() as AgentRunResponse

  if (!result.runId) {
    throw new Error(
      "Agent 실행 응답에 runId가 없습니다."
    )
  }

  return result
}

function normalizeRequest(
  request: AgentRunRequest
): AgentRunRequest {
  const projectId = request.projectId.trim()
  const conversationId = request.conversationId.trim()
  const message = request.message.trim()
  const agent = request.agent.trim()
  const model = request.model.trim()

  if (!projectId) {
    throw new Error(
      "현재 프로젝트가 선택되지 않았습니다."
    )
  }

  if (!message) {
    throw new Error(
      "Agent 실행 메시지가 비어 있습니다."
    )
  }

  if (!agent) {
    throw new Error(
      "Agent가 선택되지 않았습니다."
    )
  }

  if (!model) {
    throw new Error(
      "Model이 선택되지 않았습니다."
    )
  }

  return {
    projectId,
    conversationId,
    message,
    agent,
    model,
    ragEnabled: request.ragEnabled,
    mcpEnabled: request.mcpEnabled
  }
}

async function createApiErrorMessage(
  response: Response
): Promise<string> {
  const fallback =
    `Agent 실행 요청 실패: HTTP ${response.status}`

  try {
    const body = await response.json() as {
      message?: string
      error?: string
    }

    return (
      body.message ||
      body.error ||
      fallback
    )
  } catch {
    return fallback
  }
}