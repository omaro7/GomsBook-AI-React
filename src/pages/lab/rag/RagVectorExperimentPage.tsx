import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import {
  AlertCircle,
  ArrowRight,
  Braces,
  Check,
  Clipboard,
  FileJson,
  Search,
  Target
} from "lucide-react"

import {
  Link
} from "react-router-dom"


interface RetrievalSummary {
  evaluatedCases: number
  hitCount: number
  hitRateAtK: number
  averageRecallAtK: number
  meanReciprocalRank: number
}


interface AnswerSummary {
  evaluatedCases: number
  averageScore: number
}


interface RetrievalResult {
  applicable: boolean
  hitAtK: boolean
  recallAtK: number
  mrr: number
}


interface RetrievedDocument {
  chunkId: string
  sourcePath: string
  title: string
  rank: number
  score: number
  retrievalSource: string
  vectorScore?: number
  graphScore?: number
  graphWeight?: number
  finalScore: number
  metadata?: Record<string, string>
}


interface EvaluationEntry {
  caseId: string
  question: string
  overallScore: number
  retrieval?: RetrievalResult
  expectedDocuments: string[]
  retrievedDocuments: RetrievedDocument[]
}


interface RagEvaluationReport {
  datasetName: string
  averageScore: number
  retrievalSummary: RetrievalSummary
  answerSummary?: AnswerSummary
  entries: EvaluationEntry[]
}


const REPORT_URL =
  "/lab/rag/report/vector-only-v1/rag-lunchwork_seoul-vector-only-v1-report.json"


export function RagVectorExperimentPage() {

  const [
    report,
    setReport
  ] =
    useState<RagEvaluationReport | null>(
      null
    )

  const [
    loading,
    setLoading
  ] =
    useState(
      true
    )

  const [
    error,
    setError
  ] =
    useState<string | null>(
      null
    )


  useEffect(
    () => {

      const controller =
        new AbortController()


      async function load() {

        setLoading(
          true
        )

        setError(
          null
        )


        try {

          const response =
            await fetch(
              REPORT_URL,
              {
                signal:
                  controller.signal
              }
            )


          if (
            !response.ok
          ) {

            throw new Error(
              `Vector Report 조회에 실패했습니다. HTTP ${response.status}`
            )
          }


          const data =
            await response.json() as RagEvaluationReport


          setReport(
            data
          )

        } catch (
          reason
        ) {

          if (
            reason instanceof DOMException &&
            reason.name === "AbortError"
          ) {

            return
          }


          setError(
            resolveErrorMessage(
              reason
            )
          )

        } finally {

          setLoading(
            false
          )
        }
      }


      load()


      return () => {

        controller.abort()
      }
    },
    []
  )


  if (
    loading
  ) {

    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    )
  }


  if (
    error ||
    !report
  ) {

    return (
      <PageShell>
        <ErrorState
          message={
            error ??
            "Vector Report를 불러올 수 없습니다."
          }
        />
      </PageShell>
    )
  }


  return (
    <PageShell>

      <VectorHeader
        report={
          report
        }
      />


      <HypothesisSection />


      <ExperimentSection
        report={
          report
        }
      />


      <ResultSection
        report={
          report
        }
      />


      <FailureSection
        report={
          report
        }
      />


      <InterpretationSection />


      <NextHypothesisSection />


      <RawJsonSection
        report={
          report
        }
      />

    </PageShell>
  )
}


function PageShell({
  children
}: {
  children: ReactNode
}) {

  return (
    <main
      className="
        min-h-full
        bg-background
        px-5
        pb-20
        pt-10
        text-foreground
        max-sm:px-4
        max-sm:pt-7
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1180px]
          flex-col
          gap-12
        "
      >
        {children}
      </div>
    </main>
  )
}


