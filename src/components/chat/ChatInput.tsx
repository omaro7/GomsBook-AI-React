import {
  useState
} from "react"

import {
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

  const running =
    useAgentStore(
      state => state.running
    )

  const error =
    useAgentStore(
      state => state.error
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

  return (
    <div
      className="
        border-t
        bg-background
        p-4
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-5xl
          items-end
          gap-2
        "
      >
        <Textarea
          value={message}
          onChange={
            event =>
              setMessage(
                event.target.value
              )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder="GomsBook AI에게 요청하세요."
          disabled={running}
          rows={3}
          className="
            min-h-[80px]
            resize-none
          "
        />

        <Button
          type="button"
          size="icon"
          disabled={
            running ||
            !message.trim()
          }
          onClick={
            () =>
              void submitMessage()
          }
          aria-label="메시지 전송"
        >
          <Send
            className="
              h-4
              w-4
            "
          />
        </Button>
      </div>

      {
        error && (
          <div
            className="
              mx-auto
              mt-2
              max-w-5xl
              text-sm
              text-destructive
            "
          >
            {error}
          </div>
        )
      }
    </div>
  )
}