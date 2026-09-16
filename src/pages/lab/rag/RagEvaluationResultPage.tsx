import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  GitBranch,
  GitMerge,
  Target,
  Trophy
} from "lucide-react"

import {
  Link
} from "react-router-dom"


type Strategy =
  | "VECTOR"
  | "GRAPH"
  | "HYBRID"


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


interface ExperimentDefinition {
  id: string
  shortLabel: string
  strategy: Strategy
  version: string
  title: string
  reportUrl: string
  href: string
}


interface LoadedExperiment {
  definition: ExperimentDefinition
  report: RagEvaluationReport
}


const EXPERIMENTS: ExperimentDefinition[] = [
  {
    id: "VECTOR_ONLY_V1",
    shortLabel: "V",
    strategy: "VECTOR",
    version: "Baseline",
    title: "Vector Only",
    reportUrl:
      "/lab/rag/report/vector-only-v1/rag-lunchwork_seoul-vector-only-v1-report.json",
    href:
      "/lab/rag/vector"
  },
  {
    id: "VECTOR_GRAPH_V1",
    shortLabel: "G1",
    strategy: "GRAPH",
    version: "V1",
    title: "Simple Spine Graph",
    reportUrl:
      "/lab/rag/report/vector-graph-v1/rag-lunchwork_seoul-vector-graph-v1-report.json",
    href:
      "/lab/rag/graph?version=v1"
  },
  {
    id: "VECTOR_GRAPH_V2",
    shortLabel: "G2",
    strategy: "GRAPH",
    version: "V2",
    title: "Document Policy",
    reportUrl:
      "/lab/rag/report/vector-graph-v2/rag-lunchwork_seoul-vector-graph-v2-report.json",
    href:
      "/lab/rag/graph?version=v2"
  },
  {
    id: "VECTOR_GRAPH_V3",
    shortLabel: "G3",
    strategy: "GRAPH",
    version: "V3",
    title: "Graph Weight",
    reportUrl:
      "/lab/rag/report/vector-graph-v3/rag-lunchwork_seoul-vector-graph-v3-report.json",
    href:
      "/lab/rag/graph?version=v3"
  },
  {
    id: "VECTOR_GRAPH_V4",
    shortLabel: "G4",
    strategy: "GRAPH",
    version: "V4",
    title: "Seed Top-1",
    reportUrl:
      "/lab/rag/report/vector-graph-v4/rag-lunchwork_seoul-vector-graph-v4-report.json",
    href:
      "/lab/rag/graph?version=v4"
  },
  {
    id: "VECTOR_GRAPH_V5",
    shortLabel: "G5",
    strategy: "GRAPH",
    version: "V5",
    title: "Graph Weight Fine Tuning",
    reportUrl:
      "/lab/rag/report/vector-graph-v5/rag-lunchwork_seoul-vector-graph-v5-report.json",
    href:
      "/lab/rag/graph?version=v5"
  },
  {
    id: "VECTOR_GRAPH_V6",
    shortLabel: "G6",
    strategy: "GRAPH",
    version: "V6",
    title: "Candidate Chunk Policy",
    reportUrl:
      "/lab/rag/report/vector-graph-v6/rag-lunchwork_seoul-vector-graph-v6-report.json",
    href:
      "/lab/rag/graph?version=v6"
  },
  {
    id: "HYBRID_V1",
    shortLabel: "H1",
    strategy: "HYBRID",
    version: "V1",
    title: "Top-5 + Top-5 Weighted RRF",
    reportUrl:
      "/lab/rag/report/hybrid-v1/rag-lunchwork_seoul-hybrid-v1-report.json",
    href:
      "/lab/rag/hybrid?version=v1"
  },
  {
    id: "HYBRID_V2",
    shortLabel: "H2",
    strategy: "HYBRID",
    version: "V2",
    title: "Top-10 + Top-10 Weighted RRF",
    reportUrl:
      "/lab/rag/report/hybrid-v2/rag-lunchwork_seoul-hybrid-v2-report.json",
    href:
      "/lab/rag/hybrid?version=v2"
  }
]