function VectorHeader({
  report
}: {
  report: RagEvaluationReport
}) {

  return (
    <section>
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-[var(--goms-primary-soft)]
          px-3
          py-1.5
          text-xs
          font-black
          tracking-[0.08em]
          text-primary
        "
      >
        <Target
          className="
            size-3.5
          "
        />

        VECTOR · BASELINE
      </div>


      <h1
        className="
          mt-4
          text-[clamp(2rem,4vw,3.4rem)]
          font-black
          leading-[1.08]
          tracking-[-0.05em]
        "
      >
        VECTOR_ONLY_V1
      </h1>


      <p
        className="
          mt-4
          max-w-3xl
          text-base
          leading-7
          text-muted-foreground
        "
      >
        Semantic Vector Retrieval만 사용하여
        Golden Dataset의 기준 성능을 측정합니다.
        이후 Graph와 Hybrid 실험은 이 결과를
        Baseline으로 비교합니다.
      </p>


      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-2
        "
      >
        <InfoPill>
          Dataset · {report.datasetName}
        </InfoPill>

        <InfoPill>
          Retrieval · VECTOR_ONLY
        </InfoPill>

        <InfoPill>
          Top-K · 5
        </InfoPill>

        <InfoPill>
          Baseline
        </InfoPill>
      </div>
    </section>
  )
}


function HypothesisSection() {

  return (
    <section>
      <SectionHeader
        kicker="01 · HYPOTHESIS"
        title="가설"
        description="첫 실험에서는 추가적인 구조 정보 없이 Vector Retrieval 자체의 기준 성능을 확인합니다."
      />


      <div
        className="
          rounded-[var(--goms-radius-lg)]
          border
          border-primary/20
          bg-[var(--goms-primary-soft)]
          p-7
        "
      >
        <div
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.08em]
            text-primary
          "
        >
          Hypothesis
        </div>


        <p
          className="
            mt-3
            max-w-4xl
            text-xl
            font-black
            leading-8
            tracking-[-0.025em]
          "
        >
          Embedding 기반 Vector Search만으로도
          의미 기반 질문의 Expected Document를
          Top-5 안에서 일정 수준 이상 검색할 수 있을 것이다.
        </p>
      </div>
    </section>
  )
}


