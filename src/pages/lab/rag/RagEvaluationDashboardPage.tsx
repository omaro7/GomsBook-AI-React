import type {
  ReactNode
} from "react"

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FlaskConical,
  GitBranch,
  Target,
  Trophy
} from "lucide-react"

import {
  Link
} from "react-router-dom"


type RagStrategy =
  | "VECTOR"
  | "GRAPH"
  | "HYBRID"


interface ExperimentSummary {
  id: string
  label: string
  strategy: RagStrategy
  description: string
  hitRateAt5: number
  mrr: number
}


const experiments: ExperimentSummary[] = [
  {
    id: "VECTOR_ONLY_V1",
    label: "VECTOR",
    strategy: "VECTOR",
    description: "Baseline",
    hitRateAt5: 0.9118,
    mrr: 0.8333
  },
  {
    id: "VECTOR_GRAPH_V1",
    label: "G1",
    strategy: "GRAPH",
    description: "Simple Spine Graph",
    hitRateAt5: 0.8235,
    mrr: 0.5515
  },
  {
    id: "VECTOR_GRAPH_V2",
    label: "G2",
    strategy: "GRAPH",
    description: "Document Policy",
    hitRateAt5: 0.8529,
    mrr: 0.5574
  },
  {
    id: "VECTOR_GRAPH_V3",
    label: "G3",
    strategy: "GRAPH",
    description: "Graph Weight 0.05",
    hitRateAt5: 0.9118,
    mrr: 0.6446
  },
  {
    id: "VECTOR_GRAPH_V4",
    label: "G4",
    strategy: "GRAPH",
    description: "Seed Top-1",
    hitRateAt5: 0.9118,
    mrr: 0.6618
  },
  {
    id: "VECTOR_GRAPH_V5",
    label: "G5",
    strategy: "GRAPH",
    description: "Graph Weight 0.025",
    hitRateAt5: 0.9118,
    mrr: 0.6912
  },
  {
    id: "VECTOR_GRAPH_V6",
    label: "G6",
    strategy: "GRAPH",
    description: "Candidate Chunk Policy",
    hitRateAt5: 0.9118,
    mrr: 0.8627
  },
  {
    id: "HYBRID_V1",
    label: "H1",
    strategy: "HYBRID",
    description: "Top-5 + Top-5 Weighted RRF",
    hitRateAt5: 0.9118,
    mrr: 0.8627
  },
  {
    id: "HYBRID_V2",
    label: "H2",
    strategy: "HYBRID",
    description: "Top-10 + Top-10 Weighted RRF",
    hitRateAt5: 0.9706,
    mrr: 0.9216
  }
]


const dashboard = {
  projectId: "lunchwork_seoul",
  datasetName: "rag-golden-v1",
  datasetFileName: "rag-lunchwork_seoul-golden-v1.json",

  totalCases: 40,
  answerableCases: 34,
  unanswerableCases: 6,

  experimentCount: 9,

  baseline: {
    experimentId: "VECTOR_ONLY_V1",
    hitRateAt5: 0.9118,
    mrr: 0.8333,
    hitCount: 31,
    missCount: 3
  },

  final: {
    experimentId: "HYBRID_V2",
    hitRateAt5: 0.9706,
    recallAt5: 0.9706,
    mrr: 0.9216,
    answerScore: 0.8787,
    hitCount: 33,
    missCount: 1
  }
}


