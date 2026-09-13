import {
  useEffect,
  useRef
} from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  useChatStore
} from "@/stores/chatStore"

function normalizeMarkdown(content: string) {
  return content
    .replace(/\$\\rightarrow\$/g, "→")
    .replace(/\$\\leftarrow\$/g, "←")
    .replace(/\$\\leftrightarrow\$/g, "↔")
    .replace(/\$\\Rightarrow\$/g, "⇒")
    .replace(/\$\\Leftarrow\$/g, "⇐")
    .replace(/\$\\checkmark\$/g, "✓")
}

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
        min-h-0
        flex-1
        overflow-y-auto
        px-3
        py-3
      "
    >
      <div
        className="
          flex
          w-full
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
                          rounded-2xl
                          border
                          border-border
                          bg-card
                          px-4
                          py-3
                          text-slate-800
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
                              text-left
                            "
                          >
                            {
                              message.content
                            }
                          </p>
                        )
                        : (
                          <div
                            className="
                              break-words
                              text-left
                              text-sm
                              leading-7
                              text-slate-800

                              [&_a]:no-underline
                              [&_a]:text-left
                              [&_a]:text-slate-800

                              [&_blockquote]:m-0
                              [&_blockquote]:max-w-full
                              [&_blockquote]:border-0
                              [&_blockquote]:bg-transparent
                              [&_blockquote]:p-0
                              [&_blockquote]:text-left
                              [&_blockquote]:text-slate-800

                              [&_blockquote_p]:m-0
                              [&_blockquote_p]:text-left

                              [&_code]:rounded
                              [&_code]:bg-muted
                              [&_code]:px-1.5
                              [&_code]:py-0.5
                              [&_code]:text-slate-800

                              [&_h1]:text-left
                              [&_h1]:text-slate-900

                              [&_h2]:text-left
                              [&_h2]:text-slate-900

                              [&_h3]:text-left
                              [&_h3]:text-slate-900

                              [&_h4]:text-left
                              [&_h4]:text-slate-900

                              [&_li]:ml-5
                              [&_li]:text-left
                              [&_li]:text-slate-800

                              [&_ol]:list-decimal
                              [&_ol]:text-left

                              [&_p]:my-0
                              [&_p]:text-left
                              [&_p]:text-slate-800

                              [&_pre]:my-3
                              [&_pre]:overflow-x-auto
                              [&_pre]:rounded-xl
                              [&_pre]:bg-muted
                              [&_pre]:p-4
                              [&_pre]:text-left

                              [&_table]:my-3
                              [&_table]:w-full
                              [&_table]:border-collapse
                              [&_table]:border
                              [&_table]:border-slate-300

                              [&_thead]:bg-slate-200

                              [&_thead_tr]:bg-slate-200

                              [&_th]:border
                              [&_th]:border-slate-300
                              [&_th]:bg-slate-200
                              [&_th]:px-3
                              [&_th]:py-2.5
                              [&_th]:text-left
                              [&_th]:font-semibold
                              [&_th]:text-slate-900
                              [&_th]:whitespace-nowrap

                              [&_td]:border
                              [&_td]:border-slate-300
                              [&_td]:px-3
                              [&_td]:py-2
                              [&_td]:align-top
                              [&_td]:text-left
                              [&_td]:text-slate-800

                              [&_tbody_tr:nth-child(odd)]:bg-white
                              [&_tbody_tr:nth-child(even)]:bg-slate-50

                              [&_tbody_tr]:transition-colors

                              [&_tbody_tr:hover]:bg-slate-100

                              [&_ul]:list-disc
                              [&_ul]:text-left
                            "
                          >
                            <ReactMarkdown
                              remarkPlugins={[
                                remarkGfm
                              ]}
                            >
                              {
                                normalizeMarkdown(
                                  message.content
                                )
                              }
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