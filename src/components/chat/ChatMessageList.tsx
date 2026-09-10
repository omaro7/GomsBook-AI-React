import {
  useEffect,
  useRef,
  useState
} from "react"

import ReactConfetti from "react-confetti"

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

function isEpubCheckValid(content: string) {

  if (!content) return false

  const normalized =
    content
      .replace(/\s+/g, " ")
      .toUpperCase()

  return (
    normalized.includes("성공(VALID)") ||
    normalized.includes("상태: 통과") ||
    normalized.includes("상태**: 통과") ||
    normalized.includes("PASSED") ||
    normalized.includes("EPUBCHECK 검증 결과, 성공")
  )
}

function prefersReducedMotion() {

  if (typeof window === "undefined") return false

  return window
    .matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    .matches
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

  const lastConfettiMessageIdRef =
    useRef<string | null>(
      null
    )

  const confettiTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

  const [
    showConfetti,
    setShowConfetti
  ] =
    useState(false)

  const [
    windowSize,
    setWindowSize
  ] =
    useState({
      width: 0,
      height: 0
    })

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

  useEffect(
    () => {

      const updateWindowSize = () => {

        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      updateWindowSize()

      window.addEventListener(
        "resize",
        updateWindowSize
      )

      return () => {

        window.removeEventListener(
          "resize",
          updateWindowSize
        )
      }

    },
    []
  )

  useEffect(
    () => {

      if (messages.length === 0) return

      const latestMessage =
        messages[
          messages.length - 1
        ]

      if (!latestMessage) return

      if (
        latestMessage.role !==
        "assistant"
      ) {
        return
      }

      if (
        !isEpubCheckValid(
          latestMessage.content
        )
      ) {
        return
      }

      if (
        lastConfettiMessageIdRef.current ===
        latestMessage.id
      ) {
        return
      }

      lastConfettiMessageIdRef.current =
        latestMessage.id

      if (
        prefersReducedMotion()
      ) {
        return
      }

      if (
        confettiTimerRef.current
      ) {
        clearTimeout(
          confettiTimerRef.current
        )
      }

      setShowConfetti(true)

      confettiTimerRef.current =
        setTimeout(
          () => {

            setShowConfetti(false)

            confettiTimerRef.current =
              null

          },
          3500
        )

    },
    [
      messages
    ]
  )

  useEffect(
    () => {

      return () => {

        if (
          confettiTimerRef.current
        ) {
          clearTimeout(
            confettiTimerRef.current
          )
        }
      }

    },
    []
  )

  return (
    <>
      {
        showConfetti &&
        windowSize.width > 0 &&
        windowSize.height > 0
          ? (
            <ReactConfetti
              width={
                windowSize.width
              }
              height={
                windowSize.height
              }
              numberOfPieces={
                350
              }
              recycle={
                false
              }
              gravity={
                0.18
              }
              initialVelocityY={
                18
              }
              tweenDuration={
                3000
              }
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                pointerEvents: "none"
              }}
            />
          )
          : null
      }

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

                                [&_a]:no-underline
                                [&_a]:text-left

                                [&_blockquote]:m-0
                                [&_blockquote]:w-fit
                                [&_blockquote]:max-w-full
                                [&_blockquote]:rounded-2xl
                                [&_blockquote]:border
                                [&_blockquote]:border-border
                                [&_blockquote]:border-l
                                [&_blockquote]:bg-muted/50
                                [&_blockquote]:px-4
                                [&_blockquote]:py-3
                                [&_blockquote]:text-left

                                [&_blockquote_p]:m-0
                                [&_blockquote_p]:text-left

                                [&_code]:rounded
                                [&_code]:bg-muted
                                [&_code]:px-1.5
                                [&_code]:py-0.5

                                [&_h1]:text-left
                                [&_h2]:text-left
                                [&_h3]:text-left
                                [&_h4]:text-left

                                [&_li]:ml-5
                                [&_li]:text-left

                                [&_ol]:list-decimal
                                [&_ol]:text-left

                                [&_p]:my-0
                                [&_p]:text-left

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

                                [&_tbody_tr:nth-child(odd)]:bg-white
                                [&_tbody_tr:nth-child(even)]:bg-slate-50

                                [&_tbody_tr]:transition-colors

                                [&_tbody_tr:hover]:bg-blue-50

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
    </>
  )
}