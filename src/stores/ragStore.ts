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

import type {
  RagIndexProgress
} from "@/models/RagIndexProgress"

interface RagState {

  contexts: RagContext[]

  running: boolean

  progress: RagIndexProgress | null

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

  clearProgress:
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

      progress: null,

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
                running: true,
                progress: null
              })

              break
            }

            case "RAG_PROGRESS": {

              const progress =
                event.data as RagIndexProgress | null | undefined

              if (!progress) return

              set({
                running:
                  progress.stage !== "COMPLETED"
                  && progress.stage !== "FAILED",

                progress
              })

              break
            }

            case "RAG_CONTEXT": {

              const payload =
                event.data as RagContextPayload | null | undefined

              if (!payload) return

              const text =
                payload.text?.trim()

              if (!text) return

              get()
                .addContext({
                  runId:
                    event.runId,

                  title:
                    payload.title?.trim()
                    || "RAG Context",

                  text,

                  sourcePath:
                    payload.sourcePath ?? null,

                  score:
                    payload.score ?? null,

                  createdAt:
                    event.timestamp
                    || new Date().toISOString()
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
            running: false,
            progress: null
          })
        },

      clearProgress:
        () => {

          set({
            progress: null
          })
        }
    })
  )