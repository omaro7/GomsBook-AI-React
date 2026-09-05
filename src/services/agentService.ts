import {
  runAgent
} from "@/api/agentApi"

import type {
  AgentRunRequest
} from "@/models/AgentRunRequest"

import type {
  AgentRunResponse
} from "@/models/AgentRunResponse"

import {
  handleAgentEvent
} from "@/services/agentEventHandler"

import {
  agentEventStream
} from "@/services/agentEventStream"

import {
  useAgentStore
} from "@/stores/agentStore"

import {
  useChatConfigStore
} from "@/stores/chatConfigStore"

import {
  useChatStore
} from "@/stores/chatStore"

import {
  useRagStore
} from "@/stores/ragStore"

import {
  useProjectStore
} from "@/stores/projectStore"

export async function executeAgent(
  message: string
): Promise<AgentRunResponse> {

  const normalizedMessage =
    message.trim()

  if (!normalizedMessage) {

    throw new Error(
      "Agent 실행 메시지가 비어 있습니다."
    )
  }

  const config =
    useChatConfigStore
      .getState()

  const project =
    useProjectStore
      .getState()

  const chat =
    useChatStore
      .getState()
      
  const projectId =
    project.currentProjectName.trim()

  if (!projectId) {
    throw new Error(
      "현재 프로젝트가 선택되지 않았습니다."
    )
  }

  const conversationId =
    chat.ensureConversationId()

  const request:
    AgentRunRequest = {

      projectId:
        projectId,

      conversationId:
        conversationId,

      message:
        normalizedMessage,

      agent:
        config.agent,

      model:
        config.model,

      ragEnabled:
        config.ragEnabled,

      mcpEnabled:
        config.mcpEnabled
    }

  resetCurrentAgentExecution()

  const response =
    await runAgent(
      request
    )

  const runId =
    response.runId

  useAgentStore
    .getState()
    .startRun(
      runId
    )

  useChatStore
    .getState()
    .addUserMessage(
      normalizedMessage,
      runId
    )

  agentEventStream.connect(
    runId,
    {
      onOpen:
        () => {

          useAgentStore
            .getState()
            .setStreamConnected(
              true
            )
        },

      onEvent:
        event => {

          handleAgentEvent(
            event
          )
        },

      onError:
        () => {

          useAgentStore
            .getState()
            .setStreamConnected(
              false
            )
        }
    }
  )

  return response
}

export function disconnectAgent():
  void {

  agentEventStream.disconnect()

  useAgentStore
    .getState()
    .setStreamConnected(
      false
    )
}

function resetCurrentAgentExecution():
  void {

  agentEventStream.disconnect()

  useAgentStore
    .getState()
    .reset()

  useRagStore
    .getState()
    .clear()
}