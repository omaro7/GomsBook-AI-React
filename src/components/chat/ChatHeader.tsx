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
  const projects = useProjectStore(state => state.projects)
  const currentProjectName = useProjectStore(state => state.currentProjectName)
  const currentProjectPath = useProjectStore(state => state.currentProjectPath)
  const projectRoot = useProjectStore(state => state.projectRoot)
  const projectLoading = useProjectStore(state => state.loading)
  const projectLoaded = useProjectStore(state => state.loaded)
  const projectError = useProjectStore(state => state.error)
  const loadProjects = useProjectStore(state => state.loadProjects)
  const selectProject = useProjectStore(state => state.selectProject)

  useEffect(() => {
    if (!projectLoaded) {
      void loadProjects()
    }
  }, [projectLoaded, loadProjects])

  const handleProjectChange = (value: string | null) => {
    if (value === null) {
      return
    }

    void selectProject(value)
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

    setAgent(value)
  }

  const handleModelChange = (
    value: string | null
  ) => {
    if (value === null) {
      return
    }

    setModel(value)
  }

  const handleRagChange = (
    checked: boolean
  ) => {
    setRagEnabled(checked)
  }

  const handleMcpChange = (
    checked: boolean
  ) => {
    setMcpEnabled(checked)
  }

  return (
    <header
      className="
        flex
        min-h-14
        w-full
        flex-wrap
        items-center
        gap-2
        border-b
        bg-background
        px-4
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={running}
          onClick={handleNewChat}
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
          h-6
          w-px
          bg-border
          md:block
        "
      />

      <div
        className="
          flex
          items-center
          gap-2
        "
        title={currentProjectPath || projectRoot}
      >
        <Label
          htmlFor="project-select"
          className="text-xs"
        >
          Project
        </Label>

        <Select
          value={currentProjectName}
          onValueChange={handleProjectChange}
          disabled={running || projectLoading || !projectLoaded}
        >
          <SelectTrigger
            id="project-select"
            className="w-52"
          >
            <SelectValue
              placeholder="Project 선택"
            />
          </SelectTrigger>

          <SelectContent>
            {projects.map(item => (
              <SelectItem
                key={item.projectName}
                value={item.projectName}
              >
                {item.projectName}
              </SelectItem>
            ))}
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
          className="text-xs"
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
            className="w-44"
          >
            <SelectValue
              placeholder="Agent 선택"
            />
          </SelectTrigger>

          <SelectContent>
            {agents.map(
              item => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </SelectItem>
              )
            )}
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
          className="text-xs"
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
            className="w-52"
          >
            <SelectValue
              placeholder="Model 선택"
            />
          </SelectTrigger>

          <SelectContent>
            {models.map(
              item => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div
        className="
          ml-auto
          flex
          items-center
          gap-4
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
            checked={ragEnabled}
            disabled={
              controlsDisabled
            }
            onCheckedChange={
              handleRagChange
            }
          />

          <Label
            htmlFor="rag-enabled"
            className="
              cursor-pointer
              text-xs
            "
          >
            RAG
          </Label>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Checkbox
            id="mcp-enabled"
            checked={mcpEnabled}
            disabled={
              controlsDisabled
            }
            onCheckedChange={
              handleMcpChange
            }
          />

          <Label
            htmlFor="mcp-enabled"
            className="
              cursor-pointer
              text-xs
            "
          >
            MCP
          </Label>
        </div>
      </div>

      {projectLoading && (
        <div
          className="
            w-full
            text-xs
            text-muted-foreground
          "
        >
          프로젝트 정보를 불러오는 중입니다.
        </div>
      )}

      {projectError && (
        <div
          className="
            w-full
            text-xs
            text-destructive
          "
        >
          {projectError}
        </div>
      )}

      {configLoading && (
        <div
          className="
            w-full
            text-xs
            text-muted-foreground
          "
        >
          Chat 설정을 불러오는 중입니다.
        </div>
      )}

      {configError && (
        <div
          className="
            w-full
            text-xs
            text-destructive
          "
        >
          {configError}
        </div>
      )}
    </header>
  )
}