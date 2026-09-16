import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import {
  AlertCircle,
  ArrowRight,
  Check,
  Clipboard,
  FileJson,
  GitMerge,
  Search
} from "lucide-react"

import {
  Link,
  useSearchParams
} from "react-router-dom"


type HybridVersion =
  | "v1"
  | "v2"


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
  expectedDocuments?: string[]
  retrievedDocuments?: RetrievedDocument[]
}


interface RagEvaluationReport {
  datasetName: string
  averageScore: number
  retrievalSummary: RetrievalSummary
  answerSummary?: AnswerSummary
  entries?: EvaluationEntry[]
}


interface HybridVersionDefinition {
  version: HybridVersion
  label: string
  experimentId: string
  title: string
  reportUrl: string
  previousLabel: string
  previousReportUrl: string
  vectorTopK: number
  graphTopK: number
  hypothesis: string
  changeSummary: string
  interpretation: string
  nextLabel: string
  nextHypothesis: string
  nextHref: string
}


interface TransitionSummary {
  missToHit: number
  hitToMiss: number
  hitToHit: number
  missToMiss: number
}


const HYBRID_VERSIONS: Record<
  HybridVersion,
  HybridVersionDefinition
> = {
  v1: {
    version: "v1",
    label: "V1",
    experimentId: "HYBRID_V1",
    title: "Top-5 + Top-5 Weighted RRF",
    reportUrl:
      "/lab/rag/report/hybrid-v1/rag-lunchwork_seoul-hybrid-v1-report.json",
    previousLabel:
      "VECTOR_GRAPH_V6",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v6/rag-lunchwork_seoul-vector-graph-v6-report.json",
    vectorTopK: 5,
    graphTopK: 5,
    hypothesis:
      "Vector Baseline과 최적화된 Vector Graph Branch를 독립적으로 검색한 뒤 Weighted RRF로 결합하면 두 Retrieval 방식의 장점을 동시에 활용할 수 있을 것이다.",
    changeSummary:
      "VECTOR_ONLY_V1 Top-5와 VECTOR_GRAPH_V6 Top-5 결과를 독립적으로 생성한 뒤 Weighted RRF로 Fusion합니다.",
    interpretation:
      "Hybrid V1은 Graph Retrieval을 Vector Ranking에 직접 섞는 대신 두 Retrieval Branch를 독립적으로 유지하고 최종 Rank 단계에서 결합하는 구조의 기준 실험입니다.",
    nextLabel:
      "HYBRID_V2",
    nextHypothesis:
      "Fusion 이전 Candidate Pool을 Top-5에서 Top-10으로 확대하면 기존 Ranking을 훼손하지 않으면서 Stable Miss 일부를 추가로 회수할 수 있을 것이다.",
    nextHref:
      "/lab/rag/hybrid?version=v2"
  },

  v2: {
    version: "v2",
    label: "V2",
    experimentId: "HYBRID_V2",
    title: "Top-10 + Top-10 Weighted RRF",
    reportUrl:
      "/lab/rag/report/hybrid-v2/rag-lunchwork_seoul-hybrid-v2-report.json",
    previousLabel:
      "HYBRID_V1",
    previousReportUrl:
      "/lab/rag/report/hybrid-v1/rag-lunchwork_seoul-hybrid-v1-report.json",
    vectorTopK: 10,
    graphTopK: 10,
    hypothesis:
      "Vector와 Graph Branch의 Candidate Pool을 각각 Top-10으로 확대하면 RRF가 더 넓은 후보군을 재평가하여 Retrieval Coverage를 개선할 수 있을 것이다.",
    changeSummary:
      "Fusion 구조와 Weight는 유지하고 Vector 및 Graph Candidate Pool만 Top-5에서 Top-10으로 확대합니다.",
    interpretation:
      "Hybrid V2는 Fusion 알고리즘 자체를 변경하지 않고 Candidate Recall을 확대하는 실험입니다. 개선 여부와 함께 기존 HIT의 Regression 발생 여부를 동시에 확인하는 것이 핵심입니다.",
    nextLabel:
      "FINAL RESULT",
    nextHypothesis:
      "HYBRID_V2를 최종 Candidate로 두고 Vector Baseline부터 Graph V1~V6, Hybrid V1~V2 전체 실험의 성능 변화와 Remaining Failure를 종합 검증합니다.",
    nextHref:
      "/lab/rag/result"
  }
}


