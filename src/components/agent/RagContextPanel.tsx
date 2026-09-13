import {
  BookOpenText,
  FileText,
  LoaderCircle,
  Search
} from "lucide-react"

import {
  useRagStore
} from "@/stores/ragStore"

export function RagContextPanel() {

  const contexts =
    useRagStore(
      state =>
        state.contexts
    )

  const running =
    useRagStore(
      state =>
        state.running
    )

  const hasContexts =
    contexts.length > 0

  if (
    !running &&
    !hasContexts
  ) {

    return null
  }

  return (
    <div
      className="
        shrink-0
        border-t
        border-border/80
        bg-[var(--goms-surface-subtle)]
        px-5
        py-4
        max-sm:px-3
        max-sm:py-3
      "
    >
      <section
        className="
          overflow-hidden
          rounded-[var(--goms-radius-lg)]
          border
          border-[color-mix(in_srgb,var(--goms-violet)_18%,var(--goms-border))]
          bg-card
          shadow-[var(--goms-shadow-xs)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-border/80
            bg-[color-mix(in_srgb,var(--goms-violet)_6%,var(--goms-surface))]
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-[var(--goms-radius-sm)]
                bg-[color-mix(in_srgb,var(--goms-violet)_10%,transparent)]
                text-[var(--goms-violet)]
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
                    <BookOpenText
                      className="
                        size-4
                      "
                    />
                  )
              }
            </div>


            <div
              className="
                min-w-0
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    text-sm
                    font-bold
                    text-foreground
                  "
                >
                  RAG Context
                </h3>

                {
                  running && (
                    <span
                      className="
                        rounded-[var(--goms-radius-round)]
                        bg-[color-mix(in_srgb,var(--goms-violet)_10%,transparent)]
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                        text-[var(--goms-violet)]
                      "
                    >
                      검색 중
                    </span>
                  )
                }
              </div>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-muted-foreground
                "
              >
                현재 질의와 관련된 프로젝트 문서
              </p>
            </div>
          </div>


          {
            hasContexts && (
              <span
                className="
                  shrink-0
                  rounded-[var(--goms-radius-round)]
                  bg-[var(--goms-primary-soft)]
                  px-2.5
                  py-1
                  text-[11px]
                  font-bold
                  text-primary
                "
              >
                {
                  contexts.length
                }개
              </span>
            )
          }
        </div>


        {
          running &&
          !hasContexts && (
            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-4
                text-sm
                text-muted-foreground
              "
            >
              <Search
                className="
                  size-4
                  shrink-0
                  text-[var(--goms-violet)]
                "
              />

              관련 문서를 검색하고 있습니다.
            </div>
          )
        }


        {
          hasContexts && (
            <div
              className="
                flex
                max-h-[360px]
                flex-col
                gap-2
                overflow-y-auto
                p-3
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
                        createContextKey(
                          context.sourcePath,
                          index
                        )
                      }
                      index={
                        index
                      }
                      sourcePath={
                        context.sourcePath
                      }
                      score={
                        context.score
                      }
                      content={
                        context.text
                      }
                    />
                  )
                )
              }

            </div>
          )
        }
      </section>
    </div>
  )
}


interface RagContextItemProps {

  index: number

  sourcePath?: string | null

  score?: number | null

  content?: string | null
}

function RagContextItem({
  index,
  sourcePath,
  score,
  content
}: RagContextItemProps) {

  return (
    <article
      className="
        rounded-[var(--goms-radius-md)]
        border
        border-border
        bg-[var(--goms-surface-subtle)]
        px-4
        py-3
        transition-colors
        hover:border-primary/20
        hover:bg-[var(--goms-primary-soft)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-2.5
          "
        >
          <div
            className="
              flex
              size-7
              shrink-0
              items-center
              justify-center
              rounded-[var(--goms-radius-sm)]
              bg-[color-mix(in_srgb,var(--goms-violet)_10%,transparent)]
              text-[var(--goms-violet)]
            "
          >
            <FileText
              className="
                size-3.5
              "
            />
          </div>


          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.06em]
                text-muted-foreground
              "
            >
              Context {
                index + 1
              }
            </div>

            <div
              className="
                mt-0.5
                truncate
                font-mono
                text-[11px]
                font-semibold
                text-foreground
              "
              title={sourcePath ?? undefined}
            >
              {
                sourcePath ||
                "프로젝트 문서"
              }
            </div>
          </div>
        </div>


        {
          typeof score ===
          "number" && (
            <span
              className="
                shrink-0
                rounded-[var(--goms-radius-round)]
                bg-[var(--goms-primary-soft)]
                px-2
                py-0.5
                font-mono
                text-[10px]
                font-bold
                text-primary
              "
              title="RAG similarity score"
            >
              {
                formatScore(
                  score
                )
              }
            </span>
          )
        }
      </div>


      {
        content && (
          <p
            className="
              mt-3
              whitespace-pre-wrap
              break-words
              text-left
              text-xs
              leading-5
              text-[var(--goms-text-secondary)]
            "
          >
            {
              content
            }
          </p>
        )
      }
    </article>
  )
}


function createContextKey(
  sourcePath: string | null | undefined,
  index: number
): string {

  return `${sourcePath ?? "rag-context"}-${index}`
}


function formatScore(
  score: number
): string {

  if (
    !Number.isFinite(
      score
    )
  ) {

    return "-"
  }

  return score.toFixed(
    3
  )
}