function ExperimentSection({
  report
}: {
  report: RagEvaluationReport
}) {

  return (
    <section>
      <SectionHeader
        kicker="02 · EXPERIMENT"
        title="실험 조건"
        description="이 결과를 이후 모든 Retrieval 실험의 비교 기준으로 사용합니다."
      />


      <div
        className="
          grid
          grid-cols-[1.2fr_0.8fr]
          gap-5
          max-lg:grid-cols-1
        "
      >
        <div
          className="
            rounded-[var(--goms-radius-lg)]
            border
            border-border
            bg-card
            p-6
            shadow-[var(--goms-shadow-xs)]
          "
        >
          <ConfigRow
            label="Experiment ID"
            value="VECTOR_ONLY_V1"
          />

          <ConfigRow
            label="Retrieval Mode"
            value="VECTOR_ONLY"
          />

          <ConfigRow
            label="Embedding Model"
            value="nomic-embed-text"
          />

          <ConfigRow
            label="Final Top-K"
            value="5"
          />

          <ConfigRow
            label="Graph"
            value="OFF"
          />

          <ConfigRow
            label="Hybrid Fusion"
            value="OFF"
          />

          <ConfigRow
            label="Dataset"
            value={
              report.datasetName
            }
            last
          />
        </div>


        <div
          className="
            rounded-[var(--goms-radius-lg)]
            bg-[linear-gradient(145deg,#102a50,#173865_58%,#2457e6)]
            p-7
            text-white
            shadow-[var(--goms-shadow-md)]
          "
        >
          <div
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.1em]
              text-white/60
            "
          >
            BASELINE MODEL
          </div>


          <div
            className="
              mt-6
              flex
              flex-col
              items-center
              gap-3
            "
          >
            <FlowBox>
              Question
            </FlowBox>

            <FlowArrow />

            <FlowBox>
              Embedding
            </FlowBox>

            <FlowArrow />

            <FlowBox>
              Vector Search
            </FlowBox>

            <FlowArrow />

            <FlowBox strong>
              Final Top-5
            </FlowBox>
          </div>
        </div>
      </div>
    </section>
  )
}


function ResultSection({
  report
}: {
  report: RagEvaluationReport
}) {

  const summary =
    report.retrievalSummary

  const missCount =
    summary.evaluatedCases -
    summary.hitCount


  return (
    <section>
      <SectionHeader
        kicker="03 · RESULT"
        title="Baseline 평가 결과"
        description="Retrieval Metric을 Primary Metric으로 사용하고 Answer Score는 Secondary Metric으로 관리합니다."
      />


      <div
        className="
          grid
          grid-cols-4
          gap-4
          max-lg:grid-cols-2
          max-sm:grid-cols-1
        "
      >
        <MetricCard
          label="Hit Rate@5"
          value={
            formatPercentage(
              summary.hitRateAtK
            )
          }
          description={
            `${summary.hitCount} / ${summary.evaluatedCases} HIT`
          }
          primary
        />

        <MetricCard
          label="Average Recall@5"
          value={
            formatPercentage(
              summary.averageRecallAtK
            )
          }
          description="Expected Document Recall"
        />

        <MetricCard
          label="MRR"
          value={
            summary.meanReciprocalRank.toFixed(
              4
            )
          }
          description="Mean Reciprocal Rank"
        />

        <MetricCard
          label="MISS"
          value={
            String(
              missCount
            )
          }
          description={
            `${summary.evaluatedCases} Case 기준`
          }
          warning
        />
      </div>


      <div
        className="
          mt-5
          rounded-[var(--goms-radius-lg)]
          border
          border-border
          bg-card
          p-6
          shadow-[var(--goms-shadow-xs)]
        "
      >
        <div
          className="
            grid
            grid-cols-3
            gap-5
            max-md:grid-cols-1
          "
        >
          <ResultItem
            label="Evaluated Cases"
            value={
              String(
                summary.evaluatedCases
              )
            }
          />

          <ResultItem
            label="HIT"
            value={
              String(
                summary.hitCount
              )
            }
          />

          <ResultItem
            label="Answer Score"
            value={
              (
                report.answerSummary?.averageScore ??
                report.averageScore
              ).toFixed(
                4
              )
            }
          />
        </div>
      </div>
    </section>
  )
}


function FailureSection({
  report
}: {
  report: RagEvaluationReport
}) {

  const [
    query,
    setQuery
  ] =
    useState(
      ""
    )


  const misses =
    useMemo(
      () =>
        report.entries.filter(
          entry =>
            entry.retrieval?.applicable ===
              true &&
            entry.retrieval.hitAtK ===
              false
        ),
      [
        report.entries
      ]
    )


  const filteredMisses =
    useMemo(
      () => {

        const normalized =
          query
            .trim()
            .toLowerCase()


        if (
          !normalized
        ) {

          return misses
        }


        return misses.filter(
          entry =>
            `${entry.caseId} ${entry.question}`
              .toLowerCase()
              .includes(
                normalized
              )
        )
      },
      [
        misses,
        query
      ]
    )


  return (
    <section>
      <SectionHeader
        kicker="04 · FAILURE ANALYSIS"
        title="Baseline MISS Cases"
        description="Vector Search만으로 Expected Document가 Final Top-5에 진입하지 못한 Case입니다."
      />


      <div
        className="
          mb-4
          max-w-md
        "
      >
        <div
          className="
            relative
          "
        >
          <Search
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            value={
              query
            }
            onChange={
              event =>
                setQuery(
                  event.target.value
                )
            }
            placeholder="MISS Case 검색"
            className="
              h-10
              w-full
              rounded-[var(--goms-radius-sm)]
              border
              border-border
              bg-card
              pl-9
              pr-3
              text-sm
              outline-none
              focus:border-primary/50
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </div>
      </div>


      <div
        className="
          overflow-hidden
          rounded-[var(--goms-radius-lg)]
          border
          border-border
          bg-card
          shadow-[var(--goms-shadow-xs)]
        "
      >
        {
          filteredMisses.map(
            (
              entry,
              index
            ) => (
              <FailureCase
                key={
                  entry.caseId
                }
                entry={
                  entry
                }
                first={
                  index ===
                  0
                }
              />
            )
          )
        }


        {
          filteredMisses.length ===
          0
            ? (
              <div
                className="
                  px-6
                  py-12
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                조건에 맞는 MISS Case가 없습니다.
              </div>
            )
            : null
        }
      </div>
    </section>
  )
}


function FailureCase({
  entry,
  first
}: {
  entry: EvaluationEntry
  first: boolean
}) {

  return (
    <div
      className={`
        grid
        grid-cols-[180px_1fr_auto]
        gap-5
        px-5
        py-5
        max-lg:grid-cols-1
        ${
          first
            ? ""
            : "border-t border-border"
        }
      `}
    >
      <div>
        <div
          className="
            font-mono
            text-xs
            font-black
          "
        >
          {entry.caseId}
        </div>

        <span
          className="
            mt-2
            inline-flex
            rounded-full
            bg-red-50
            px-2.5
            py-1
            text-[10px]
            font-black
            text-red-700
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          MISS
        </span>
      </div>


      <div>
        <p
          className="
            text-sm
            font-bold
            leading-6
          "
        >
          {entry.question}
        </p>


        <div
          className="
            mt-3
            flex
            flex-wrap
            gap-2
          "
        >
          {
            entry.expectedDocuments.map(
              document => (
                <code
                  key={
                    document
                  }
                  className="
                    rounded-[var(--goms-radius-sm)]
                    bg-muted
                    px-2.5
                    py-1
                    font-mono
                    text-[11px]
                    text-primary
                  "
                >
                  {document}
                </code>
              )
            )
          }
        </div>
      </div>


      <div
        className="
          text-right
          max-lg:text-left
        "
      >
        <div
          className="
            text-[10px]
            font-bold
            uppercase
            text-muted-foreground
          "
        >
          MRR
        </div>

        <div
          className="
            mt-1
            font-mono
            text-sm
            font-black
            text-red-600
          "
        >
          {
            entry.retrieval?.mrr.toFixed(
              4
            ) ??
            "-"
          }
        </div>
      </div>
    </div>
  )
}


function InterpretationSection() {

  return (
    <section>
      <SectionHeader
        kicker="05 · INTERPRETATION"
        title="결과 해석"
        description="Vector Baseline이 제공한 기준과 이후 실험에서 해결해야 할 문제를 정리합니다."
      />


      <div
        className="
          grid
          grid-cols-3
          gap-4
          max-lg:grid-cols-1
        "
      >
        <InsightCard
          number="01"
          title="기준 성능 확보"
          description="34개 Retrieval 평가 Case 중 31개가 Top-5에서 Expected Document를 찾았습니다."
        />

        <InsightCard
          number="02"
          title="Coverage 한계 확인"
          description="Semantic Similarity만으로는 일부 질문의 Expected Document를 Final Top-5에 포함하지 못했습니다."
        />

        <InsightCard
          number="03"
          title="Ranking 개선 필요"
          description="Hit 여부뿐 아니라 MRR을 높이기 위해 문서 구조 정보를 추가로 활용할 필요가 있습니다."
        />
      </div>
    </section>
  )
}


function NextHypothesisSection() {

  return (
    <section>
      <SectionHeader
        kicker="06 · NEXT HYPOTHESIS"
        title="다음 실험"
        description="Baseline에서 확인한 한계를 Graph Retrieval로 확장해 검증합니다."
      />


      <div
        className="
          rounded-[var(--goms-radius-lg)]
          border
          border-border
          bg-card
          p-7
          shadow-[var(--goms-shadow-xs)]
        "
      >
        <div
          className="
            grid
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-5
            max-md:grid-cols-1
          "
        >
          <div>
            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.08em]
                text-muted-foreground
              "
            >
              Observed Problem
            </div>

            <p
              className="
                mt-2
                text-base
                font-bold
                leading-7
              "
            >
              Vector Similarity만으로는
              문서 간 구조적 관계를 활용할 수 없습니다.
            </p>
          </div>


          <ArrowRight
            className="
              size-5
              text-primary
              max-md:rotate-90
            "
          />


          <div>
            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.08em]
                text-primary
              "
            >
              Next Hypothesis
            </div>

            <p
              className="
                mt-2
                text-base
                font-bold
                leading-7
              "
            >
              EPUB 구조 정보를 Graph Candidate로 추가하면
              Retrieval Coverage와 Ranking이 개선될 수 있습니다.
            </p>
          </div>
        </div>


        <div
          className="
            mt-6
            flex
            justify-end
          "
        >
          <Link
            to="/lab/rag/graph"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              text-primary
              hover:underline
            "
          >
            Graph V1 실험 보기

            <ArrowRight
              className="
                size-4
              "
            />
          </Link>
        </div>
      </div>
    </section>
  )
}


