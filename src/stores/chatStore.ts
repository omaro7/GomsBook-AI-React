import { create } from "zustand"

import type {
  AgentEvent
} from "@/models/AgentEvent"

import type {
  ChatMessage,
  ChatMessageRole
} from "@/models/ChatMessage"

interface ChatState {
  messages: ChatMessage[]

  addMessage: (
    role: ChatMessageRole,
    content: string,
    runId?: string,
    timestamp?: string | null
  ) => void

  addUserMessage: (
    content: string,
    runId?: string
  ) => void

  addAssistantMessage: (
    content: string,
    runId?: string,
    timestamp?: string | null
  ) => void

  addSystemMessage: (
    content: string,
    runId?: string,
    timestamp?: string | null
  ) => void

  addToolMessage: (
    content: string,
    runId?: string,
    timestamp?: string | null
  ) => void

  handleAgentEvent: (
    event: AgentEvent
  ) => void

  clearMessages: () => void
}

export const useChatStore =
  create<ChatState>(
    (
      set,
      get
    ) => ({
      messages: [],

      addMessage: (
        role,
        content,
        runId,
        timestamp
      ) => {
        const normalizedContent =
          content.trim()

        if (!normalizedContent) {
          return
        }

        const message: ChatMessage = {
          id: crypto.randomUUID(),
          runId: runId ?? null,
          role,
          content: normalizedContent,
          createdAt:
            timestamp ??
            new Date().toISOString()
        }

        set(
          state => ({
            messages: [
              ...state.messages,
              message
            ]
          })
        )
      },

      addUserMessage: (
        content,
        runId
      ) => {
        get().addMessage(
          "user",
          content,
          runId
        )
      },

      addAssistantMessage: (
        content,
        runId,
        timestamp
      ) => {
        get().addMessage(
          "assistant",
          content,
          runId,
          timestamp
        )
      },

      addSystemMessage: (
        content,
        runId,
        timestamp
      ) => {
        get().addMessage(
          "system",
          content,
          runId,
          timestamp
        )
      },

      addToolMessage: (
        content,
        runId,
        timestamp
      ) => {
        get().addMessage(
          "tool",
          content,
          runId,
          timestamp
        )
      },

      handleAgentEvent: event => {
        switch (event.type) {
          case "ASSISTANT_MESSAGE": {
            const content =
              event.message ||
              event.content ||
              ""

            if (!content.trim()) {
              return
            }

            get().addAssistantMessage(
              content,
              event.runId,
              event.timestamp
            )

            break
          }

          case "AGENT_COMPLETED": {
            const content =
              event.message?.trim()

            if (!content) {
              return
            }

            if (
              isDuplicateMessage(
                get().messages,
                event.runId,
                "assistant",
                content
              )
            ) {
              return
            }

            get().addAssistantMessage(
              content,
              event.runId,
              event.timestamp
            )

            break
          }

          case "AGENT_FAILED": {

            const fileName =
              event.fileName ??
              "요청한 파일"

            let failureMessage =
              `${fileName} 파일을 생성하지 못했습니다.`

            if (
              event.message?.includes(
                "already exists"
              )
            ) {
              failureMessage =
                `${fileName} 파일을 생성하지 못했습니다. 이미 동일한 파일이 존재합니다.`
            }

            get().addAssistantMessage(
              failureMessage,
              event.runId,
              event.timestamp
            )

            break
          }

          default:
            break
        }
      },

      clearMessages: () => {
        set({
          messages: []
        })
      }
    })
  )

function isDuplicateMessage(
  messages: ChatMessage[],
  runId: string,
  role: ChatMessageRole,
  content: string
): boolean {
  for (
    let index =
      messages.length - 1;
    index >= 0;
    index--
  ) {
    const message =
      messages[index]

    if (
      message.runId !== runId
    ) {
      continue
    }

    if (
      message.role !== role
    ) {
      continue
    }

    return (
      message.content.trim() ===
      content.trim()
    )
  }

  return false
}