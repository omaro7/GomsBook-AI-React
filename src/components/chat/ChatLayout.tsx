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
  CurrentProjectPanel
} from "@/components/project/CurrentProjectPanel"

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

      void initializeChatConfig()

    },
    []
  )

  return (
    <div
      className="
        flex
        h-screen
        min-h-0
        bg-background
        text-foreground
      "
    >
      <div
        className="
          flex
          min-w-0
          flex-1
          justify-center
        "
      >
        <div
          className="
            flex
            h-full
            w-full
            max-w-5xl
            min-h-0
            flex-col
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
      </div>

      <CurrentProjectPanel />
    </div>
  )
}