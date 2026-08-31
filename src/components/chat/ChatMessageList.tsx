import {
  useEffect,
  useRef
} from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  useChatStore
} from "@/stores/chatStore"

export function ChatMessageList() {

  const messages =
    useChatStore(
      state => state.messages
    )

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    )

  useEffect(
    () => {

      bottomRef.current?.scrollIntoView({
        behavior: "smooth"
      })

    },
    [
      messages
    ]
  )

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        px-3
        py-6
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-5xl
          flex-col
          gap-4
        "
      >
        {
          messages.map(
            message => {

              const isUser =
                message.role ===
                "user"

              return (
                <div
                  key={
                    message.id
                  }
                  className={
                    isUser
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      isUser
                        ? `
                          w-fit
                          max-w-[80%]
                          rounded-2xl
                          bg-primary
                          px-4
                          py-3
                          text-primary-foreground
                        `
                        : `
                          w-fit
                          max-w-[80%]
                          text-card-foreground
                        `
                    }
                  >
                    {
                      isUser
                        ? (
                          <p
                            className="
                              whitespace-pre-wrap
                              break-words
                            "
                          >
                            {message.content}
                          </p>
                        )
                        : (
                          <div
                            className="
                              break-words
                              text-sm
                              leading-7

                              [&_a]:
                              underline

                              [&_blockquote]:
                              m-0

                              [&_blockquote]:
                              w-fit

                              [&_blockquote]:
                              max-w-full

                              [&_blockquote]:
                              rounded-2xl

                              [&_blockquote]:
                              border

                              [&_blockquote]:
                              border-l

                              [&_blockquote]:
                              bg-muted/50

                              [&_blockquote]:
                              px-4

                              [&_blockquote]:
                              py-3

                              [&_blockquote_p]:
                              m-0

                              [&_code]:
                              rounded

                              [&_code]:
                              bg-muted

                              [&_code]:
                              px-1.5

                              [&_code]:
                              py-0.5

                              [&_li]:
                              ml-5

                              [&_ol]:
                              list-decimal

                              [&_p]:
                              my-0

                              [&_pre]:
                              my-3

                              [&_pre]:
                              overflow-x-auto

                              [&_pre]:
                              rounded-xl

                              [&_pre]:
                              bg-muted

                              [&_pre]:
                              p-4

                              [&_table]:
                              my-3

                              [&_table]:
                              w-full

                              [&_table]:
                              border-collapse

                              [&_td]:
                              border

                              [&_td]:
                              px-3

                              [&_td]:
                              py-2

                              [&_th]:
                              border

                              [&_th]:
                              bg-muted

                              [&_th]:
                              px-3

                              [&_th]:
                              py-2

                              [&_th]:
                              text-left

                              [&_ul]:
                              list-disc
                            "
                          >
                            <ReactMarkdown
                              remarkPlugins={[
                                remarkGfm
                              ]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )
                    }
                  </div>
                </div>
              )
            }
          )
        }

        <div
          ref={
            bottomRef
          }
        />
      </div>
    </div>
  )
}