const HYBRID_VERSION_ORDER: HybridVersion[] = [
  "v1",
  "v2"
]


export function RagHybridExperimentPage() {

  const [
    searchParams,
    setSearchParams
  ] =
    useSearchParams()


  const activeVersion =
    resolveHybridVersion(
      searchParams.get(
        "version"
      )
    )


  const definition =
    HYBRID_VERSIONS[
      activeVersion
    ]


  const [
    report,
    setReport
  ] =
    useState<RagEvaluationReport | null>(
      null
    )


  const [
    previousReport,
    setPreviousReport
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

        setReport(
          null
        )

        setPreviousReport(
          null
        )


        try {

          const [
            current,
            previous
          ] =
            await Promise.all([
              fetchReport(
                definition.reportUrl,
                controller.signal
              ),
              fetchReport(
                definition.previousReportUrl,
                controller.signal
              )
            ])


          setReport(
            current
          )

          setPreviousReport(
            previous
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
    [
      definition.reportUrl,
      definition.previousReportUrl
    ]
  )


  function changeVersion(
    version: HybridVersion
  ) {

    setSearchParams(
      {
        version
      }
    )
  }


  if (
    loading
  ) {

    return (
      <PageShell>
        <VersionTabs
          activeVersion={
            activeVersion
          }
          onChange={
            changeVersion
          }
        />

        <LoadingState
          experimentId={
            definition.experimentId
          }
        />
      </PageShell>
    )
  }


  if (
    error ||
    !report
  ) {

    return (
      <PageShell>
        <VersionTabs
          activeVersion={
            activeVersion
          }
          onChange={
            changeVersion
          }
        />

        <ErrorState
          message={
            error ??
            "Hybrid Report를 불러올 수 없습니다."
          }
        />
      </PageShell>
    )
  }


  return (
    <PageShell>

      <HybridHeader
        definition={
          definition
        }
        report={
          report
        }
      />


      <VersionTabs
        activeVersion={
          activeVersion
        }
        onChange={
          changeVersion
        }
      />


      <HypothesisSection
        definition={
          definition
        }
      />


      <ExperimentSection
        definition={
          definition
        }
      />


      <ResultSection
        report={
          report
        }
      />


      <ComparisonSection
        definition={
          definition
        }
        report={
          report
        }
        previousReport={
          previousReport
        }
      />


      <RegressionSection
        report={
          report
        }
        previousReport={
          previousReport
        }
      />


      <FailureSection
        report={
          report
        }
      />


      <InterpretationSection
        definition={
          definition
        }
      />


      <NextHypothesisSection
        definition={
          definition
        }
      />


      <RawJsonSection
        definition={
          definition
        }
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


function HybridHeader({
  definition,
  report
}: {
  definition: HybridVersionDefinition
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
          bg-emerald-50
          px-3
          py-1.5
          text-xs
          font-black
          tracking-[0.08em]
          text-emerald-700
          dark:bg-emerald-950/30
          dark:text-emerald-400
        "
      >
        <GitMerge
          className="
            size-3.5
          "
        />

        HYBRID · {definition.label}
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
        {definition.experimentId}
      </h1>


      <p
        className="
          mt-3
          text-lg
          font-bold
          text-foreground/80
        "
      >
        {definition.title}
      </p>


      <p
        className="
          mt-4
          max-w-3xl
          text-base
          leading-7
          text-muted-foreground
        "
      >
        Vector Baseline과 Vector Graph V6를
        독립적인 Retrieval Branch로 유지하고
        Weighted Reciprocal Rank Fusion으로
        최종 Ranking을 생성합니다.
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
          Vector · Top-{definition.vectorTopK}
        </InfoPill>

        <InfoPill>
          Graph · Top-{definition.graphTopK}
        </InfoPill>

        <InfoPill>
          Fusion · Weighted RRF
        </InfoPill>

        <InfoPill>
          Final · Top-5
        </InfoPill>
      </div>
    </section>
  )
}


function VersionTabs({
  activeVersion,
  onChange
}: {
  activeVersion: HybridVersion
  onChange: (
    version: HybridVersion
  ) => void
}) {

  return (
    <section
      className="
        border-b
        border-border
      "
      aria-label="Hybrid experiment versions"
    >
      <div
        className="
          flex
          gap-1
        "
      >
        {
          HYBRID_VERSION_ORDER.map(
            version => {

              const active =
                version ===
                activeVersion


              return (
                <button
                  key={
                    version
                  }
                  type="button"
                  onClick={
                    () =>
                      onChange(
                        version
                      )
                  }
                  className={`
                    relative
                    px-6
                    py-3
                    text-sm
                    font-black
                    transition-colors
                    ${
                      active
                        ? `
                          text-emerald-700
                          dark:text-emerald-400
                        `
                        : `
                          text-muted-foreground
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {
                    HYBRID_VERSIONS[
                      version
                    ].label
                  }


                  {
                    active
                      ? (
                        <span
                          className="
                            absolute
                            inset-x-2
                            bottom-0
                            h-0.5
                            rounded-full
                            bg-emerald-600
                          "
                        />
                      )
                      : null
                  }
                </button>
              )
            }
          )
        }
      </div>
    </section>
  )
}


function HypothesisSection({
  definition
}: {
  definition: HybridVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="01 · HYPOTHESIS"
        title="가설"
        description="Graph 실험에서 확보한 최종 Branch와 Vector Baseline을 Fusion하여 추가 개선 가능성을 검증합니다."
      />


      <div
        className="
          rounded-[var(--goms-radius-lg)]
          border
          border-emerald-200
          bg-emerald-50/50
          p-7
          dark:border-emerald-900
          dark:bg-emerald-950/10
        "
      >
        <div
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.08em]
            text-emerald-700
            dark:text-emerald-400
          "
        >
          {definition.experimentId}
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
          {definition.hypothesis}
        </p>


        <div
          className="
            mt-5
            border-t
            border-dashed
            border-emerald-200
            pt-4
            dark:border-emerald-900
          "
        >
          <div
            className="
              text-xs
              font-black
              text-muted-foreground
            "
          >
            변경사항
          </div>

          <p
            className="
              mt-1
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {definition.changeSummary}
          </p>
        </div>
      </div>
    </section>
  )
}


function ExperimentSection({
  definition
}: {
  definition: HybridVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="02 · EXPERIMENT"
        title="Hybrid Retrieval 구조"
        description="Vector와 Graph 결과를 하나의 Score로 직접 혼합하지 않고 두 Branch를 독립 실행한 후 Ranking 단계에서 결합합니다."
      />


      <div
        className="
          grid
          grid-cols-[0.8fr_1.2fr]
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
            value={
              definition.experimentId
            }
          />

          <ConfigRow
            label="Vector Branch"
            value="VECTOR_ONLY_V1"
          />

          <ConfigRow
            label="Graph Branch"
            value="VECTOR_GRAPH_V6"
          />

          <ConfigRow
            label="Vector Candidate"
            value={
              `Top-${definition.vectorTopK}`
            }
          />

          <ConfigRow
            label="Graph Candidate"
            value={
              `Top-${definition.graphTopK}`
            }
          />

          <ConfigRow
            label="Fusion"
            value="Weighted RRF"
          />

          <ConfigRow
            label="Final Top-K"
            value="5"
            last
          />
        </div>


        <div
          className="
            rounded-[var(--goms-radius-lg)]
            bg-[linear-gradient(145deg,#083b36,#0a5a4c_58%,#0f9f78)]
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
            WEIGHTED RRF PIPELINE
          </div>


          <div
            className="
              mt-6
              grid
              grid-cols-[1fr_auto_1fr]
              items-center
              gap-3
              max-sm:grid-cols-1
            "
          >
            <FlowBox>
              VECTOR_ONLY_V1
              <small>
                Top-{definition.vectorTopK}
              </small>
            </FlowBox>


            <span
              className="
                text-center
                text-white/50
                max-sm:rotate-90
              "
            >
              +
            </span>


            <FlowBox>
              VECTOR_GRAPH_V6
              <small>
                Top-{definition.graphTopK}
              </small>
            </FlowBox>
          </div>


          <FlowArrow />


          <FlowBox>
            Weighted RRF
          </FlowBox>


          <FlowArrow />


          <FlowBox strong>
            Final Top-5
          </FlowBox>
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
        title="Retrieval 평가 결과"
        description="현재 Hybrid 버전의 Retrieval 성능을 실제 Report Summary에서 표시합니다."
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
            max-sm:grid-cols-1
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
            label="Retrieval HIT"
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


function ComparisonSection({
  definition,
  report,
  previousReport
}: {
  definition: HybridVersionDefinition
  report: RagEvaluationReport
  previousReport: RagEvaluationReport | null
}) {

  if (
    !previousReport
  ) {

    return null
  }


  const before =
    previousReport.retrievalSummary

  const after =
    report.retrievalSummary


  return (
    <section>
      <SectionHeader
        kicker="04 · PREVIOUS VERSION COMPARISON"
        title={`${definition.previousLabel} → ${definition.experimentId}`}
        description="직전 Candidate와 현재 Hybrid 실험의 Retrieval Metric을 동일 조건에서 비교합니다."
      />


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
        <ComparisonHeader
          previous={
            definition.previousLabel
          }
          current={
            definition.experimentId
          }
        />


        <ComparisonRow
          label="Hit Rate@5"
          before={
            formatPercentage(
              before.hitRateAtK
            )
          }
          after={
            formatPercentage(
              after.hitRateAtK
            )
          }
          delta={
            formatPercentagePointDelta(
              after.hitRateAtK -
              before.hitRateAtK
            )
          }
        />


        <ComparisonRow
          label="Recall@5"
          before={
            formatPercentage(
              before.averageRecallAtK
            )
          }
          after={
            formatPercentage(
              after.averageRecallAtK
            )
          }
          delta={
            formatPercentagePointDelta(
              after.averageRecallAtK -
              before.averageRecallAtK
            )
          }
        />


        <ComparisonRow
          label="MRR"
          before={
            before.meanReciprocalRank.toFixed(
              4
            )
          }
          after={
            after.meanReciprocalRank.toFixed(
              4
            )
          }
          delta={
            formatDecimalDelta(
              after.meanReciprocalRank -
              before.meanReciprocalRank
            )
          }
        />


        <ComparisonRow
          label="HIT"
          before={
            String(
              before.hitCount
            )
          }
          after={
            String(
              after.hitCount
            )
          }
          delta={
            formatIntegerDelta(
              after.hitCount -
              before.hitCount
            )
          }
          last
        />
      </div>
    </section>
  )
}


function RegressionSection({
  report,
  previousReport
}: {
  report: RagEvaluationReport
  previousReport: RagEvaluationReport | null
}) {

  const transitions =
    useMemo(
      () =>
        calculateTransitions(
          previousReport,
          report
        ),
      [
        previousReport,
        report
      ]
    )


  if (
    !previousReport
  ) {

    return null
  }


  return (
    <section>
      <SectionHeader
        kicker="05 · REGRESSION ANALYSIS"
        title="Case Transition"
        description="평균 Metric뿐 아니라 Case 단위로 어떤 질문이 개선되거나 악화되었는지 확인합니다."
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
        <TransitionCard
          label="MISS → HIT"
          value={
            transitions.missToHit
          }
          description="Retrieval 개선"
          tone="success"
        />

        <TransitionCard
          label="HIT → MISS"
          value={
            transitions.hitToMiss
          }
          description="Retrieval Regression"
          tone="danger"
        />

        <TransitionCard
          label="HIT → HIT"
          value={
            transitions.hitToHit
          }
          description="안정적 HIT 유지"
        />

        <TransitionCard
          label="MISS → MISS"
          value={
            transitions.missToMiss
          }
          description="Remaining Failure"
          tone="warning"
        />
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
        (
          report.entries ??
          []
        ).filter(
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
        kicker="06 · FAILURE ANALYSIS"
        title="Remaining MISS Cases"
        description="Hybrid Retrieval에서도 Expected Document가 Final Top-5에 포함되지 않은 Case를 확인합니다."
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
                현재 버전에는 MISS Case가 없습니다.
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
        grid-cols-[170px_1fr_auto]
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
            (
              entry.expectedDocuments ??
              []
            ).map(
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


function InterpretationSection({
  definition
}: {
  definition: HybridVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="07 · INTERPRETATION"
        title="결과 해석"
        description="Hybrid 실험의 변경사항과 Retrieval 결과가 의미하는 바를 정리합니다."
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
            text-xs
            font-black
            uppercase
            tracking-[0.08em]
            text-emerald-700
            dark:text-emerald-400
          "
        >
          {definition.experimentId}
        </div>


        <p
          className="
            mt-3
            max-w-4xl
            text-base
            font-semibold
            leading-7
            text-foreground/85
          "
        >
          {definition.interpretation}
        </p>
      </div>
    </section>
  )
}


function NextHypothesisSection({
  definition
}: {
  definition: HybridVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="08 · NEXT HYPOTHESIS"
        title="다음 단계"
        description="현재 실험의 결론을 다음 실험 또는 최종 종합 결과로 연결합니다."
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
            grid-cols-[0.7fr_auto_1.3fr]
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
              Current
            </div>

            <div
              className="
                mt-2
                text-lg
                font-black
              "
            >
              {definition.experimentId}
            </div>
          </div>


          <ArrowRight
            className="
              size-5
              text-emerald-600
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
                text-emerald-700
                dark:text-emerald-400
              "
            >
              {definition.nextLabel}
            </div>

            <p
              className="
                mt-2
                text-sm
                font-semibold
                leading-6
              "
            >
              {definition.nextHypothesis}
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
            to={
              definition.nextHref
            }
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
            {definition.nextLabel} 보기

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
  definition,
  report
}: {
  definition: HybridVersionDefinition
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

    try {

      await navigator.clipboard.writeText(
        json
      )

      setCopied(
        true
      )


      window.setTimeout(
        () => {

          setCopied(
            false
          )
        },
        1500
      )

    } catch {

      setCopied(
        false
      )
    }
  }


  return (
    <section>
      <SectionHeader
        kicker="09 · RAW REPORT"
        title="Evaluation Report JSON"
        description="현재 Hybrid 실험에서 생성된 실제 평가 Report를 확인합니다."
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
              {
                resolveReportFileName(
                  definition.reportUrl
                )
              }
            </span>
          </div>


          <button
            type="button"
            onClick={
              copyJson
            }
            className="
              inline-flex
              shrink-0
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
              hover:text-white
            "
          >
            {
              copied
                ? (
                  <Check
                    className="
                      size-3.5
                    "
                  />
                )
                : (
                  <Clipboard
                    className="
                      size-3.5
                    "
                  />
                )
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
            max-h-[720px]
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
          text-emerald-700
          dark:text-emerald-400
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
        flex
        w-full
        flex-col
        items-center
        rounded-[var(--goms-radius-md)]
        border
        px-4
        py-3
        text-center
        text-sm
        font-black
        ${
          strong
            ? `
              border-white
              bg-white
              text-[#075247]
            `
            : `
              border-white/20
              bg-white/10
            `
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
        py-3
        text-center
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
              ? `
                text-emerald-700
                dark:text-emerald-400
              `
              : warning
                ? `
                  text-amber-600
                  dark:text-amber-400
                `
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


function ComparisonHeader({
  previous,
  current
}: {
  previous: string
  current: string
}) {

  return (
    <div
      className="
        grid
        grid-cols-[1.2fr_1fr_1fr_0.8fr]
        gap-4
        bg-muted/45
        px-5
        py-3
        text-[11px]
        font-black
        uppercase
        tracking-[0.05em]
        text-muted-foreground
        max-sm:grid-cols-[1.2fr_1fr_0.8fr]
      "
    >
      <span>
        Metric
      </span>

      <span>
        {previous}
      </span>

      <span
        className="
          max-sm:hidden
        "
      >
        {current}
      </span>

      <span>
        Delta
      </span>
    </div>
  )
}


function ComparisonRow({
  label,
  before,
  after,
  delta,
  last = false
}: {
  label: string
  before: string
  after: string
  delta: string
  last?: boolean
}) {

  const positive =
    delta.startsWith(
      "+"
    )

  const negative =
    delta.startsWith(
      "-"
    )


  return (
    <div
      className={`
        grid
        grid-cols-[1.2fr_1fr_1fr_0.8fr]
        gap-4
        px-5
        py-4
        text-sm
        max-sm:grid-cols-[1.2fr_1fr_0.8fr]
        ${
          last
            ? ""
            : "border-b border-border"
        }
      `}
    >
      <span
        className="
          font-bold
        "
      >
        {label}
      </span>

      <span
        className="
          font-mono
          text-muted-foreground
        "
      >
        {before}
      </span>

      <span
        className="
          font-mono
          font-black
          max-sm:hidden
        "
      >
        {after}
      </span>

      <span
        className={`
          font-mono
          font-black
          ${
            positive
              ? `
                text-emerald-600
                dark:text-emerald-400
              `
              : negative
                ? `
                  text-red-600
                  dark:text-red-400
                `
                : "text-muted-foreground"
          }
        `}
      >
        {delta}
      </span>
    </div>
  )
}


function TransitionCard({
  label,
  value,
  description,
  tone = "default"
}: {
  label: string
  value: number
  description: string
  tone?:
    | "default"
    | "success"
    | "warning"
    | "danger"
}) {

  const valueClassName =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-foreground"


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
          font-black
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
          ${valueClassName}
        `}
      >
        {value}
      </div>

      <div
        className="
          mt-2
          text-xs
          text-muted-foreground
        "
      >
        {description}
      </div>
    </article>
  )
}


function LoadingState({
  experimentId
}: {
  experimentId: string
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
            border-t-emerald-600
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
          {experimentId} Report를 불러오는 중입니다.
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
          Hybrid Report 조회 실패
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


async function fetchReport(
  url: string,
  signal: AbortSignal
): Promise<RagEvaluationReport> {

  const response =
    await fetch(
      url,
      {
        signal
      }
    )


  if (
    !response.ok
  ) {

    throw new Error(
      `Report 조회에 실패했습니다. HTTP ${response.status} · ${url}`
    )
  }


  const report =
    await response.json() as RagEvaluationReport


  return normalizeReport(
    report
  )
}


function normalizeReport(
  report: RagEvaluationReport
): RagEvaluationReport {

  return {
    ...report,

    entries:
      Array.isArray(
        report.entries
      )
        ? report.entries.map(
          entry => ({
            ...entry,

            expectedDocuments:
              Array.isArray(
                entry.expectedDocuments
              )
                ? entry.expectedDocuments
                : [],

            retrievedDocuments:
              Array.isArray(
                entry.retrievedDocuments
              )
                ? entry.retrievedDocuments
                : []
          })
        )
        : []
  }
}


function calculateTransitions(
  previousReport: RagEvaluationReport | null,
  currentReport: RagEvaluationReport
): TransitionSummary {

  const result: TransitionSummary = {
    missToHit: 0,
    hitToMiss: 0,
    hitToHit: 0,
    missToMiss: 0
  }


  if (
    !previousReport
  ) {

    return result
  }


  const previousEntries =
    new Map(
      (
        previousReport.entries ??
        []
      ).map(
        entry => [
          entry.caseId,
          entry
        ]
      )
    )


  for (
    const currentEntry
    of currentReport.entries ??
      []
  ) {

    const previousEntry =
      previousEntries.get(
        currentEntry.caseId
      )


    if (
      !previousEntry
    ) {

      continue
    }


    if (
      previousEntry.retrieval?.applicable !==
        true ||
      currentEntry.retrieval?.applicable !==
        true
    ) {

      continue
    }


    const previousHit =
      previousEntry.retrieval.hitAtK

    const currentHit =
      currentEntry.retrieval.hitAtK


    if (
      !previousHit &&
      currentHit
    ) {

      result.missToHit++

      continue
    }


    if (
      previousHit &&
      !currentHit
    ) {

      result.hitToMiss++

      continue
    }


    if (
      previousHit &&
      currentHit
    ) {

      result.hitToHit++

      continue
    }


    result.missToMiss++
  }


  return result
}


function resolveHybridVersion(
  value: string | null
): HybridVersion {

  if (
    value === "v2"
  ) {

    return "v2"
  }


  return "v1"
}


function resolveReportFileName(
  url: string
): string {

  const index =
    url.lastIndexOf(
      "/"
    )


  return index >= 0
    ? url.substring(
      index +
      1
    )
    : url
}


function formatPercentage(
  value: number
): string {

  return `${(
    value *
    100
  ).toFixed(2)}%`
}


function formatPercentagePointDelta(
  value: number
): string {

  const result =
    (
      value *
      100
    ).toFixed(
      2
    )


  return value > 0
    ? `+${result}%p`
    : `${result}%p`
}


function formatDecimalDelta(
  value: number
): string {

  const result =
    value.toFixed(
      4
    )


  return value > 0
    ? `+${result}`
    : result
}


function formatIntegerDelta(
  value: number
): string {

  return value > 0
    ? `+${value}`
    : String(
      value
    )
}


function resolveErrorMessage(
  reason: unknown
): string {

  if (
    reason instanceof Error
  ) {

    return reason.message
  }


  return "Hybrid Report 조회 중 오류가 발생했습니다."
}