export function RagEvaluationDashboardPage() {

  const hitRateDelta =
    dashboard.final.hitRateAt5 -
    dashboard.baseline.hitRateAt5

  const mrrDelta =
    dashboard.final.mrr -
    dashboard.baseline.mrr

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
                rounded-[var(--goms-radius-round)]
                bg-[var(--goms-primary-soft)]
                px-3
                py-1.5
                text-xs
                font-black
                tracking-[0.08em]
                text-primary
              "
            >
              <FlaskConical
                className="
                  size-3.5
                "
              />

              RAG LAB
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
              Golden Dataset 기반
              <br />

              <span
                className="
                  text-primary
                "
              >
                RAG Retrieval 실험
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
              Vector Baseline부터 Graph Retrieval,
              Hybrid Retrieval까지 단계적으로 변경하고
              Hit Rate@5, Recall@5, MRR을 통해
              검색 성능을 검증합니다.
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
                Project · {dashboard.projectId}
              </InfoPill>

              <InfoPill>
                Golden Cases · {dashboard.totalCases}
              </InfoPill>

              <InfoPill>
                Experiments · {dashboard.experimentCount}
              </InfoPill>

              <InfoPill>
                Final · {dashboard.final.experimentId}
              </InfoPill>
            </div>
          </div>


          <FinalResultCard
            hitRate={dashboard.final.hitRateAt5}
            recall={dashboard.final.recallAt5}
            mrr={dashboard.final.mrr}
            hitCount={dashboard.final.hitCount}
            evaluatedCases={dashboard.answerableCases}
            hitRateDelta={hitRateDelta}
            mrrDelta={mrrDelta}
          />
        </section>


        <section>
          <SectionHeader
            kicker="01 · EVALUATION SUMMARY"
            title="평가 현황"
            description="현재 Golden Dataset과 Retrieval 실험의 전체 상태를 요약합니다."
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
                <Database
                  className="
                    size-4
                  "
                />
              }
              label="Golden Dataset"
              value={String(dashboard.totalCases)}
              description={
                `${dashboard.answerableCases} Answerable · ${dashboard.unanswerableCases} Unanswerable`
              }
            />


            <SummaryCard
              icon={
                <FlaskConical
                  className="
                    size-4
                  "
                />
              }
              label="Experiments"
              value={String(dashboard.experimentCount)}
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
              label="Retrieval HIT"
              value={
                `${dashboard.final.hitCount}/${dashboard.answerableCases}`
              }
              description={
                `${dashboard.final.missCount} Stable Miss`
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
              label="Final Candidate"
              value="HYBRID_V2"
              description="현재 Retrieval 최종 Candidate"
              emphasized
            />
          </div>
        </section>


        <section>
          <SectionHeader
            kicker="02 · STRATEGY EVOLUTION"
            title="Retrieval 전략의 발전"
            description="Vector Baseline을 기준으로 Graph 구조를 검증하고 Weighted RRF 기반 Hybrid Retrieval로 확장했습니다."
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
              strategy="VECTOR"
              title="Vector"
              version="Baseline"
              metric="MRR 0.8333"
              description="Semantic Vector Retrieval의 기준 성능을 측정합니다."
              href="/lab/rag/vector"
            />


            <StrategyArrow />


            <StrategyCard
              strategy="GRAPH"
              title="Graph"
              version="V1 → V6"
              metric="MRR 0.8627"
              description="EPUB 구조, Graph Weight, Candidate Policy를 단계적으로 검증합니다."
              href="/lab/rag/graph"
            />


            <StrategyArrow />


            <StrategyCard
              strategy="HYBRID"
              title="Hybrid"
              version="V1 → V2"
              metric="MRR 0.9216"
              description="Vector와 Vector Graph 결과를 Weighted RRF로 결합합니다."
              href="/lab/rag/hybrid"
            />
          </div>
        </section>


        <section>
          <SectionHeader
            kicker="03 · PERFORMANCE EVOLUTION"
            title="실험별 성능 변화"
            description="Graph 도입 초기 Regression부터 HYBRID_V2의 최종 개선까지 Retrieval Metric 변화를 확인합니다."
          />


          <div
            className="
              grid
              grid-cols-[2fr_1fr]
              gap-5
              max-lg:grid-cols-1
            "
          >
            <div
              className="
                overflow-hidden
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
                  items-start
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
                    34 Answerable Cases · Final Top-5
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
                    colorClass="bg-primary"
                    label="Hit Rate@5"
                  />

                  <Legend
                    colorClass="bg-[var(--goms-violet)]"
                    label="MRR"
                  />
                </div>
              </div>


              <PerformanceChart
                experiments={experiments}
              />
            </div>


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
                  flex
                  items-center
                  gap-2
                "
              >
                <BarChart3
                  className="
                    size-4
                    text-primary
                  "
                />

                <h3
                  className="
                    text-base
                    font-black
                    tracking-[-0.025em]
                  "
                >
                  Key Findings
                </h3>
              </div>


              <div
                className="
                  mt-4
                "
              >
                <Finding
                  title="Graph V1 Regression"
                  description="Graph를 단순 추가했을 때 Baseline보다 Retrieval 성능이 크게 하락했습니다."
                />

                <Finding
                  title="Graph V6 Recovery"
                  description="Candidate Chunk Policy 적용 후 MRR이 0.8627까지 상승했습니다."
                />

                <Finding
                  title="Hybrid Candidate Expansion"
                  description="HYBRID_V2에서 Top-10 + Top-10 후보군으로 확장해 Hit Rate@5가 0.9706까지 상승했습니다."
                />

                <Finding
                  title="Regression Control"
                  description="HYBRID_V2에서는 HIT_TO_MISS와 Rank Regression이 발생하지 않았습니다."
                  last
                />
              </div>
            </div>
          </div>
        </section>


        <section>
          <SectionHeader
            kicker="04 · FINAL VALIDATION"
            title="Baseline 대비 최종 결과"
            description="VECTOR_ONLY_V1에서 HYBRID_V2까지의 최종 개선 폭을 정리합니다."
          />


          <div
            className="
              grid
              grid-cols-[1.35fr_0.65fr]
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
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  max-sm:flex-col
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
                    VECTOR_ONLY_V1 → HYBRID_V2
                  </h3>
                </div>


                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-[var(--goms-radius-round)]
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
                  grid-cols-3
                  gap-4
                  max-sm:grid-cols-1
                "
              >
                <DeltaMetric
                  label="Hit Rate@5"
                  before="91.18%"
                  after="97.06%"
                  delta="+5.88%p"
                />

                <DeltaMetric
                  label="MRR"
                  before="0.8333"
                  after="0.9216"
                  delta="+0.0883"
                />

                <DeltaMetric
                  label="HIT"
                  before="31 / 34"
                  after="33 / 34"
                  delta="+2"
                />
              </div>


              <div
                className="
                  mt-6
                  flex
                  justify-end
                "
              >
                <Link
                  to="/lab/rag/result"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-primary
                    hover:underline
                  "
                >
                  전체 결과 보기

                  <ArrowRight
                    className="
                      size-4
                    "
                  />
                </Link>
              </div>
            </div>


            <div
              className="
                rounded-[var(--goms-radius-lg)]
                border
                border-amber-200
                bg-card
                p-6
                shadow-[var(--goms-shadow-xs)]
                dark:border-amber-900
              "
            >
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-[var(--goms-radius-sm)]
                  bg-amber-50
                  text-amber-600
                  dark:bg-amber-950/30
                  dark:text-amber-400
                "
              >
                <AlertTriangle
                  className="
                    size-5
                  "
                />
              </div>


              <div
                className="
                  mt-5
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.08em]
                  text-amber-600
                  dark:text-amber-400
                "
              >
                Remaining Stable Miss
              </div>


              <h3
                className="
                  mt-2
                  text-xl
                  font-black
                  tracking-[-0.03em]
                "
              >
                RAG-GOLD-008
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                HYBRID_V2에서도 Expected Document가
                Final Top-5에 진입하지 못한
                마지막 Retrieval Failure입니다.
              </p>


              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  rounded-[var(--goms-radius-md)]
                  bg-muted/50
                  px-4
                  py-3
                "
              >
                <span
                  className="
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  Remaining
                </span>

                <strong
                  className="
                    text-sm
                    text-amber-600
                    dark:text-amber-400
                  "
                >
                  1 / 34
                </strong>
              </div>


              <Link
                to="/lab/rag/hybrid"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-primary
                  hover:underline
                "
              >
                HYBRID_V2 보기

                <ArrowRight
                  className="
                    size-4
                  "
                />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
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


