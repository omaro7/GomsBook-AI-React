import {
  useEffect,
  useState
} from "react"

import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle
} from "lucide-react"

import {
  useRagStore
} from "@/stores/ragStore"

export function RagIndexProgressCard() {

  const progress =
    useRagStore(
      state =>
        state.progress
    )

  const clearProgress =
    useRagStore(
      state =>
        state.clearProgress
    )

  const [leaving, setLeaving] =
    useState(
      false
    )

  useEffect(
    () => {

      if (!progress) return

      if (progress.stage !== "COMPLETED") return

      const leaveTimer =
        window.setTimeout(
          () => {

            setLeaving(
              true
            )
          },
          1000
        )

      const clearTimer =
        window.setTimeout(
          () => {

            clearProgress()
          },
          1300
        )

      return () => {

        window.clearTimeout(
          leaveTimer
        )

        window.clearTimeout(
          clearTimer
        )
      }
    },
    [
      progress,
      clearProgress
    ]
  )

  if (!progress) return null

  const completed =
    progress.stage === "COMPLETED"

  const failed =
    progress.stage === "FAILED"

  const percent =
    Math.max(
      0,
      Math.min(
        100,
        progress.percent ?? 0
      )
    )

  const fileName =
    resolveFileName(
      progress.sourcePath
    )

  return (
    <div
      className={`
        rounded-lg
        border
        bg-background
        p-4
        transition-all
        duration-300
        ease-in-out
        ${
          leaving
            ? "translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        }
      `}
    >

      <div className="flex items-center gap-2">

        {completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : failed ? (
          <CircleAlert className="h-4 w-4" />
        ) : (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        )}

        <span className="text-sm font-medium">
          {completed
            ? "RAG 인덱싱 완료"
            : failed
              ? "RAG 인덱싱 실패"
              : "RAG 인덱싱 중"}
        </span>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">

        <div
          className="h-full bg-primary transition-all duration-200"
          style={{
            width: `${percent}%`
          }}
        />

      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">

        <span>
          {progress.current} / {progress.total} 문서
        </span>

        <span>
          {percent}%
        </span>

      </div>

      {(fileName || progress.message) && (

        <div className="mt-2 truncate text-xs text-muted-foreground">
          {fileName || progress.message}
        </div>

      )}

    </div>
  )
}

function resolveFileName(
  sourcePath?: string | null
): string | null {

  if (!sourcePath) return null

  const normalized =
    sourcePath.replaceAll(
      "\\",
      "/"
    )

  const index =
    normalized.lastIndexOf(
      "/"
    )

  return index >= 0
    ? normalized.substring(
        index + 1
      )
    : normalized
}