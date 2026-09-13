import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  LoaderCircle,
  Send
} from "lucide-react"

import {
  Button
} from "@/components/ui/button"

import {
  Textarea
} from "@/components/ui/textarea"

import {
  executeAgent
} from "@/services/agentService"

import {
  useAgentStore
} from "@/stores/agentStore"

export function ChatInput() {

  const [
    message,
    setMessage
  ] = useState("")

  const inputRef =
    useRef<HTMLTextAreaElement | null>(
      null
    )

  const running =
    useAgentStore(
      state => state.running
    )


  useEffect(
    () => {

      if (running) {

        return
      }

      requestAnimationFrame(
        () => {

          inputRef.current?.focus()
        }
      )

    },
    [
      running
    ]
  )


  async function submitMessage() {

    const normalizedMessage =
      message.trim()

    if (
      !normalizedMessage ||
      running
    ) {

      return
    }

    setMessage("")

    try {

      await executeAgent(
        normalizedMessage
      )

    } catch (
      exception
    ) {

      const errorMessage =
        exception instanceof Error
          ? exception.message
          : "Agent 실행 중 오류가 발생했습니다."

      useAgentStore
        .getState()
        .setError(
          errorMessage
        )
    }
  }


  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (
      event.key !== "Enter"
    ) {

      return
    }

    if (
      event.shiftKey
    ) {

      return
    }

    event.preventDefault()

    void submitMessage()
  }


  const sendDisabled =
    running ||
    !message.trim()


  return (
    <div
      className="
        shrink-0
        border-t
        border-border/80
        bg-card/80
        px-5
        pb-5
        pt-4
        backdrop-blur-xl
        max-sm:px-3
        max-sm:pb-3
        max-sm:pt-3
      "
    >
      <div
        className="
          mx-auto
          w-full
        "
      >
        <div
          className="
            flex
            w-full
            items-end
            gap-3
            rounded-[var(--goms-radius-xl)]
            border
            border-border
            bg-card
            p-2
            shadow-[var(--goms-shadow-lg)]
            transition-all
            duration-200
            focus-within:border-primary/50
            focus-within:ring-4
            focus-within:ring-primary/10
          "
        >
          <Textarea
            ref={
              inputRef
            }
            value={
              message
            }
            onChange={
              event =>
                setMessage(
                  event.target.value
                )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={
              running
                ? "GomsBook AI가 작업 중입니다."
                : "GomsBook AI에게 요청하세요."
            }
            disabled={
              running
            }
            rows={3}
            aria-label="GomsBook AI 메시지 입력"
            className="
              min-h-[84px]
              max-h-[220px]
              flex-1
              resize-none
              border-0
              bg-transparent
              px-3
              py-2
              text-sm
              leading-6
              text-foreground
              shadow-none
              outline-none
              placeholder:text-muted-foreground
              focus-visible:ring-0
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />


          <Button
            type="button"
            size="icon"
            disabled={
              sendDisabled
            }
            onClick={
              () =>
                void submitMessage()
            }
            aria-label={
              running
                ? "Agent 실행 중"
                : "메시지 전송"
            }
            className="
              mb-1
              size-11
              shrink-0
              rounded-[var(--goms-radius-md)]
              bg-primary
              text-primary-foreground
              shadow-[var(--goms-shadow-sm)]
              transition-all
              duration-200
              hover:bg-[var(--goms-primary-hover)]
              hover:shadow-[var(--goms-shadow-md)]
              active:scale-[0.97]
              disabled:bg-muted
              disabled:text-muted-foreground
              disabled:shadow-none
            "
          >
            {
              running
                ? (
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />
                )
                : (
                  <Send
                    className="
                      size-4
                    "
                  />
                )
            }
          </Button>
        </div>


        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-4
            px-2
            text-[11px]
            leading-4
            text-muted-foreground
            max-sm:flex-col
            max-sm:items-start
            max-sm:gap-1
          "
        >
          <span>
            Enter 전송 · Shift + Enter 줄바꿈
          </span>

          {
            running
              ? (
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    font-medium
                    text-primary
                  "
                >
                  <span
                    className="
                      size-1.5
                      animate-pulse
                      rounded-full
                      bg-primary
                    "
                  />

                  Agent 실행 중
                </span>
              )
              : (
                <span>
                  GomsBook AI Agent
                </span>
              )
          }
        </div>
      </div>
    </div>
  )
}