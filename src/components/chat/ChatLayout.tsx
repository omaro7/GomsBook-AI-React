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
        justify-center
        overflow-hidden
        px-5
        py-4
        text-foreground
        max-lg:px-3
        max-lg:py-2
      "
    >
      <div
        className="
          flex
          h-full
          min-h-0
          w-fit
          max-w-full
          gap-5
        "
      >
        <section
          className="
            flex
            h-full
            min-h-0
            w-[1024px]
            min-w-0
            flex-col
            overflow-hidden
            rounded-[var(--goms-radius-panel)]
            border
            border-border
            bg-card
            shadow-[var(--goms-shadow-lg)]
            max-xl:w-[900px]
            max-lg:w-full
          "
        >
          <ChatHeader />

          {
            configError && (
              <div
                className="
                  mx-4
                  mt-3
                  rounded-[var(--goms-radius-md)]
                  border
                  border-destructive/20
                  bg-destructive/5
                  px-4
                  py-3
                  text-left
                  text-sm
                  text-destructive
                "
                role="alert"
              >
                {configError}
              </div>
            )
          }

          <main
            className="
              min-h-0
              min-w-0
              flex-1
            "
          >
            <ChatPanel />
          </main>
        </section>

        <div
          className="
            h-full
            min-h-0
            shrink-0
            max-lg:hidden
          "
        >
          <CurrentProjectPanel />
        </div>
      </div>
    </div>
  )
}