export function RagEvaluationResultPage() {

  const [
    experiments,
    setExperiments
  ] =
    useState<LoadedExperiment[]>(
      []
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

          const loaded =
            await Promise.all(
              EXPERIMENTS.map(
                async definition => ({
                  definition,
                  report:
                    await fetchReport(
                      definition.reportUrl,
                      controller.signal
                    )
                })
              )
            )


          setExperiments(
            loaded
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
    experiments.length === 0
  ) {

    return (
      <PageShell>
        <ErrorState
          message={
            error ??
            "RAG Evaluation Report를 불러올 수 없습니다."
          }
        />
      </PageShell>
    )
  }


  const baseline =
    experiments[0]


  const finalExperiment =
    experiments[
      experiments.length -
      1
    ]


  return (
    <PageShell>

      <ResultHeader
        baseline={
          baseline
        }
        finalExperiment={
          finalExperiment
        }
        experimentCount={
          experiments.length
        }
      />


      <ExecutiveSummary
        baseline={
          baseline
        }
        finalExperiment={
          finalExperiment
        }
        experimentCount={
          experiments.length
        }
      />


      <StrategyEvolution />


      <PerformanceEvolution
        experiments={
          experiments
        }
      />


      <ExperimentTable
        experiments={
          experiments
        }
      />


      <FinalValidation
        baseline={
          baseline
        }
        finalExperiment={
          finalExperiment
        }
      />


      <FailureAnalysis
        finalExperiment={
          finalExperiment
        }
      />


      <Conclusion
        baseline={
          baseline
        }
        finalExperiment={
          finalExperiment
        }
      />


      <ReportSources
        experiments={
          experiments
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


function ResultHeader({
  baseline,
  finalExperiment,
  experimentCount
}: {
  baseline: LoadedExperiment
  finalExperiment: LoadedExperiment
  experimentCount: number
}) {

  const finalSummary =
    finalExperiment.report.retrievalSummary


  return (
    <section
      className="
        grid
        grid-cols-[1.05fr_0.95fr]
        gap-8
        max-lg:grid-cols-1
      "
    >
      <div
        className="
          flex
          flex-col
          justify-center
        "
      >
        <div
          className="
            inline-flex
            w-fit
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
          <Trophy
            className="
              size-3.5
            "
          />

          FINAL RESULT
        </div>


        <h1
          className="
            mt-5
            text-[clamp(2.3rem,5vw,4rem)]
            font-black
            leading-[1.04]
            tracking-[-0.055em]
          "
        >
          RAG Retrieval
          <br />

          <span
            className="
              text-primary
            "
          >
            실험 최종 결과
          </span>
        </h1>


        <p
          className="
            mt-5
            max-w-2xl
            text-base
            leading-7
            text-muted-foreground
          "
        >
          동일한 Golden Dataset을 기준으로
          Vector Baseline부터 Graph V1~V6,
          Hybrid V1~V2까지
          총 {experimentCount}개의 Retrieval 실험을
          순차적으로 비교합니다.
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
            Dataset · {baseline.report.datasetName}
          </InfoPill>

          <InfoPill>
            Experiments · {experimentCount}
          </InfoPill>

          <InfoPill>
            Final · {finalExperiment.definition.id}
          </InfoPill>

          <InfoPill>
            Evaluated · {finalSummary.evaluatedCases}
          </InfoPill>
        </div>
      </div>


      <FinalCandidateCard
        experiment={
          finalExperiment
        }
      />
    </section>
  )
}


function FinalCandidateCard({
  experiment
}: {
  experiment: LoadedExperiment
}) {

  const summary =
    experiment.report.retrievalSummary


  const misses =
    summary.evaluatedCases -
    summary.hitCount


  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        bg-[linear-gradient(145deg,#102a50,#173865_58%,#2457e6)]
        p-7
        text-white
        shadow-[var(--goms-shadow-md)]
      "
    >
      <div
        className="
          absolute
          -right-16
          -top-20
          size-56
          rounded-full
          bg-white/5
        "
      />


      <div
        className="
          relative
        "
      >
        <div
          className="
            text-[11px]
            font-black
            uppercase
            tracking-[0.14em]
            text-white/60
          "
        >
          FINAL CANDIDATE
        </div>


        <h2
          className="
            mt-2
            text-3xl
            font-black
            tracking-[-0.04em]
          text-white
          "
        >
          {experiment.definition.id}
        </h2>


        <p
          className="
            mt-2
            text-sm
            font-semibold
            text-white/85
          "
        >
          {experiment.definition.title}
        </p>


        <div
          className="
            mt-6
            grid
            grid-cols-3
            gap-3
            max-sm:grid-cols-1
          "
        >
          <DarkMetric
            label="Hit Rate@5"
            value={
              formatPercentage(
                summary.hitRateAtK
              )
            }
          />

          <DarkMetric
            label="Recall@5"
            value={
              formatPercentage(
                summary.averageRecallAtK
              )
            }
          />

          <DarkMetric
            label="MRR"
            value={
              summary.meanReciprocalRank.toFixed(
                4
              )
            }
          />
        </div>


        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-4
            rounded-[var(--goms-radius-md)]
            bg-white
            p-4
            text-[#15345f]
          "
        >
          <div>
            <div
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.08em]
                text-[#708098]
              "
            >
              Retrieval Result
            </div>

            <div
              className="
                mt-1
                text-lg
                font-black
              "
            >
              {summary.hitCount}
              {" / "}
              {summary.evaluatedCases}
              {" HIT"}
            </div>
          </div>


          <div
            className="
              text-right
            "
          >
            <div
              className="
                text-[10px]
                font-bold
                text-[#708098]
              "
            >
              Remaining MISS
            </div>

            <div
              className="
                mt-1
                text-lg
                font-black
                text-amber-600
              "
            >
              {misses}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function ExecutiveSummary({
  baseline,
  finalExperiment,
  experimentCount
}: {
  baseline: LoadedExperiment
  finalExperiment: LoadedExperiment
  experimentCount: number
}) {

  const baselineSummary =
    baseline.report.retrievalSummary


  const finalSummary =
    finalExperiment.report.retrievalSummary


  return (
    <section>
      <SectionHeader
        kicker="01 · EXECUTIVE SUMMARY"
        title="전체 평가 요약"
        description="Baseline과 최종 Candidate의 핵심 Retrieval Metric을 비교합니다."
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
        <SummaryCard
          icon={
            <FlaskConical
              className="
                size-4
              "
            />
          }
          label="Experiments"
          value={
            String(
              experimentCount
            )
          }
          description="Vector 1 · Graph 6 · Hybrid 2"
        />


        <SummaryCard
          icon={
            <Target
              className="
                size-4
              "
            />
          }
          label="Baseline Hit@5"
          value={
            formatPercentage(
              baselineSummary.hitRateAtK
            )
          }
          description={
            baseline.definition.id
          }
        />


        <SummaryCard
          icon={
            <Trophy
              className="
                size-4
              "
            />
          }
          label="Final Hit@5"
          value={
            formatPercentage(
              finalSummary.hitRateAtK
            )
          }
          description={
            finalExperiment.definition.id
          }
          emphasized
        />


        <SummaryCard
          icon={
            <CheckCircle2
              className="
                size-4
              "
            />
          }
          label="Final MRR"
          value={
            finalSummary.meanReciprocalRank.toFixed(
              4
            )
          }
          description="Mean Reciprocal Rank"
        />
      </div>
    </section>
  )
}


function StrategyEvolution() {

  return (
    <section>
      <SectionHeader
        kicker="02 · STRATEGY EVOLUTION"
        title="Retrieval 전략 발전 과정"
        description="각 단계는 직전 실험의 한계를 해결하기 위한 다음 가설로 연결됩니다."
      />


      <div
        className="
          grid
          grid-cols-[1fr_auto_1fr_auto_1fr]
          items-stretch
          gap-3
          max-lg:grid-cols-1
        "
      >
        <StrategyCard
          icon={
            <Target
              className="
                size-5
              "
            />
          }
          title="Vector"
          subtitle="Semantic Baseline"
          description="Embedding 기반 Semantic Search의 기준 성능을 측정합니다."
          href="/lab/rag/vector"
        />


        <StrategyArrow />


        <StrategyCard
          icon={
            <GitBranch
              className="
                size-5
              "
            />
          }
          title="Graph"
          subtitle="V1 → V6"
          description="EPUB 구조 정보와 Candidate Ranking 정책을 단계적으로 최적화합니다."
          href="/lab/rag/graph"
        />


        <StrategyArrow />


        <StrategyCard
          icon={
            <GitMerge
              className="
                size-5
              "
            />
          }
          title="Hybrid"
          subtitle="V1 → V2"
          description="Vector와 Graph Branch를 Weighted RRF로 결합합니다."
          href="/lab/rag/hybrid"
        />
      </div>
    </section>
  )
}


function PerformanceEvolution({
  experiments
}: {
  experiments: LoadedExperiment[]
}) {

  return (
    <section>
      <SectionHeader
        kicker="03 · PERFORMANCE EVOLUTION"
        title="실험별 성능 변화"
        description="Hit Rate@5와 MRR의 변화를 전체 실험 순서대로 비교합니다."
      />


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
        <div
          className="
            mb-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h3
              className="
                text-base
                font-black
                tracking-[-0.025em]
              "
            >
              Retrieval Performance
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-muted-foreground
              "
            >
              동일 Golden Dataset 기준
            </p>
          </div>


          <div
            className="
              flex
              gap-4
              text-[11px]
              font-bold
              text-muted-foreground
            "
          >
            <Legend
              className="bg-primary"
              label="Hit Rate@5"
            />

            <Legend
              className="bg-[var(--goms-violet)]"
              label="MRR"
            />
          </div>
        </div>


        <PerformanceChart
          experiments={
            experiments
          }
        />
      </div>
    </section>
  )
}


function PerformanceChart({
  experiments
}: {
  experiments: LoadedExperiment[]
}) {

  const width =
    820

  const height =
    300

  const left =
    48

  const right =
    22

  const top =
    20

  const bottom =
    44

  const minimum =
    0.5

  const maximum =
    1.0


  const chartWidth =
    width -
    left -
    right


  const chartHeight =
    height -
    top -
    bottom


  function x(
    index: number
  ) {

    return left +
      chartWidth *
      index /
      (
        experiments.length -
        1
      )
  }


  function y(
    value: number
  ) {

    const normalized =
      (
        value -
        minimum
      ) /
      (
        maximum -
        minimum
      )


    return top +
      chartHeight *
      (
        1 -
        normalized
      )
  }


  const hitPoints =
    experiments
      .map(
        (
          item,
          index
        ) =>
          `${x(index)},${y(item.report.retrievalSummary.hitRateAtK)}`
      )
      .join(
        " "
      )


  const mrrPoints =
    experiments
      .map(
        (
          item,
          index
        ) =>
          `${x(index)},${y(item.report.retrievalSummary.meanReciprocalRank)}`
      )
      .join(
        " "
      )


  const ticks = [
    1.0,
    0.9,
    0.8,
    0.7,
    0.6,
    0.5
  ]


  return (
    <div
      className="
        overflow-x-auto
      "
    >
      <svg
        viewBox={
          `0 0 ${width} ${height}`
        }
        className="
          min-w-[760px]
        "
        role="img"
        aria-label="RAG Retrieval 실험 Hit Rate와 MRR 변화"
      >
        {
          ticks.map(
            tick => {

              const resolvedY =
                y(
                  tick
                )


              return (
                <g
                  key={
                    tick
                  }
                >
                  <line
                    x1={
                      left
                    }
                    y1={
                      resolvedY
                    }
                    x2={
                      width -
                      right
                    }
                    y2={
                      resolvedY
                    }
                    className="
                      stroke-border
                    "
                  />

                  <text
                    x={
                      left -
                      8
                    }
                    y={
                      resolvedY +
                      4
                    }
                    textAnchor="end"
                    className="
                      fill-muted-foreground
                      text-[10px]
                    "
                  >
                    {tick.toFixed(1)}
                  </text>
                </g>
              )
            }
          )
        }


        <polyline
          points={
            hitPoints
          }
          className="
            fill-none
            stroke-primary
          "
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        <polyline
          points={
            mrrPoints
          }
          className="
            fill-none
            stroke-[var(--goms-violet)]
          "
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        {
          experiments.map(
            (
              item,
              index
            ) => {

              const resolvedX =
                x(
                  index
                )


              const hitY =
                y(
                  item.report.retrievalSummary.hitRateAtK
                )


              const mrrY =
                y(
                  item.report.retrievalSummary.meanReciprocalRank
                )


              return (
                <g
                  key={
                    item.definition.id
                  }
                >
                  <circle
                    cx={
                      resolvedX
                    }
                    cy={
                      hitY
                    }
                    r="4"
                    className="
                      fill-primary
                    "
                  />

                  <circle
                    cx={
                      resolvedX
                    }
                    cy={
                      mrrY
                    }
                    r="4"
                    className="
                      fill-[var(--goms-violet)]
                    "
                  />

                  <text
                    x={
                      resolvedX
                    }
                    y={
                      height -
                      14
                    }
                    textAnchor="middle"
                    className="
                      fill-muted-foreground
                      text-[10px]
                      font-bold
                    "
                  >
                    {item.definition.shortLabel}
                  </text>
                </g>
              )
            }
          )
        }
      </svg>
    </div>
  )
}


function ExperimentTable({
  experiments
}: {
  experiments: LoadedExperiment[]
}) {

  return (
    <section>
      <SectionHeader
        kicker="04 · EXPERIMENT MATRIX"
        title="전체 실험 비교"
        description="모든 Retrieval 실험의 핵심 Metric을 동일한 기준으로 비교합니다."
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
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[920px]
              border-collapse
            "
          >
            <thead>
              <tr
                className="
                  bg-muted/45
                "
              >
                <TableHeader>
                  Strategy
                </TableHeader>

                <TableHeader>
                  Experiment
                </TableHeader>

                <TableHeader>
                  Hit Rate@5
                </TableHeader>

                <TableHeader>
                  Recall@5
                </TableHeader>

                <TableHeader>
                  MRR
                </TableHeader>

                <TableHeader>
                  HIT
                </TableHeader>

                <TableHeader>
                  MISS
                </TableHeader>

                <TableHeader>
                  Δ MRR
                </TableHeader>
              </tr>
            </thead>


            <tbody>
              {
                experiments.map(
                  (
                    experiment,
                    index
                  ) => (
                    <ExperimentRow
                      key={
                        experiment.definition.id
                      }
                      experiment={
                        experiment
                      }
                      previous={
                        index > 0
                          ? experiments[
                            index -
                            1
                          ]
                          : null
                      }
                      final={
                        index ===
                        experiments.length -
                        1
                      }
                    />
                  )
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}


function ExperimentRow({
  experiment,
  previous,
  final
}: {
  experiment: LoadedExperiment
  previous: LoadedExperiment | null
  final: boolean
}) {

  const summary =
    experiment.report.retrievalSummary


  const missCount =
    summary.evaluatedCases -
    summary.hitCount


  const deltaMrr =
    previous
      ? summary.meanReciprocalRank -
        previous.report.retrievalSummary.meanReciprocalRank
      : 0


  return (
    <tr
      className={`
        border-t
        border-border
        transition-colors
        first:border-t-0
        hover:bg-muted/20
        ${
          final
            ? "bg-[var(--goms-primary-soft)]/35"
            : ""
        }
      `}
    >
      <TableCell>
        <StrategyBadge
          strategy={
            experiment.definition.strategy
          }
        />
      </TableCell>


      <TableCell>
        <Link
          to={
            experiment.definition.href
          }
          className="
            group
            block
          "
        >
          <div
            className="
              font-mono
              text-xs
              font-black
              group-hover:text-primary
            "
          >
            {experiment.definition.id}
          </div>

          <div
            className="
              mt-1
              text-[11px]
              text-muted-foreground
            "
          >
            {experiment.definition.title}
          </div>
        </Link>
      </TableCell>


      <TableCell>
        <MetricValue>
          {
            formatPercentage(
              summary.hitRateAtK
            )
          }
        </MetricValue>
      </TableCell>


      <TableCell>
        <MetricValue>
          {
            formatPercentage(
              summary.averageRecallAtK
            )
          }
        </MetricValue>
      </TableCell>


      <TableCell>
        <MetricValue>
          {
            summary.meanReciprocalRank.toFixed(
              4
            )
          }
        </MetricValue>
      </TableCell>


      <TableCell>
        <MetricValue>
          {summary.hitCount}
        </MetricValue>
      </TableCell>


      <TableCell>
        <MetricValue>
          {missCount}
        </MetricValue>
      </TableCell>


      <TableCell>
        {
          previous
            ? (
              <DeltaValue
                value={
                  deltaMrr
                }
              />
            )
            : (
              <span
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Baseline
              </span>
            )
        }
      </TableCell>
    </tr>
  )
}


function FinalValidation({
  baseline,
  finalExperiment
}: {
  baseline: LoadedExperiment
  finalExperiment: LoadedExperiment
}) {

  const before =
    baseline.report.retrievalSummary


  const after =
    finalExperiment.report.retrievalSummary


  return (
    <section>
      <SectionHeader
        kicker="05 · FINAL VALIDATION"
        title="Baseline → Final Candidate"
        description="RAG Retrieval 개선의 최종 결과를 Baseline과 직접 비교합니다."
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
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >
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
              Baseline → Final
            </div>

            <h3
              className="
                mt-2
                text-xl
                font-black
                tracking-[-0.03em]
              "
            >
              {baseline.definition.id}
              {" → "}
              {finalExperiment.definition.id}
            </h3>
          </div>


          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-emerald-50
              px-3
              py-1.5
              text-xs
              font-black
              text-emerald-700
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <CheckCircle2
              className="
                size-3.5
              "
            />

            FINAL CANDIDATE
          </span>
        </div>


        <div
          className="
            mt-7
            grid
            grid-cols-4
            gap-4
            max-lg:grid-cols-2
            max-sm:grid-cols-1
          "
        >
          <DeltaCard
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

          <DeltaCard
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

          <DeltaCard
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

          <DeltaCard
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
          />
        </div>
      </div>
    </section>
  )
}


function FailureAnalysis({
  finalExperiment
}: {
  finalExperiment: LoadedExperiment
}) {

  const misses =
    useMemo(
      () =>
        (
          finalExperiment.report.entries ??
          []
        ).filter(
          entry =>
            entry.retrieval?.applicable ===
              true &&
            entry.retrieval.hitAtK ===
              false
        ),
      [
        finalExperiment.report.entries
      ]
    )


  return (
    <section>
      <SectionHeader
        kicker="06 · REMAINING FAILURE"
        title="최종 Remaining MISS"
        description="최종 Candidate에서도 해결되지 않은 Retrieval Case를 확인합니다."
      />


      {
        misses.length ===
        0
          ? (
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
                  flex
                  items-center
                  gap-3
                "
              >
                <CheckCircle2
                  className="
                    size-5
                    text-emerald-600
                  "
                />

                <strong>
                  Remaining MISS가 없습니다.
                </strong>
              </div>
            </div>
          )
          : (
            <div
              className="
                overflow-hidden
                rounded-[var(--goms-radius-lg)]
                border
                border-amber-200
                bg-card
                shadow-[var(--goms-shadow-xs)]
                dark:border-amber-900
              "
            >
              {
                misses.map(
                  (
                    entry,
                    index
                  ) => (
                    <FinalFailureCase
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
            </div>
          )
      }
    </section>
  )
}


function FinalFailureCase({
  entry,
  first
}: {
  entry: EvaluationEntry
  first: boolean
}) {

  return (
    <article
      className={`
        p-6
        ${
          first
            ? ""
            : "border-t border-border"
        }
      `}
    >
      <div
        className="
          flex
          flex-wrap
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <div
            className="
              font-mono
              text-sm
              font-black
              text-amber-600
            "
          >
            {entry.caseId}
          </div>

          <p
            className="
              mt-3
              max-w-3xl
              text-base
              font-bold
              leading-7
            "
          >
            {entry.question}
          </p>
        </div>


        <span
          className="
            rounded-full
            bg-amber-50
            px-3
            py-1.5
            text-xs
            font-black
            text-amber-700
            dark:bg-amber-950/30
            dark:text-amber-400
          "
        >
          STABLE MISS
        </span>
      </div>


      <div
        className="
          mt-5
        "
      >
        <div
          className="
            text-[11px]
            font-black
            uppercase
            tracking-[0.08em]
            text-muted-foreground
          "
        >
          Expected Documents
        </div>


        <div
          className="
            mt-2
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
                    px-3
                    py-2
                    font-mono
                    text-xs
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
          mt-5
        "
      >
        <div
          className="
            text-[11px]
            font-black
            uppercase
            tracking-[0.08em]
            text-muted-foreground
          "
        >
          Retrieved Top Results
        </div>


        <div
          className="
            mt-2
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[600px]
            "
          >
            <thead>
              <tr>
                <TableHeader>
                  Rank
                </TableHeader>

                <TableHeader>
                  Source
                </TableHeader>

                <TableHeader>
                  Retrieval
                </TableHeader>

                <TableHeader>
                  Score
                </TableHeader>
              </tr>
            </thead>


            <tbody>
              {
                (
                  entry.retrievedDocuments ??
                  []
                )
                  .slice(
                    0,
                    5
                  )
                  .map(
                    document => (
                      <tr
                        key={
                          `${document.chunkId}-${document.rank}`
                        }
                        className="
                          border-t
                          border-border
                        "
                      >
                        <TableCell>
                          <MetricValue>
                            #{document.rank}
                          </MetricValue>
                        </TableCell>

                        <TableCell>
                          <code
                            className="
                              font-mono
                              text-xs
                            "
                          >
                            {document.sourcePath}
                          </code>
                        </TableCell>

                        <TableCell>
                          <span
                            className="
                              text-xs
                              font-bold
                              text-muted-foreground
                            "
                          >
                            {document.retrievalSource}
                          </span>
                        </TableCell>

                        <TableCell>
                          <MetricValue>
                            {
                              document.finalScore.toFixed(
                                4
                              )
                            }
                          </MetricValue>
                        </TableCell>
                      </tr>
                    )
                  )
              }
            </tbody>
          </table>
        </div>
      </div>
    </article>
  )
}


function Conclusion({
  baseline,
  finalExperiment
}: {
  baseline: LoadedExperiment
  finalExperiment: LoadedExperiment
}) {

  const before =
    baseline.report.retrievalSummary


  const after =
    finalExperiment.report.retrievalSummary


  const remainingMiss =
    after.evaluatedCases -
    after.hitCount


  return (
    <section>
      <SectionHeader
        kicker="07 · CONCLUSION"
        title="실험 결론"
        description="전체 RAG Retrieval 실험을 통해 확인한 구조적 결론을 정리합니다."
      />


      <div
        className="
          grid
          grid-cols-3
          gap-4
          max-lg:grid-cols-1
        "
      >
        <ConclusionCard
          number="01"
          title="Vector Baseline 확보"
          description={
            `Vector-only 검색에서 Hit Rate@5 ${formatPercentage(before.hitRateAtK)}, MRR ${before.meanReciprocalRank.toFixed(4)}의 기준 성능을 확보했습니다.`
          }
        />


        <ConclusionCard
          number="02"
          title="Graph는 Rank 보정에 유효"
          description="Graph를 단순 추가하는 것만으로는 개선되지 않았으며, Weight·Seed·Candidate Chunk 정책을 조정하면서 구조적 보조 Signal로 최적화했습니다."
        />


        <ConclusionCard
          number="03"
          title="Hybrid가 최종 Candidate"
          description={
            `${finalExperiment.definition.id}에서 Hit Rate@5 ${formatPercentage(after.hitRateAtK)}, MRR ${after.meanReciprocalRank.toFixed(4)}를 기록했고 Remaining MISS는 ${remainingMiss}건입니다.`
          }
        />
      </div>
    </section>
  )
}


function ReportSources({
  experiments
}: {
  experiments: LoadedExperiment[]
}) {

  return (
    <section>
      <SectionHeader
        kicker="08 · EVIDENCE"
        title="Experiment Reports"
        description="각 실험 결과의 원본 JSON Report를 직접 확인할 수 있습니다."
      />


      <div
        className="
          grid
          grid-cols-3
          gap-3
          max-lg:grid-cols-2
          max-sm:grid-cols-1
        "
      >
        {
          experiments.map(
            experiment => (
              <a
                key={
                  experiment.definition.id
                }
                href={
                  experiment.definition.reportUrl
                }
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-[var(--goms-radius-md)]
                  border
                  border-border
                  bg-card
                  px-4
                  py-4
                  shadow-[var(--goms-shadow-xs)]
                  transition
                  hover:border-primary/30
                  hover:shadow-[var(--goms-shadow-sm)]
                "
              >
                <div
                  className="
                    min-w-0
                  "
                >
                  <div
                    className="
                      font-mono
                      text-xs
                      font-black
                    "
                  >
                    {experiment.definition.id}
                  </div>

                  <div
                    className="
                      mt-1
                      truncate
                      text-[11px]
                      text-muted-foreground
                    "
                  >
                    {
                      resolveReportFileName(
                        experiment.definition.reportUrl
                      )
                    }
                  </div>
                </div>


                <ExternalLink
                  className="
                    size-4
                    shrink-0
                    text-muted-foreground
                    transition-colors
                    group-hover:text-primary
                  "
                />
              </a>
            )
          )
        }
      </div>
    </section>
  )
}


function StrategyCard({
  icon,
  title,
  subtitle,
  description,
  href
}: {
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  href: string
}) {

  return (
    <Link
      to={
        href
      }
      className="
        group
        rounded-[var(--goms-radius-lg)]
        border
        border-border
        bg-card
        p-6
        shadow-[var(--goms-shadow-xs)]
        transition
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:shadow-[var(--goms-shadow-sm)]
      "
    >
      <div
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-[var(--goms-radius-sm)]
          bg-[var(--goms-primary-soft)]
          text-primary
        "
      >
        {icon}
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


      <div
        className="
          mt-1
          text-xs
          font-bold
          text-primary
        "
      >
        {subtitle}
      </div>


      <p
        className="
          mt-3
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </Link>
  )
}


function StrategyArrow() {

  return (
    <div
      className="
        flex
        items-center
        justify-center
        text-muted-foreground
        max-lg:rotate-90
      "
    >
      <ArrowRight
        className="
          size-5
        "
      />
    </div>
  )
}


function SummaryCard({
  icon,
  label,
  value,
  description,
  emphasized = false
}: {
  icon: ReactNode
  label: string
  value: string
  description: string
  emphasized?: boolean
}) {

  return (
    <article
      className={`
        rounded-[var(--goms-radius-lg)]
        border
        p-5
        shadow-[var(--goms-shadow-xs)]
        ${
          emphasized
            ? `
              border-primary/20
              bg-[var(--goms-primary-soft)]
            `
            : `
              border-border
              bg-card
            `
        }
      `}
    >
      <div
        className="
          flex
          size-9
          items-center
          justify-center
          rounded-[var(--goms-radius-sm)]
          bg-[var(--goms-primary-soft)]
          text-primary
        "
      >
        {icon}
      </div>


      <div
        className="
          mt-4
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
          text-[28px]
          font-black
          tracking-[-0.04em]
        "
      >
        {value}
      </div>


      <div
        className="
          mt-3
          text-xs
          text-muted-foreground
        "
      >
        {description}
      </div>
    </article>
  )
}


function DeltaCard({
  label,
  before,
  after,
  delta
}: {
  label: string
  before: string
  after: string
  delta: string
}) {

  return (
    <div
      className="
        rounded-[var(--goms-radius-md)]
        bg-muted/50
        p-4
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
        className="
          mt-3
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            font-mono
            text-sm
            text-muted-foreground
          "
        >
          {before}
        </span>

        <ArrowRight
          className="
            size-3.5
            text-muted-foreground
          "
        />

        <strong
          className="
            font-mono
            text-lg
          "
        >
          {after}
        </strong>
      </div>


      <div
        className="
          mt-2
          font-mono
          text-xs
          font-black
          text-emerald-600
          dark:text-emerald-400
        "
      >
        {delta}
      </div>
    </div>
  )
}


function ConclusionCard({
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


function StrategyBadge({
  strategy
}: {
  strategy: Strategy
}) {

  const className =
    strategy === "VECTOR"
      ? `
        bg-blue-50
        text-blue-700
        dark:bg-blue-950/30
        dark:text-blue-400
      `
      : strategy === "GRAPH"
        ? `
          bg-violet-50
          text-violet-700
          dark:bg-violet-950/30
          dark:text-violet-400
        `
        : `
          bg-emerald-50
          text-emerald-700
          dark:bg-emerald-950/30
          dark:text-emerald-400
        `


  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-black
        ${className}
      `}
    >
      {strategy}
    </span>
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


function DarkMetric({
  label,
  value
}: {
  label: string
  value: string
}) {

  return (
    <div
      className="
        rounded-[var(--goms-radius-md)]
        border
        border-white/15
        bg-white/10
        p-4
      "
    >
      <div
        className="
          text-[11px]
          font-bold
          text-white/65
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          text-2xl
          font-black
        "
      >
        {value}
      </div>
    </div>
  )
}


function Legend({
  className,
  label
}: {
  className: string
  label: string
}) {

  return (
    <span
      className="
        flex
        items-center
        gap-1.5
      "
    >
      <span
        className={`
          size-2
          rounded-full
          ${className}
        `}
      />

      {label}
    </span>
  )
}


function TableHeader({
  children
}: {
  children: ReactNode
}) {

  return (
    <th
      className="
        px-4
        py-3
        text-left
        text-[11px]
        font-black
        uppercase
        tracking-[0.05em]
        text-muted-foreground
      "
    >
      {children}
    </th>
  )
}


function TableCell({
  children
}: {
  children: ReactNode
}) {

  return (
    <td
      className="
        px-4
        py-4
        align-top
      "
    >
      {children}
    </td>
  )
}


function MetricValue({
  children
}: {
  children: ReactNode
}) {

  return (
    <span
      className="
        font-mono
        text-sm
        font-black
      "
    >
      {children}
    </span>
  )
}


function DeltaValue({
  value
}: {
  value: number
}) {

  const className =
    value > 0
      ? `
        text-emerald-600
        dark:text-emerald-400
      `
      : value < 0
        ? `
          text-red-600
          dark:text-red-400
        `
        : "text-muted-foreground"


  return (
    <span
      className={`
        font-mono
        text-xs
        font-black
        ${className}
      `}
    >
      {
        formatDecimalDelta(
          value
        )
      }
    </span>
  )
}


function LoadingState() {

  return (
    <div
      className="
        flex
        min-h-[480px]
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
          전체 RAG Evaluation Report를 불러오는 중입니다.
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
        min-h-[480px]
        items-center
        justify-center
      "
    >
      <div
        className="
          max-w-xl
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
          RAG Result 조회 실패
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
  ).toFixed(
    2
  )}%`
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


  return "RAG Evaluation Report 조회 중 알 수 없는 오류가 발생했습니다."
}