import type {
  ChatAgentOption,
  ChatModelOption
} from "@/stores/chatConfigStore"

export interface ChatConfigResponse {
  defaultAgent: string
  defaultModel: string
  ragEnabled: boolean
  mcpEnabled: boolean
  agents: ChatAgentOption[]
  models: ChatModelOption[]
}

const CHAT_CONFIG_URL = "/api/agent/config"

export async function getChatConfig(): Promise<ChatConfigResponse> {
  const response = await fetch(CHAT_CONFIG_URL, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error(
      await createApiErrorMessage(response)
    )
  }

  const result: ChatConfigResponse =
    await response.json()

  validateChatConfig(result)

  return result
}

function validateChatConfig(
  config: ChatConfigResponse
): void {
  if (!config) {
    throw new Error(
      "Chat 설정 응답이 없습니다."
    )
  }

  if (
    !Array.isArray(config.agents) ||
    config.agents.length === 0
  ) {
    throw new Error(
      "사용 가능한 Agent가 없습니다."
    )
  }

  if (
    !Array.isArray(config.models) ||
    config.models.length === 0
  ) {
    throw new Error(
      "사용 가능한 Model이 없습니다."
    )
  }

  if (!config.defaultAgent) {
    throw new Error(
      "기본 Agent가 설정되지 않았습니다."
    )
  }

  if (!config.defaultModel) {
    throw new Error(
      "기본 Model이 설정되지 않았습니다."
    )
  }
}

async function createApiErrorMessage(
  response: Response
): Promise<string> {
  const fallback =
    `Chat 설정 조회 실패: HTTP ${response.status}`

  try {
    const body: {
      message?: string
      error?: string
    } = await response.json()

    return (
      body.message ??
      body.error ??
      fallback
    )
  } catch {
    return fallback
  }
}