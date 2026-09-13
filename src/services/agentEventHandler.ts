import type {
  AgentEvent
} from "@/models/AgentEvent"

import {
  useAgentStore
} from "@/stores/agentStore"

import {
  useChatStore
} from "@/stores/chatStore"

import {
  useRagStore
} from "@/stores/ragStore"

import {
  agentEventStream
} from "@/services/agentEventStream"


export function handleAgentEvent(
  event: AgentEvent
): void {

  useAgentStore
    .getState()
    .handleEvent(
      event
    )

  useChatStore
    .getState()
    .handleAgentEvent(
      event
    )

  useRagStore
    .getState()
    .handleAgentEvent(
      event
    )

  if (
    isTerminalEvent(
      event
    )
  ) {

    disconnectAgentEventStream()
  }
}


function isTerminalEvent(
  event: AgentEvent
): boolean {

  switch (
    event.type
  ) {

    case "APPROVAL_EXPIRED":
    case "AGENT_COMPLETED":
    case "AGENT_FAILED":

      return true


    default:

      return false
  }
}


function disconnectAgentEventStream(): void {

  agentEventStream.disconnect()

  useAgentStore
    .getState()
    .setStreamConnected(
      false
    )
}