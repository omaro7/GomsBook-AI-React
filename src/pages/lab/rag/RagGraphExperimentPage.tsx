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
  GitBranch,
  Search
} from "lucide-react"

import {
  Link,
  useSearchParams
} from "react-router-dom"


type GraphVersion =
  | "v1"
  | "v2"
  | "v3"
  | "v4"
  | "v5"
  | "v6"


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
  entries: EvaluationEntry[]
}


interface ExperimentConfigItem {
  label: string
  value: string
}


interface GraphVersionDefinition {
  version: GraphVersion
  label: string
  experimentId: string
  title: string
  reportUrl: string
  previousLabel: string
  previousReportUrl: string
  hypothesis: string
  changeSummary: string
  interpretation: string
  config: ExperimentConfigItem[]
  nextVersion?: GraphVersion
  nextLabel: string
  nextHypothesis: string
  nextHref: string
}


const VECTOR_BASELINE_REPORT_URL =
  "/lab/rag/report/vector-only-v1/rag-lunchwork_seoul-vector-only-v1-report.json"


const GRAPH_VERSIONS: Record<
  GraphVersion,
  GraphVersionDefinition
> = {
  v1: {
    version: "v1",
    label: "V1",
    experimentId: "VECTOR_GRAPH_V1",
    title: "Simple Spine Graph",
    reportUrl:
      "/lab/rag/report/vector-graph-v1/rag-lunchwork_seoul-vector-graph-v1-report.json",
    previousLabel:
      "VECTOR_ONLY_V1",
    previousReportUrl:
      VECTOR_BASELINE_REPORT_URL,
    hypothesis:
      "Vector Retrieval에 EPUB Spine 기반 Graph Candidate를 추가하면 문서 구조 관계를 활용하여 Expected Document의 검색 성능을 개선할 수 있을 것이다.",
    changeSummary:
      "Vector Baseline에 Simple Spine Graph를 최초로 결합한 실험입니다.",
    interpretation:
      "Graph를 추가하는 것 자체가 성능 개선을 보장하는지 검증하는 첫 단계입니다. Baseline 대비 Hit Rate와 MRR의 변화를 중심으로 확인합니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Graph Strategy",
        value: "Simple Spine Graph"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextVersion: "v2",
    nextLabel:
      "VECTOR_GRAPH_V2",
    nextHypothesis:
      "Graph Candidate의 문서 선택 정책을 개선하면 단순 Spine Graph에서 발생한 오검색을 줄일 수 있을 것이다.",
    nextHref:
      "/lab/rag/graph?version=v2"
  },

  v2: {
    version: "v2",
    label: "V2",
    experimentId: "VECTOR_GRAPH_V2",
    title: "Document Policy",
    reportUrl:
      "/lab/rag/report/vector-graph-v2/rag-lunchwork_seoul-vector-graph-v2-report.json",
    previousLabel:
      "VECTOR_GRAPH_V1",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v1/rag-lunchwork_seoul-vector-graph-v1-report.json",
    hypothesis:
      "Graph Candidate에 문서 선택 정책을 적용하면 관련성이 낮은 구조적 후보의 유입을 줄이고 Retrieval 성능을 회복할 수 있을 것이다.",
    changeSummary:
      "V1의 Simple Spine Graph에 Document Policy를 추가한 실험입니다.",
    interpretation:
      "Graph 구조 자체보다 어떤 문서를 Candidate로 허용하는지가 Retrieval 품질에 영향을 주는지 확인합니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Graph Strategy",
        value: "Document Policy"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextVersion: "v3",
    nextLabel:
      "VECTOR_GRAPH_V3",
    nextHypothesis:
      "Graph Score의 영향력을 낮추면 Vector Semantic Signal을 보존하면서 Graph의 구조적 보조 효과를 얻을 수 있을 것이다.",
    nextHref:
      "/lab/rag/graph?version=v3"
  },

  v3: {
    version: "v3",
    label: "V3",
    experimentId: "VECTOR_GRAPH_V3",
    title: "Graph Weight Tuning",
    reportUrl:
      "/lab/rag/report/vector-graph-v3/rag-lunchwork_seoul-vector-graph-v3-report.json",
    previousLabel:
      "VECTOR_GRAPH_V2",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v2/rag-lunchwork_seoul-vector-graph-v2-report.json",
    hypothesis:
      "Graph Weight를 낮추면 Graph Candidate가 Vector Ranking을 과도하게 교란하는 현상을 줄이고 Baseline 수준의 Hit Rate를 회복할 수 있을 것이다.",
    changeSummary:
      "Graph Weight를 0.10에서 0.05로 낮춰 Ranking 영향도를 조정한 실험입니다.",
    interpretation:
      "Graph Signal의 존재 여부보다 Vector Score와 Graph Score 사이의 상대적인 가중치가 중요하다는 가설을 검증합니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Graph Weight",
        value: "0.05"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextVersion: "v4",
    nextLabel:
      "VECTOR_GRAPH_V4",
    nextHypothesis:
      "Graph 확장의 Seed를 가장 강한 Vector Candidate로 제한하면 불필요한 Graph 확산을 줄이고 상위 Rank를 개선할 수 있을 것이다.",
    nextHref:
      "/lab/rag/graph?version=v4"
  },

  v4: {
    version: "v4",
    label: "V4",
    experimentId: "VECTOR_GRAPH_V4",
    title: "Seed Top-1",
    reportUrl:
      "/lab/rag/report/vector-graph-v4/rag-lunchwork_seoul-vector-graph-v4-report.json",
    previousLabel:
      "VECTOR_GRAPH_V3",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v3/rag-lunchwork_seoul-vector-graph-v3-report.json",
    hypothesis:
      "Graph 탐색의 Seed를 Vector Top-1 Candidate로 제한하면 의미적으로 가장 강한 문서를 중심으로 구조 검색을 확장할 수 있을 것이다.",
    changeSummary:
      "Graph Candidate 확장의 Seed 정책을 Top-1 중심으로 변경한 실험입니다.",
    interpretation:
      "Graph 탐색 범위를 줄이는 것이 Hit Rate 유지뿐 아니라 Expected Document의 Rank 개선에 도움이 되는지 확인합니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Graph Seed",
        value: "Vector Top-1"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextVersion: "v5",
    nextLabel:
      "VECTOR_GRAPH_V5",
    nextHypothesis:
      "Graph Weight를 추가로 낮추면 구조 정보는 보조 Signal로 유지하면서 Vector Ranking의 안정성을 더 높일 수 있을 것이다.",
    nextHref:
      "/lab/rag/graph?version=v5"
  },

  v5: {
    version: "v5",
    label: "V5",
    experimentId: "VECTOR_GRAPH_V5",
    title: "Graph Weight Fine Tuning",
    reportUrl:
      "/lab/rag/report/vector-graph-v5/rag-lunchwork_seoul-vector-graph-v5-report.json",
    previousLabel:
      "VECTOR_GRAPH_V4",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v4/rag-lunchwork_seoul-vector-graph-v4-report.json",
    hypothesis:
      "Graph Weight를 0.025까지 낮추면 Vector 기반 Ranking을 안정적으로 유지하면서 Graph가 보조적으로 Expected Document Rank를 개선할 수 있을 것이다.",
    changeSummary:
      "Graph Weight를 0.05에서 0.025로 추가 조정한 실험입니다.",
    interpretation:
      "Graph는 Primary Retrieval Signal이 아니라 구조적 보조 Signal로 사용하는 것이 적절한지를 확인합니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Graph Weight",
        value: "0.025"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextVersion: "v6",
    nextLabel:
      "VECTOR_GRAPH_V6",
    nextHypothesis:
      "Graph Candidate를 문서 단위가 아니라 실제 검색 가능한 Chunk 정책과 연결하면 상위 Rank 품질을 더 개선할 수 있을 것이다.",
    nextHref:
      "/lab/rag/graph?version=v6"
  },

  v6: {
    version: "v6",
    label: "V6",
    experimentId: "VECTOR_GRAPH_V6",
    title: "Candidate Chunk Policy",
    reportUrl:
      "/lab/rag/report/vector-graph-v6/rag-lunchwork_seoul-vector-graph-v6-report.json",
    previousLabel:
      "VECTOR_GRAPH_V5",
    previousReportUrl:
      "/lab/rag/report/vector-graph-v5/rag-lunchwork_seoul-vector-graph-v5-report.json",
    hypothesis:
      "Graph Candidate를 실제 Retrieval Chunk 정책과 정렬하면 Hit Rate를 유지하면서 Expected Document의 상위 Rank를 개선할 수 있을 것이다.",
    changeSummary:
      "Graph Candidate Chunk Policy를 적용한 Graph 계열의 최종 실험입니다.",
    interpretation:
      "Graph Retrieval의 목표를 단순 Coverage 확대가 아니라 Vector Retrieval의 Rank 보정으로 정리하는 최종 단계입니다.",
    config: [
      {
        label: "Retrieval",
        value: "VECTOR + GRAPH"
      },
      {
        label: "Candidate Policy",
        value: "Chunk Policy"
      },
      {
        label: "Final Top-K",
        value: "5"
      }
    ],
    nextLabel:
      "HYBRID_V1",
    nextHypothesis:
      "Vector Baseline과 최적화된 Vector Graph Branch를 독립적으로 유지한 뒤 Rank Fusion으로 결합하면 두 검색 방식의 장점을 동시에 활용할 수 있을 것이다.",
    nextHref:
      "/lab/rag/hybrid?version=v1"
  }
}


