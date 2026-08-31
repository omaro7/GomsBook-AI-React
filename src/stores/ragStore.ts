import {
  create
} from "zustand"

import type {
  AgentEvent
} from "@/models/AgentEvent"

import type {
  RagContext
} from "@/models/RagContext"

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
                running: true
              })

              break
            }

            case "RAG_CONTEXT": {

              const text =
                event.text ||
                event.content ||
                ""

              if (
                !text.trim()
              ) {
                return
              }

              get()
                .addContext({
                  runId:
                    event.runId,

                  title:
                    event.title ||
                    "RAG Context",

                  text,

                  sourcePath:
                    event.sourcePath,

                  score:
                    event.score,

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