interface FinalResultCardProps {
  hitRate: number
  recall: number
  mrr: number
  hitCount: number
  evaluatedCases: number
  hitRateDelta: number
  mrrDelta: number
}


function FinalResultCard({
  hitRate,
  recall,
  mrr,
  hitCount,
  evaluatedCases,
  hitRateDelta,
  mrrDelta
}: FinalResultCardProps) {

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
          FINAL RETRIEVAL CANDIDATE
        </div>


        <h2
          className="
            mt-2
            text-2xl
            font-black
            tracking-[-0.04em]
          text-white
          "
        >
          HYBRID_V2
        </h2>


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
            value={formatPercentage(hitRate)}
          />

          <DarkMetric
            label="Recall@5"
            value={formatPercentage(recall)}
          />

          <DarkMetric
            label="MRR"
            value={mrr.toFixed(4)}
          />
        </div>


        <div
          className="
            mt-5
            rounded-[var(--goms-radius-md)]
            bg-white
            p-4
            text-[#15345f]
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              max-sm:flex-col
              max-sm:items-start
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
                Golden Dataset Result
              </div>

              <div
                className="
                  mt-1
                  text-lg
                  font-black
                "
              >
                {hitCount} / {evaluatedCases} HIT
              </div>
            </div>


            <div
              className="
                flex
                gap-5
              "
            >
              <DeltaValue
                label="Hit Δ"
                value={
                  `+${formatPercentagePoint(hitRateDelta)}`
                }
              />

              <DeltaValue
                label="MRR Δ"
                value={
                  `+${mrrDelta.toFixed(4)}`
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
          tracking-[-0.04em]
        "
      >
        {value}
      </div>
    </div>
  )
}


function DeltaValue({
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
          text-[10px]
          font-bold
          text-[#708098]
        "
      >
        {label}
      </div>

      <div
        className="
          mt-0.5
          text-sm
          font-black
          text-[#0f9f78]
        "
      >
        {value}
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


interface SummaryCardProps {
  icon: ReactNode
  label: string
  value: string
  description: string
  emphasized?: boolean
}


function SummaryCard({
  icon,
  label,
  value,
  description,
  emphasized = false
}: SummaryCardProps) {

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
          leading-none
          tracking-[-0.04em]
        "
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


interface StrategyCardProps {
  strategy: RagStrategy
  title: string
  version: string
  metric: string
  description: string
  href: string
}


function StrategyCard({
  strategy,
  title,
  version,
  metric,
  description,
  href
}: StrategyCardProps) {

  const icon =
    strategy === "VECTOR"
      ? (
        <Target
          className="
            size-5
          "
        />
      )
      : strategy === "GRAPH"
        ? (
          <GitBranch
            className="
              size-5
            "
          />
        )
        : (
          <FlaskConical
            className="
              size-5
            "
          />
        )


  const iconClassName =
    strategy === "VECTOR"
      ? `
        bg-[var(--goms-primary-soft)]
        text-primary
      `
      : strategy === "GRAPH"
        ? `
          bg-[color-mix(in_srgb,var(--goms-violet)_10%,transparent)]
          text-[var(--goms-violet)]
        `
        : `
          bg-emerald-50
          text-emerald-700
          dark:bg-emerald-950/30
          dark:text-emerald-400
        `


  return (
    <Link
      to={href}
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
        className={`
          flex
          size-10
          items-center
          justify-center
          rounded-[var(--goms-radius-sm)]
          ${iconClassName}
        `}
      >
        {icon}
      </div>


      <div
        className="
          mt-5
          flex
          items-end
          justify-between
          gap-3
        "
      >
        <div>
          <h3
            className="
              text-lg
              font-black
              tracking-[-0.03em]
            "
          >
            {title}
          </h3>

          <div
            className="
              mt-0.5
              text-xs
              font-bold
              text-muted-foreground
            "
          >
            {version}
          </div>
        </div>


        <span
          className="
            rounded-[var(--goms-radius-round)]
            bg-muted
            px-2.5
            py-1
            font-mono
            text-[11px]
            font-bold
          "
        >
          {metric}
        </span>
      </div>


      <p
        className="
          mt-4
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>


      <div
        className="
          mt-5
          flex
          items-center
          gap-1
          text-xs
          font-bold
          text-primary
        "
      >
        실험 보기

        <ArrowRight
          className="
            size-3.5
            transition-transform
            group-hover:translate-x-0.5
          "
        />
      </div>
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
        max-lg:py-1
      "
      aria-hidden="true"
    >
      <ArrowRight
        className="
          size-5
        "
      />
    </div>
  )
}


function PerformanceChart({
  experiments
}: {
  experiments: ExperimentSummary[]
}) {

  const width = 760
  const height = 280

  const left = 44
  const right = 20
  const top = 18
  const bottom = 42

  const minimumValue = 0.5
  const maximumValue = 1.0

  const graphWidth =
    width -
    left -
    right

  const graphHeight =
    height -
    top -
    bottom


  function resolveX(
    index: number
  ) {

    return left +
      (
        graphWidth *
        index /
        (
          experiments.length -
          1
        )
      )
  }


  function resolveY(
    value: number
  ) {

    const normalized =
      (
        value -
        minimumValue
      ) /
      (
        maximumValue -
        minimumValue
      )

    return top +
      graphHeight *
      (
        1 -
        normalized
      )
  }


  const hitRatePoints =
    experiments
      .map(
        (
          experiment,
          index
        ) =>
          `${resolveX(index)},${resolveY(experiment.hitRateAt5)}`
      )
      .join(" ")


  const mrrPoints =
    experiments
      .map(
        (
          experiment,
          index
        ) =>
          `${resolveX(index)},${resolveY(experiment.mrr)}`
      )
      .join(" ")


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
        viewBox={`0 0 ${width} ${height}`}
        className="
          min-w-[700px]
        "
        role="img"
        aria-label="RAG 실험별 Hit Rate@5 및 MRR 성능 변화"
      >
        {
          ticks.map(
            tick => {

              const y =
                resolveY(
                  tick
                )

              return (
                <g
                  key={tick}
                >
                  <line
                    x1={left}
                    y1={y}
                    x2={width - right}
                    y2={y}
                    className="
                      stroke-border
                    "
                    strokeWidth="1"
                  />

                  <text
                    x={left - 8}
                    y={y + 4}
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
          points={hitRatePoints}
          className="
            fill-none
            stroke-primary
          "
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        <polyline
          points={mrrPoints}
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
              experiment,
              index
            ) => {

              const x =
                resolveX(
                  index
                )

              const hitRateY =
                resolveY(
                  experiment.hitRateAt5
                )

              const mrrY =
                resolveY(
                  experiment.mrr
                )

              return (
                <g
                  key={experiment.id}
                >
                  <circle
                    cx={x}
                    cy={hitRateY}
                    r="4"
                    className="
                      fill-primary
                    "
                  />

                  <circle
                    cx={x}
                    cy={mrrY}
                    r="4"
                    className="
                      fill-[var(--goms-violet)]
                    "
                  />

                  <text
                    x={x}
                    y={height - 14}
                    textAnchor="middle"
                    className="
                      fill-muted-foreground
                      text-[10px]
                      font-bold
                    "
                  >
                    {experiment.label}
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


function Legend({
  colorClass,
  label
}: {
  colorClass: string
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
          ${colorClass}
        `}
      />

      {label}
    </span>
  )
}


function Finding({
  title,
  description,
  last = false
}: {
  title: string
  description: string
  last?: boolean
}) {

  return (
    <div
      className={`
        py-4
        ${
          last
            ? ""
            : "border-b border-dashed border-border"
        }
      `}
    >
      <div
        className="
          flex
          gap-3
        "
      >
        <span
          className="
            mt-1.5
            size-2
            shrink-0
            rounded-full
            bg-primary
          "
        />

        <div>
          <div
            className="
              text-sm
              font-black
            "
          >
            {title}
          </div>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}


function DeltaMetric({
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
            text-sm
            font-bold
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
            text-lg
            tracking-[-0.03em]
          "
        >
          {after}
        </strong>
      </div>


      <div
        className="
          mt-2
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


function formatPercentage(
  value: number
): string {

  return `${(
    value *
    100
  ).toFixed(2)}%`
}


function formatPercentagePoint(
  value: number
): string {

  return `${(
    value *
    100
  ).toFixed(2)}%p`
}