import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  LoaderCircle
} from "lucide-react"

import {
  useState
} from "react"

import {
  useRagStore
} from "@/stores/ragStore"

export function RagContextPanel() {

  const contexts =
    useRagStore(
      state => state.contexts
    )

  const running =
    useRagStore(
      state => state.running
    )

  if (
    contexts.length === 0 &&
    !running
  ) {
    return null
  }

  return (
    <div
      className="
        border-t
        bg-muted/10
        px-4
        py-3
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-5xl
          flex-col
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
          "
        >
          {
            running
              ? (
                <LoaderCircle
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />
              )
              : (
                <CheckCircle2
                  className="
                    h-4
                    w-4
                  "
                />
              )
          }

          <BookOpen
            className="
              h-4
              w-4
            "
          />

          <span>
            {
              running
                ? "RAG 문맥을 검색하고 있습니다."
                : `RAG 문맥 ${contexts.length}건`
            }
          </span>
        </div>

        {
          contexts.length > 0 && (
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              {
                contexts.map(
                  (
                    context,
                    index
                  ) => (
                    <RagContextItem
                      key={
                        `${context.runId}-${index}`
                      }
                      title={
                        context.title
                      }
                      text={
                        context.text
                      }
                      sourcePath={
                        context.sourcePath
                      }
                      score={
                        context.score
                      }
                    />
                  )
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

interface RagContextItemProps {

  title: string

  text: string

  sourcePath?:
    string | null

  score?:
    number | null
}

function RagContextItem({
  title,
  text,
  sourcePath,
  score
}: RagContextItemProps) {

  const [
    expanded,
    setExpanded
  ] = useState(false)

  return (
    <div
      className="
        overflow-hidden
        rounded-md
        border
        bg-background
      "
    >
      <button
        type="button"
        onClick={
          () =>
            setExpanded(
              value => !value
            )
        }
        className="
          flex
          w-full
          items-center
          gap-2
          px-3
          py-2
          text-left
          hover:bg-muted/50
        "
      >
        {
          expanded
            ? (
              <ChevronDown
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />
            )
            : (
              <ChevronRight
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />
            )
        }

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              truncate
              text-sm
              font-medium
            "
          >
            {title}
          </div>

          {
            sourcePath && (
              <div
                className="
                  mt-0.5
                  flex
                  items-center
                  gap-1
                  text-xs
                  text-muted-foreground
                "
              >
                <FileText
                  className="
                    h-3
                    w-3
                    shrink-0
                  "
                />

                <span
                  className="
                    truncate
                  "
                >
                  {sourcePath}
                </span>
              </div>
            )
          }
        </div>

        {
          score != null && (
            <div
              className="
                shrink-0
                rounded
                bg-muted
                px-2
                py-1
                text-xs
                tabular-nums
                text-muted-foreground
              "
            >
              {formatScore(score)}
            </div>
          )
        }
      </button>

      {
        expanded && (
          <div
            className="
              border-t
              px-3
              py-3
            "
          >
            <pre
              className="
                whitespace-pre-wrap
                break-words
                font-sans
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {text}
            </pre>
          </div>
        )
      }
    </div>
  )
}

function formatScore(
  score: number
): string {

  return score.toFixed(4)
}