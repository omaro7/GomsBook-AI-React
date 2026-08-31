import {
  useEffect,
  useState
} from "react"

import {
  ChatHeader
} from "@/components/chat/ChatHeader"

import {
  ChatPanel
} from "@/components/chat/ChatPanel"

import {
  loadChatConfig
} from "@/services/chatConfigService"

export function ChatLayout() {

  const [
    configError,
    setConfigError
  ] = useState<string | null>(
    null
  )

  useEffect(
    () => {

      void initializeChatConfig()

    },
    []
  )

  async function initializeChatConfig() {

    try {

      await loadChatConfig()

    } catch (
      exception
    ) {

      setConfigError(
        exception instanceof Error
          ? exception.message
          : "Chat 설정을 불러오지 못했습니다."
      )
    }
  }

  return (
    <div
      className="
        flex
        h-screen
        min-h-0
        flex-col
        bg-background
        text-foreground
      "
    >
      <ChatHeader />

      {
        configError && (
          <div
            className="
              border-b
              px-4
              py-2
              text-sm
              text-destructive
            "
          >
            {configError}
          </div>
        )
      }

      <main
        className="
          min-h-0
          flex-1
        "
      >
        <ChatPanel />
      </main>
    </div>
  )
}