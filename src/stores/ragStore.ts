import {
  create
} from "zustand"

import type {
  AgentEvent
} from "@/models/AgentEvent"

import type {
  RagContext
} from "@/models/RagContext"

import type {
  RagContextPayload
} from "@/models/RagContextPayload"

interface RagState {

  contexts: RagContext[]

  running: boolean

  addContext:
    (
      context: RagContext
    ) => void

  handleAgentEvent:
    (
      event: AgentEvent
    ) => void

  clear:
    () => void
}

export const useRagStore =
  create<RagState>(
    (
      set,
      get
    ) => ({

      contexts: [],

      running: false,

      addContext:
        (
          context
        ) => {

          set(
            state => ({
              contexts: [
                ...state.contexts,
                context
              ]
            })
          )
        },

      handleAgentEvent:
        (
          event
        ) => {

          switch (
            event.type
          ) {

            case "RAG_STARTED": {

              set({
                contexts: [],
                running: true
              })

              break
            }

            case "RAG_CONTEXT": {

              const payload = event.data as RagContextPayload | null | undefined

              if (!payload) return

              if (
                typeof payload.text !== "string"
              ) return

              const text = payload.text.trim()

              if (!text) return

              get()
                .addContext({
                  runId:
                    event.runId,

                  title:
                    payload.title?.trim() ||
                    "RAG Context",

                  text,

                  sourcePath:
                    payload.sourcePath ?? null,

                  score:
                    payload.score ?? null,

                  createdAt:
                    event.timestamp ||
                    new Date().toISOString()
                })

              break
            }

            case "RAG_COMPLETED": {

              set({
                running: false
              })

              break
            }

            case "AGENT_COMPLETED":
            case "AGENT_FAILED":
            case "APPROVAL_EXPIRED": {

              set({
                running: false
              })

              break
            }

            default: {
              break
            }
          }
        },

      clear:
        () => {

          set({
            contexts: [],
            running: false
          })
        }
    })
  )