function RawJsonSection({
  report
}: {
  report: RagEvaluationReport
}) {

  const [
    copied,
    setCopied
  ] =
    useState(
      false
    )


  const json =
    useMemo(
      () =>
        JSON.stringify(
          report,
          null,
          2
        ),
      [
        report
      ]
    )


  async function copyJson() {

    await navigator.clipboard.writeText(
      json
    )

    setCopied(
      true
    )


    window.setTimeout(
      () =>
        setCopied(
          false
        ),
      1500
    )
  }


  return (
    <section>
      <SectionHeader
        kicker="07 · RAW REPORT"
        title="Evaluation Report JSON"
        description="화면에 표시된 Metric과 Case 결과의 원본 Report를 직접 확인합니다."
      />


      <div
        className="
          overflow-hidden
          rounded-[var(--goms-radius-lg)]
          border
          border-border
          bg-[#0e1c2f]
          shadow-[var(--goms-shadow-sm)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-white/10
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <FileJson
              className="
                size-4
                shrink-0
                text-[#8bd3ff]
              "
            />

            <span
              className="
                truncate
                font-mono
                text-xs
                font-bold
                text-white/75
              "
            >
              rag-lunchwork_seoul-vector-only-v1-report.json
            </span>
          </div>


          <button
            type="button"
            onClick={
              copyJson
            }
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-[var(--goms-radius-sm)]
              border
              border-white/10
              bg-white/5
              px-3
              py-1.5
              text-xs
              font-bold
              text-white/75
              hover:bg-white/10
            "
          >
            {
              copied
                ? <Check className="size-3.5" />
                : <Clipboard className="size-3.5" />
            }

            {
              copied
                ? "Copied"
                : "Copy"
            }
          </button>
        </div>


        <pre
          className="
            max-h-[700px]
            overflow-auto
            p-5
            font-mono
            text-[12px]
            leading-6
            text-[#dfe9f7]
          "
        >
          {json}
        </pre>
      </div>
    </section>
  )
}


function SectionHeader({
  kicker,
  title,
  description
}: {
  kicker: string
  title: string
  description: string
}) {

  return (
    <div
      className="
        mb-5
      "
    >
      <div
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.09em]
          text-primary
        "
      >
        {kicker}
      </div>

      <h2
        className="
          mt-1
          text-[28px]
          font-black
          tracking-[-0.04em]
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2
          max-w-3xl
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </div>
  )
}


function InfoPill({
  children
}: {
  children: ReactNode
}) {

  return (
    <span
      className="
        rounded-[var(--goms-radius-sm)]
        border
        border-border
        bg-card
        px-3
        py-2
        text-xs
        font-bold
        text-muted-foreground
        shadow-[var(--goms-shadow-xs)]
      "
    >
      {children}
    </span>
  )
}


function ConfigRow({
  label,
  value,
  last = false
}: {
  label: string
  value: string
  last?: boolean
}) {

  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-6
        py-3.5
        ${
          last
            ? ""
            : "border-b border-dashed border-border"
        }
      `}
    >
      <span
        className="
          text-sm
          font-bold
          text-muted-foreground
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          font-mono
          text-sm
          font-black
        "
      >
        {value}
      </span>
    </div>
  )
}


function FlowBox({
  children,
  strong = false
}: {
  children: ReactNode
  strong?: boolean
}) {

  return (
    <div
      className={`
        w-full
        rounded-[var(--goms-radius-md)]
        border
        px-4
        py-3
        text-center
        text-sm
        font-black
        ${
          strong
            ? "border-white bg-white text-[#15345f]"
            : "border-white/20 bg-white/10"
        }
      `}
    >
      {children}
    </div>
  )
}


function FlowArrow() {

  return (
    <div
      className="
        text-sm
        font-black
        text-white/50
      "
    >
      ↓
    </div>
  )
}


function MetricCard({
  label,
  value,
  description,
  primary = false,
  warning = false
}: {
  label: string
  value: string
  description: string
  primary?: boolean
  warning?: boolean
}) {

  return (
    <article
      className="
        rounded-[var(--goms-radius-lg)]
        border
        border-border
        bg-card
        p-5
        shadow-[var(--goms-shadow-xs)]
      "
    >
      <div
        className="
          text-xs
          font-bold
          text-muted-foreground
        "
      >
        {label}
      </div>

      <div
        className={`
          mt-2
          text-[30px]
          font-black
          leading-none
          tracking-[-0.04em]
          ${
            primary
              ? "text-primary"
              : warning
                ? "text-amber-600"
                : ""
          }
        `}
      >
        {value}
      </div>

      <div
        className="
          mt-3
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        {description}
      </div>
    </article>
  )
}


function ResultItem({
  label,
  value
}: {
  label: string
  value: string
}) {

  return (
    <div>
      <div
        className="
          text-xs
          font-bold
          text-muted-foreground
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-xl
          font-black
          tracking-[-0.03em]
        "
      >
        {value}
      </div>
    </div>
  )
}


function InsightCard({
  number,
  title,
  description
}: {
  number: string
  title: string
  description: string
}) {

  return (
    <article
      className="
        rounded-[var(--goms-radius-lg)]
        border
        border-border
        bg-card
        p-6
        shadow-[var(--goms-shadow-xs)]
      "
    >
      <div
        className="
          flex
          size-9
          items-center
          justify-center
          rounded-[var(--goms-radius-sm)]
          bg-[var(--goms-primary-soft)]
          text-xs
          font-black
          text-primary
        "
      >
        {number}
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-black
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </article>
  )
}


function LoadingState() {

  return (
    <div
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
      "
    >
      <div
        className="
          text-center
        "
      >
        <div
          className="
            mx-auto
            size-8
            animate-spin
            rounded-full
            border-2
            border-border
            border-t-primary
          "
        />

        <p
          className="
            mt-4
            text-sm
            font-bold
            text-muted-foreground
          "
        >
          Vector Report를 불러오는 중입니다.
        </p>
      </div>
    </div>
  )
}


function ErrorState({
  message
}: {
  message: string
}) {

  return (
    <div
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
      "
    >
      <div
        className="
          max-w-lg
          rounded-[var(--goms-radius-lg)]
          border
          border-red-200
          bg-card
          p-7
          text-center
        "
      >
        <AlertCircle
          className="
            mx-auto
            size-7
            text-red-600
          "
        />

        <h2
          className="
            mt-4
            text-lg
            font-black
          "
        >
          Vector Report 조회 실패
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          {message}
        </p>
      </div>
    </div>
  )
}


function formatPercentage(
  value: number
): string {

  return `${(
    value *
    100
  ).toFixed(2)}%`
}


function resolveErrorMessage(
  reason: unknown
): string {

  if (
    reason instanceof Error
  ) {

    return reason.message
  }

  return "Vector Report 조회 중 오류가 발생했습니다."
}