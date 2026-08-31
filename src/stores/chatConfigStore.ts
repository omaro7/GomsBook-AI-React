import {
  create
} from "zustand"

export interface ChatAgentOption {
  id: string
  label: string
}

export interface ChatModelOption {
  id: string
  label: string
}

interface ChatConfigState {

  agent: string
  model: string

  ragEnabled: boolean
  mcpEnabled: boolean

  defaultAgent: string
  defaultModel: string

  defaultRagEnabled: boolean
  defaultMcpEnabled: boolean

  agents: ChatAgentOption[]
  models: ChatModelOption[]

  configLoading: boolean
  configLoaded: boolean
  configError: string | null

  setAgent: (agent: string) => void

  setModel: (model: string) => void

  setRagEnabled:
    (enabled: boolean) => void

  setMcpEnabled:
    (enabled: boolean) => void

  setAgents:
    (agents: ChatAgentOption[]) => void

  setModels:
    (models: ChatModelOption[]) => void

  setDefaults:
    (
      defaults: {
        defaultAgent: string
        defaultModel: string
        ragEnabled: boolean
        mcpEnabled: boolean
      }
    ) => void

  setConfigLoading:
    (loading: boolean) => void

  setConfigLoaded:
    (loaded: boolean) => void

  setConfigError:
    (error: string | null) => void

  reset: () => void
}

const initialState = {

  agent: "",

  model: "",

  ragEnabled: false,

  mcpEnabled: false,

  defaultAgent: "",

  defaultModel: "",

  defaultRagEnabled: false,

  defaultMcpEnabled: false,

  agents: [] as ChatAgentOption[],

  models: [] as ChatModelOption[],

  configLoading: false,

  configLoaded: false,

  configError: null as string | null
}

export const useChatConfigStore =
  create<ChatConfigState>(
    (
      set,
      get
    ) => ({

      ...initialState,

      setAgent:
        agent =>
          set({
            agent
          }),

      setModel:
        model =>
          set({
            model
          }),

      setRagEnabled:
        ragEnabled =>
          set({
            ragEnabled
          }),

      setMcpEnabled:
        mcpEnabled =>
          set({
            mcpEnabled
          }),

      setAgents:
        agents =>
          set({
            agents
          }),

      setModels:
        models =>
          set({
            models
          }),

      setDefaults:
        defaults =>
          set({
            defaultAgent:
              defaults.defaultAgent,

            defaultModel:
              defaults.defaultModel,

            defaultRagEnabled:
              defaults.ragEnabled,

            defaultMcpEnabled:
              defaults.mcpEnabled,

            agent:
              defaults.defaultAgent,

            model:
              defaults.defaultModel,

            ragEnabled:
              defaults.ragEnabled,

            mcpEnabled:
              defaults.mcpEnabled
          }),

      setConfigLoading:
        configLoading =>
          set({
            configLoading
          }),

      setConfigLoaded:
        configLoaded =>
          set({
            configLoaded
          }),

      setConfigError:
        configError =>
          set({
            configError
          }),

      reset:
        () => {

          const state =
            get()

          set({
            agent:
              state.defaultAgent,

            model:
              state.defaultModel,

            ragEnabled:
              state.defaultRagEnabled,

            mcpEnabled:
              state.defaultMcpEnabled
          })
        }
    })
  )