import {
  MessageSquarePlus,
  Trash2
} from "lucide-react"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { disconnectAgent } from "@/services/agentService"

import { useAgentStore } from "@/stores/agentStore"
import { useChatConfigStore } from "@/stores/chatConfigStore"
import { useChatStore } from "@/stores/chatStore"
import { useRagStore } from "@/stores/ragStore"
import { useProjectStore } from "@/stores/projectStore"

export function ChatHeader() {

  const projects =
    useProjectStore(
      state => state.projects
    )

  const currentProjectName =
    useProjectStore(
      state => state.currentProjectName
    )

  const currentProjectPath =
    useProjectStore(
      state => state.currentProjectPath
    )

  const projectRoot =
    useProjectStore(
      state => state.projectRoot
    )

  const projectLoading =
    useProjectStore(
      state => state.loading
    )

  const projectLoaded =
    useProjectStore(
      state => state.loaded
    )

  const projectError =
    useProjectStore(
      state => state.error
    )

  const loadProjects =
    useProjectStore(
      state => state.loadProjects
    )

  const selectProject =
    useProjectStore(
      state => state.selectProject
    )


  useEffect(
    () => {

      if (!projectLoaded) {

        void loadProjects()
      }

    },
    [
      projectLoaded,
      loadProjects
    ]
  )


  const handleProjectChange = (
    value: string | null
  ) => {

    if (value === null) {

      return
    }

    void selectProject(
      value
    )
  }


  const running =
    useAgentStore(
      state => state.running
    )


  const agent =
    useChatConfigStore(
      state => state.agent
    )

  const model =
    useChatConfigStore(
      state => state.model
    )

  const ragEnabled =
    useChatConfigStore(
      state => state.ragEnabled
    )

  const mcpEnabled =
    useChatConfigStore(
      state => state.mcpEnabled
    )

  const agents =
    useChatConfigStore(
      state => state.agents
    )

  const models =
    useChatConfigStore(
      state => state.models
    )

  const configLoading =
    useChatConfigStore(
      state => state.configLoading
    )

  const configLoaded =
    useChatConfigStore(
      state => state.configLoaded
    )

  const configError =
    useChatConfigStore(
      state => state.configError
    )

  const setAgent =
    useChatConfigStore(
      state => state.setAgent
    )

  const setModel =
    useChatConfigStore(
      state => state.setModel
    )

  const setRagEnabled =
    useChatConfigStore(
      state => state.setRagEnabled
    )

  const setMcpEnabled =
    useChatConfigStore(
      state => state.setMcpEnabled
    )


  const controlsDisabled =
    running ||
    configLoading ||
    !configLoaded


  const handleNewChat = () => {

    if (running) {

      return
    }

    disconnectAgent()

    useChatStore
      .getState()
      .clearMessages()

    useRagStore
      .getState()
      .clear()

    useAgentStore
      .getState()
      .reset()

    useChatConfigStore
      .getState()
      .reset()
  }


  const handleClear = () => {

    if (running) {

      return
    }

    useChatStore
      .getState()
      .clearMessages()

    useRagStore
      .getState()
      .clear()

    useAgentStore
      .getState()
      .reset()
  }


  const handleAgentChange = (
    value: string | null
  ) => {

    if (value === null) {

      return
    }

    setAgent(
      value
    )
  }


  const handleModelChange = (
    value: string | null
  ) => {

    if (value === null) {

      return
    }

    setModel(
      value
    )
  }


  const handleRagChange = (
    checked: boolean
  ) => {

    setRagEnabled(
      checked
    )
  }


  const handleMcpChange = (
    checked: boolean
  ) => {

    setMcpEnabled(
      checked
    )
  }


  return (
    <header
      className="
        sticky
        top-0
        z-20
        flex
        min-h-16
        w-full
        flex-wrap
        items-center
        gap-x-3
        gap-y-2
        border-b
        border-border/90
        bg-card/85
        px-4
        py-3
        text-left
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-card/75
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Button
          type="button"
          size="sm"
          disabled={running}
          onClick={handleNewChat}
          className="
            gap-2
            rounded-[var(--goms-radius-sm)]
            bg-primary
            px-3
            font-semibold
            text-primary-foreground
            shadow-[var(--goms-shadow-xs)]
            transition-all
            hover:bg-[var(--goms-primary-hover)]
            hover:shadow-[var(--goms-shadow-sm)]
          "
        >
          <MessageSquarePlus
            className="size-4"
          />

          <span>
            New Chat
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={running}
          onClick={handleClear}
          className="
            gap-2
            rounded-[var(--goms-radius-sm)]
            border-border
            bg-card/80
            px-3
            font-medium
            text-muted-foreground
            shadow-none
            hover:border-primary/30
            hover:bg-accent
            hover:text-primary
          "
        >
          <Trash2
            className="size-4"
          />

          <span>
            Clear
          </span>
        </Button>
      </div>


      <div
        className="
          mx-1
          hidden
          h-7
          w-px
          bg-border
          lg:block
        "
      />


      <div
        className="
          flex
          items-center
          gap-2
        "
        title={
          currentProjectPath ||
          projectRoot
        }
      >
        <Label
          htmlFor="project-select"
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.06em]
            text-muted-foreground
          "
        >
          Project
        </Label>

        <Select
          value={
            currentProjectName
          }
          onValueChange={
            handleProjectChange
          }
          disabled={
            running ||
            projectLoading ||
            !projectLoaded
          }
        >
          <SelectTrigger
            id="project-select"
            className="
              h-9
              w-52
              rounded-[var(--goms-radius-sm)]
              border-border
              bg-card/80
              text-sm
              shadow-none
              transition-colors
              hover:border-primary/30
              focus:ring-primary/20
            "
          >
            <SelectValue
              placeholder="Project 선택"
            />
          </SelectTrigger>

          <SelectContent
            className="
              rounded-[var(--goms-radius-md)]
              border-border
              bg-popover
              shadow-[var(--goms-shadow-lg)]
            "
          >
            {
              projects.map(
                item => (
                  <SelectItem
                    key={
                      item.projectName
                    }
                    value={
                      item.projectName
                    }
                  >
                    {
                      item.projectName
                    }
                  </SelectItem>
                )
              )
            }
          </SelectContent>
        </Select>
      </div>


      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Label
          htmlFor="agent-select"
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.06em]
            text-muted-foreground
          "
        >
          Agent
        </Label>

        <Select
          value={agent}
          onValueChange={
            handleAgentChange
          }
          disabled={
            controlsDisabled
          }
        >
          <SelectTrigger
            id="agent-select"
            className="
              h-9
              w-44
              rounded-[var(--goms-radius-sm)]
              border-border
              bg-card/80
              text-sm
              shadow-none
              transition-colors
              hover:border-primary/30
              focus:ring-primary/20
            "
          >
            <SelectValue
              placeholder="Agent 선택"
            />
          </SelectTrigger>

          <SelectContent
            className="
              rounded-[var(--goms-radius-md)]
              border-border
              bg-popover
              shadow-[var(--goms-shadow-lg)]
            "
          >
            {
              agents.map(
                item => (
                  <SelectItem
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {
                      item.label
                    }
                  </SelectItem>
                )
              )
            }
          </SelectContent>
        </Select>
      </div>


      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Label
          htmlFor="model-select"
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.06em]
            text-muted-foreground
          "
        >
          Model
        </Label>

        <Select
          value={model}
          onValueChange={
            handleModelChange
          }
          disabled={
            controlsDisabled
          }
        >
          <SelectTrigger
            id="model-select"
            className="
              h-9
              w-52
              rounded-[var(--goms-radius-sm)]
              border-border
              bg-card/80
              text-sm
              shadow-none
              transition-colors
              hover:border-primary/30
              focus:ring-primary/20
            "
          >
            <SelectValue
              placeholder="Model 선택"
            />
          </SelectTrigger>

          <SelectContent
            className="
              rounded-[var(--goms-radius-md)]
              border-border
              bg-popover
              shadow-[var(--goms-shadow-lg)]
            "
          >
            {
              models.map(
                item => (
                  <SelectItem
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {
                      item.label
                    }
                  </SelectItem>
                )
              )
            }
          </SelectContent>
        </Select>
      </div>


      <div
        className="
          ml-auto
          flex
          items-center
          gap-3
          rounded-[var(--goms-radius-md)]
          border
          border-border
          bg-[var(--goms-surface-subtle)]
          px-3
          py-2
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Checkbox
            id="rag-enabled"
            checked={
              ragEnabled
            }
            disabled={
              controlsDisabled
            }
            onCheckedChange={
              handleRagChange
            }
            className="
              border-border
              data-[state=checked]:border-primary
              data-[state=checked]:bg-primary
            "
          />

          <Label
            htmlFor="rag-enabled"
            className="
              cursor-pointer
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            RAG
          </Label>
        </div>


        <div
          className="
            h-4
            w-px
            bg-border
          "
        />


        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Checkbox
            id="mcp-enabled"
            checked={
              mcpEnabled
            }
            disabled={
              controlsDisabled
            }
            onCheckedChange={
              handleMcpChange
            }
            className="
              border-border
              data-[state=checked]:border-primary
              data-[state=checked]:bg-primary
            "
          />

          <Label
            htmlFor="mcp-enabled"
            className="
              cursor-pointer
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            MCP
          </Label>
        </div>
      </div>


      {
        projectLoading && (
          <div
            className="
              w-full
              rounded-[var(--goms-radius-sm)]
              bg-muted
              px-3
              py-2
              text-xs
              text-muted-foreground
            "
          >
            프로젝트 정보를 불러오는 중입니다.
          </div>
        )
      }


      {
        projectError && (
          <div
            className="
              w-full
              rounded-[var(--goms-radius-sm)]
              border
              border-destructive/20
              bg-destructive/5
              px-3
              py-2
              text-xs
              text-destructive
            "
            role="alert"
          >
            {
              projectError
            }
          </div>
        )
      }


      {
        configLoading && (
          <div
            className="
              w-full
              rounded-[var(--goms-radius-sm)]
              bg-muted
              px-3
              py-2
              text-xs
              text-muted-foreground
            "
          >
            Chat 설정을 불러오는 중입니다.
          </div>
        )
      }


      {
        configError && (
          <div
            className="
              w-full
              rounded-[var(--goms-radius-sm)]
              border
              border-destructive/20
              bg-destructive/5
              px-3
              py-2
              text-xs
              text-destructive
            "
            role="alert"
          >
            {
              configError
            }
          </div>
        )
      }
    </header>
  )
}