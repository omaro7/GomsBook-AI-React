import type {
  ChatConfigResponse
} from "@/api/chatConfigApi"

import {
  getChatConfig
} from "@/api/chatConfigApi"

import {
  useChatConfigStore
} from "@/stores/chatConfigStore"

export async function loadChatConfig():
  Promise<void> {

  const store =
    useChatConfigStore
      .getState()

  store.setConfigLoading(
    true
  )

  store.setConfigLoaded(
    false
  )

  store.setConfigError(
    null
  )

  try {

    const response =
      await getChatConfig()

    applyChatConfig(
      response
    )

  } catch (
    exception
  ) {

    const message =
      exception instanceof Error
        ? exception.message
        : "Chat 설정을 불러오지 못했습니다."

    store.setConfigError(
      message
    )

    throw exception

  } finally {

    useChatConfigStore
      .getState()
      .setConfigLoading(
        false
      )
  }
}

export function applyChatConfig(
  response: ChatConfigResponse
): void {

  const agents =
    response.agents ?? []

  const models =
    response.models ?? []

  if (
    agents.length === 0
  ) {

    throw new Error(
      "사용 가능한 Agent가 없습니다."
    )
  }

  if (
    models.length === 0
  ) {

    throw new Error(
      "사용 가능한 Model이 없습니다."
    )
  }

  const defaultAgent =
    resolveDefaultAgent(
      response.defaultAgent,
      agents
    )

  const defaultModel =
    resolveDefaultModel(
      response.defaultModel,
      models
    )

  const store =
    useChatConfigStore
      .getState()

  store.setAgents(
    agents
  )

  store.setModels(
    models
  )

  store.setDefaults({
    defaultAgent,
    defaultModel,
    ragEnabled:
      response.ragEnabled === true,
    mcpEnabled:
      response.mcpEnabled === true
  })

  store.setConfigError(
    null
  )

  store.setConfigLoaded(
    true
  )
}

function resolveDefaultAgent(
  defaultAgent: string,
  agents: {
    id: string
    label: string
  }[]
): string {

  const normalized =
    defaultAgent?.trim()

  if (
    normalized &&
    agents.some(
      agent =>
        agent.id === normalized
    )
  ) {

    return normalized
  }

  return agents[0].id
}

function resolveDefaultModel(
  defaultModel: string,
  models: {
    id: string
    label: string
  }[]
): string {

  const normalized =
    defaultModel?.trim()

  if (
    normalized &&
    models.some(
      model =>
        model.id === normalized
    )
  ) {

    return normalized
  }

  return models[0].id
}