const GRAPH_VERSION_ORDER: GraphVersion[] = [
  "v1",
  "v2",
  "v3",
  "v4",
  "v5",
  "v6"
]


export function RagGraphExperimentPage() {

  const [
    searchParams,
    setSearchParams
  ] =
    useSearchParams()


  const activeVersion =
    resolveGraphVersion(
      searchParams.get(
        "version"
      )
    )


  const definition =
    GRAPH_VERSIONS[
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

          const current =
            await fetchReport(
              definition.reportUrl,
              controller.signal
            )


          setReport(
            current
          )


          try {

            const previous =
              await fetchReport(
                definition.previousReportUrl,
                controller.signal
              )


            setPreviousReport(
              previous
            )

          } catch (
            previousReason
          ) {

            if (
              previousReason instanceof DOMException &&
              previousReason.name === "AbortError"
            ) {

              return
            }


            setPreviousReport(
              null
            )
          }

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
    version: GraphVersion
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
        <VersionHeader
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
        <VersionHeader
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
            "Graph Report를 불러올 수 없습니다."
          }
        />
      </PageShell>
    )
  }


  return (
    <PageShell>

      <GraphHeader
        definition={
          definition
        }
        report={
          report
        }
      />


      <VersionHeader
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


function GraphHeader({
  definition,
  report
}: {
  definition: GraphVersionDefinition
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
          bg-[color-mix(in_srgb,var(--goms-violet)_10%,transparent)]
          px-3
          py-1.5
          text-xs
          font-black
          tracking-[0.08em]
          text-[var(--goms-violet)]
        "
      >
        <GitBranch
          className="
            size-3.5
          "
        />

        GRAPH · {definition.label}
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
        Vector Retrieval에 EPUB 구조 정보를
        Graph Signal로 결합하고,
        V1부터 V6까지 Graph 정책과 Ranking 전략을
        단계적으로 검증합니다.
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
          Experiment · {definition.experimentId}
        </InfoPill>

        <InfoPill>
          Final Top-K · 5
        </InfoPill>

        <InfoPill>
          Previous · {definition.previousLabel}
        </InfoPill>
      </div>
    </section>
  )
}


function VersionHeader({
  activeVersion,
  onChange
}: {
  activeVersion: GraphVersion
  onChange: (
    version: GraphVersion
  ) => void
}) {

  return (
    <section
      className="
        border-b
        border-border
      "
      aria-label="Graph experiment versions"
    >
      <div
        className="
          flex
          gap-1
          overflow-x-auto
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {
          GRAPH_VERSION_ORDER.map(
            version => {

              const definition =
                GRAPH_VERSIONS[
                  version
                ]


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
                    shrink-0
                    px-5
                    py-3
                    text-sm
                    font-black
                    transition-colors
                    ${
                      active
                        ? `
                          text-[var(--goms-violet)]
                        `
                        : `
                          text-muted-foreground
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {definition.label}


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
                            bg-[var(--goms-violet)]
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
  definition: GraphVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="01 · HYPOTHESIS"
        title="가설"
        description="직전 실험에서 확인된 문제를 기준으로 이번 버전에서 검증할 변경사항을 정의합니다."
      />


      <div
        className="
          rounded-[var(--goms-radius-lg)]
          border
          border-[color-mix(in_srgb,var(--goms-violet)_24%,var(--goms-border))]
          bg-[color-mix(in_srgb,var(--goms-violet)_6%,var(--goms-card))]
          p-7
        "
      >
        <div
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.08em]
            text-[var(--goms-violet)]
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
            border-border
            pt-4
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
  definition: GraphVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="02 · EXPERIMENT"
        title="실험 조건"
        description="Graph 버전별 변경점을 제외한 평가 조건은 동일하게 유지합니다."
      />


      <div
        className="
          grid
          grid-cols-[1.15fr_0.85fr]
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


          {
            definition.config.map(
              (
                item,
                index
              ) => (
                <ConfigRow
                  key={
                    item.label
                  }
                  label={
                    item.label
                  }
                  value={
                    item.value
                  }
                  last={
                    index ===
                    definition.config.length -
                    1
                  }
                />
              )
            )
          }
        </div>


        <div
          className="
            rounded-[var(--goms-radius-lg)]
            bg-[linear-gradient(145deg,#221d46,#352c69_58%,#7657d6)]
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
            GRAPH RETRIEVAL
          </div>


          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
            "
          >
            <FlowBox>
              Vector Candidate
            </FlowBox>

            <FlowArrow />

            <FlowBox>
              Graph Expansion
            </FlowBox>

            <FlowArrow />

            <FlowBox>
              Graph Score
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
        title="Retrieval 평가 결과"
        description="현재 Graph 버전의 Hit Rate@5, Recall@5, MRR을 실제 Report에서 계산합니다."
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
    </section>
  )
}


function ComparisonSection({
  definition,
  report,
  previousReport
}: {
  definition: GraphVersionDefinition
  report: RagEvaluationReport
  previousReport: RagEvaluationReport | null
}) {

  if (
    !previousReport
  ) {

    return (
      <section>
        <SectionHeader
          kicker="04 · COMPARISON"
          title="직전 실험 비교"
          description={`${definition.previousLabel} Report와 현재 버전을 비교합니다.`}
        />


        <div
          className="
            rounded-[var(--goms-radius-lg)]
            border
            border-amber-200
            bg-card
            p-6
            text-sm
            text-muted-foreground
          "
        >
          이전 실험 Report를 불러올 수 없어
          비교 Metric을 표시하지 않습니다.
        </div>
      </section>
    )
  }


  const before =
    previousReport.retrievalSummary


  const after =
    report.retrievalSummary


  return (
    <section>
      <SectionHeader
        kicker="04 · COMPARISON"
        title={`${definition.previousLabel} → ${definition.experimentId}`}
        description="직전 실험과 동일 Metric을 기준으로 변화량을 비교합니다."
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
          before={
            definition.previousLabel
          }
          after={
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
        kicker="05 · FAILURE ANALYSIS"
        title="현재 버전 MISS Cases"
        description="Expected Document가 Final Top-5에 포함되지 않은 Case를 확인합니다."
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
                현재 조건에 해당하는 MISS Case가 없습니다.
              </div>
            )
            : null
        }
      </div>
    </section>
  )
}


function InterpretationSection({
  definition
}: {
  definition: GraphVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="06 · INTERPRETATION"
        title="결과 해석"
        description="현재 버전의 변경사항을 Retrieval 관점에서 해석합니다."
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
            text-[var(--goms-violet)]
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
  definition: GraphVersionDefinition
}) {

  return (
    <section>
      <SectionHeader
        kicker="07 · NEXT HYPOTHESIS"
        title="다음 실험"
        description="현재 결과에서 확인한 문제를 다음 Retrieval 실험의 가설로 연결합니다."
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
              text-[var(--goms-violet)]
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
                text-[var(--goms-violet)]
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
  definition: GraphVersionDefinition
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
        kicker="08 · RAW REPORT"
        title="Evaluation Report JSON"
        description="현재 Graph 버전에 실제 사용된 평가 Report를 직접 확인합니다."
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
              {resolveReportFileName(
                definition.reportUrl
              )}
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
              transition-colors
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


function ComparisonHeader({
  before,
  after
}: {
  before: string
  after: string
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
        {before}
      </span>

      <span
        className="
          max-sm:hidden
        "
      >
        {after}
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
              ? "text-emerald-600 dark:text-emerald-400"
              : negative
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
          }
        `}
      >
        {delta}
      </span>
    </div>
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
          text-[var(--goms-violet)]
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
            ? `
              border-white
              bg-white
              text-[#352c69]
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
              ? "text-[var(--goms-violet)]"
              : warning
                ? "text-amber-600 dark:text-amber-400"
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
            border-t-[var(--goms-violet)]
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
          shadow-[var(--goms-shadow-xs)]
          dark:border-red-900
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
          Graph Report 조회 실패
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
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
          normalizeEntry
        )
        : []
  }
}


function normalizeEntry(
  entry: EvaluationEntry
): EvaluationEntry {

  return {
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
  }
}

function resolveGraphVersion(
  value: string | null
): GraphVersion {

  if (
    value === "v2" ||
    value === "v3" ||
    value === "v4" ||
    value === "v5" ||
    value === "v6"
  ) {

    return value
  }


  return "v1"
}


function resolveReportFileName(
  reportUrl: string
): string {

  const index =
    reportUrl.lastIndexOf(
      "/"
    )


  if (
    index < 0
  ) {

    return reportUrl
  }


  return reportUrl.substring(
    index +
    1
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


function formatPercentagePointDelta(
  value: number
): string {

  const resolved =
    (
      value *
      100
    ).toFixed(
      2
    )


  if (
    value > 0
  ) {

    return `+${resolved}%p`
  }


  return `${resolved}%p`
}


function formatDecimalDelta(
  value: number
): string {

  const resolved =
    value.toFixed(
      4
    )


  if (
    value > 0
  ) {

    return `+${resolved}`
  }


  return resolved
}


function formatIntegerDelta(
  value: number
): string {

  if (
    value > 0
  ) {

    return `+${value}`
  }


  return String(
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


  return "Graph Report 조회 중 알 수 없는 오류가 발생했습니다."
}