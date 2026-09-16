import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import {
  AlertCircle,
  Braces,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Database,
  FileJson,
  Filter,
  Search,
  ShieldCheck
} from "lucide-react"


type GoldenCaseType =
  | "ANSWERABLE"
  | "NO_ANSWER"


type GoldenCaseDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD"


interface GoldenCase {
  id: string
  type: GoldenCaseType
  category?: string
  difficulty?: GoldenCaseDifficulty
  question: string
  referenceAnswer: string
  sourceHints: string[]
  tags: string[]
}


interface GoldenDataset {
  name: string
  version: string
  projectId: string
  projectName: string
  description: string
  caseCount: number
  cases: GoldenCase[]
}


type PageTab =
  | "overview"
  | "cases"
  | "json"


type CaseFilter =
  | "ALL"
  | "ANSWERABLE"
  | "NO_ANSWER"


const PROJECT_ID =
  "lunchwork_seoul"


export function RagGoldenDatasetPage() {

  const [
    dataset,
    setDataset
  ] =
    useState<GoldenDataset | null>(
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

  const [
    activeTab,
    setActiveTab
  ] =
    useState<PageTab>(
      "overview"
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

          const GOLDEN_DATASET_URL =
            "/lab/rag/dataset/rag-lunchwork_seoul-golden-v1.json"
          const response =
            await fetch(
              GOLDEN_DATASET_URL,
              {
                signal:
                    controller.signal
              }
            )

          if (
            !response.ok
          ) {

            throw new Error(
              `Golden Dataset 조회에 실패했습니다. HTTP ${response.status}`
            )
          }


          const data =
            await response.json() as GoldenDataset


          setDataset(
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
    !dataset
  ) {

    return (
      <PageShell>
        <ErrorState
          message={
            error ??
            "Golden Dataset을 불러올 수 없습니다."
          }
        />
      </PageShell>
    )
  }


  return (
    <PageShell>

      <section>
        <div
          className="
            inline-flex
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
          <Database
            className="
              size-3.5
            "
          />

          GOLDEN DATASET
        </div>


        <h1
          className="
            mt-4
            text-[clamp(2rem,4vw,3.2rem)]
            font-black
            leading-[1.08]
            tracking-[-0.05em]
          "
        >
          Retrieval 평가의
          {" "}

          <span
            className="
              text-primary
            "
          >
            고정 기준 데이터
          </span>
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
          모든 Vector, Graph, Hybrid 실험은
          동일한 Golden Dataset을 기준으로 평가합니다.
          질문, 기준 답변, Expected Source를 고정하여
          Retrieval 변경에 따른 성능 차이를 비교합니다.
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
            {dataset.name}
          </InfoPill>

          <InfoPill>
            Version · {dataset.version}
          </InfoPill>

          <InfoPill>
            Project · {dataset.projectId}
          </InfoPill>

          <InfoPill>
            Cases · {dataset.caseCount}
          </InfoPill>
        </div>
      </section>


      <DatasetTabs
        activeTab={
          activeTab
        }
        onChange={
          setActiveTab
        }
      />


      {
        activeTab ===
        "overview"
          ? (
            <OverviewTab
              dataset={
                dataset
              }
            />
          )
          : null
      }


      {
        activeTab ===
        "cases"
          ? (
            <CasesTab
              dataset={
                dataset
              }
            />
          )
          : null
      }


      {
        activeTab ===
        "json"
          ? (
            <JsonTab
              dataset={
                dataset
              }
            />
          )
          : null
      }

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
          gap-10
        "
      >
        {children}
      </div>
    </main>
  )
}


function DatasetTabs({
  activeTab,
  onChange
}: {
  activeTab: PageTab
  onChange: (
    tab: PageTab
  ) => void
}) {

  return (
    <div
      className="
        border-b
        border-border
      "
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
        <TabButton
          active={
            activeTab ===
            "overview"
          }
          onClick={
            () =>
              onChange(
                "overview"
              )
          }
          icon={
            <Database
              className="
                size-4
              "
            />
          }
        >
          Overview
        </TabButton>


        <TabButton
          active={
            activeTab ===
            "cases"
          }
          onClick={
            () =>
              onChange(
                "cases"
              )
          }
          icon={
            <Filter
              className="
                size-4
              "
            />
          }
        >
          Cases
        </TabButton>


        <TabButton
          active={
            activeTab ===
            "json"
          }
          onClick={
            () =>
              onChange(
                "json"
              )
          }
          icon={
            <Braces
              className="
                size-4
              "
            />
          }
        >
          JSON
        </TabButton>
      </div>
    </div>
  )
}


function TabButton({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  children: ReactNode
}) {

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        relative
        flex
        shrink-0
        items-center
        gap-2
        px-4
        py-3
        text-sm
        font-bold
        transition-colors
        ${
          active
            ? `
              text-primary
            `
            : `
              text-muted-foreground
              hover:text-foreground
            `
        }
      `}
    >
      {icon}

      {children}


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
                bg-primary
              "
            />
          )
          : null
      }
    </button>
  )
}


function OverviewTab({
  dataset
}: {
  dataset: GoldenDataset
}) {

  const answerableCount =
    useMemo(
      () =>
        dataset.cases.filter(
          item =>
            item.type ===
            "ANSWERABLE"
        ).length,
      [
        dataset.cases
      ]
    )


  const noAnswerCount =
    dataset.caseCount -
    answerableCount


  const categoryCounts =
    useMemo(
      () =>
        createCountMap(
          dataset.cases
            .map(
              item =>
                resolveCategory(
                  item
                )
            )
            .filter(
              value =>
                value !== "-"
            )
        ),
      [
        dataset.cases
      ]
    )


  const difficultyCounts =
    useMemo(
      () =>
        createCountMap(
          dataset.cases
            .map(
              item =>
                item.difficulty
            )
            .filter(
              (
                value
              ): value is GoldenCaseDifficulty =>
                Boolean(
                  value
                )
            )
        ),
      [
        dataset.cases
      ]
    )


  return (
    <div
      className="
        flex
        flex-col
        gap-8
      "
    >
      <section>
        <SectionHeader
          kicker="01 · DATASET SUMMARY"
          title="Dataset 구성"
          description="Golden Dataset의 기본 메타데이터와 Retrieval 평가 대상을 확인합니다."
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
            label="Total Cases"
            value={
              String(
                dataset.caseCount
              )
            }
            description="전체 Golden Case"
          />

          <MetricCard
            label="Answerable"
            value={
              String(
                answerableCount
              )
            }
            description="Retrieval 평가 대상"
            tone="success"
          />

          <MetricCard
            label="No Answer"
            value={
              String(
                noAnswerCount
              )
            }
            description="Hallucination 방어 대상"
            tone="warning"
          />

          <MetricCard
            label="Version"
            value={
              dataset.version
            }
            description={
              dataset.name
            }
          />
        </div>
      </section>


      <section>
        <SectionHeader
          kicker="02 · DATASET ROLE"
          title="Golden Dataset이 담당하는 역할"
          description="실험마다 평가 기준이 바뀌지 않도록 질문과 정답 근거를 고정합니다."
        />


        <div
          className="
            grid
            grid-cols-3
            gap-4
            max-lg:grid-cols-1
          "
        >
          <RoleCard
            number="01"
            title="Question"
            description="사용자 질문을 고정하여 Retriever 변경 전후를 동일 조건에서 비교합니다."
          />

          <RoleCard
            number="02"
            title="Reference Answer"
            description="질문에 대한 기준 답변을 보존하여 Answer Evaluation의 비교 기준으로 사용합니다."
          />

          <RoleCard
            number="03"
            title="Source Hints"
            description="정답이 존재하는 EPUB 문서와 Chunk 위치를 지정해 Hit@K, Recall@K, MRR을 계산합니다."
          />
        </div>
      </section>


      <section
        className="
          grid
          grid-cols-2
          gap-5
          max-lg:grid-cols-1
        "
      >
        <DistributionCard
          title="Category Distribution"
          description="질문 유형별 Case 구성"
          counts={
            categoryCounts
          }
        />

        <DistributionCard
          title="Difficulty Distribution"
          description="난이도별 Case 구성"
          counts={
            difficultyCounts
          }
        />
      </section>


      <section
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
            gap-4
          "
        >
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-[var(--goms-radius-sm)]
              bg-[var(--goms-primary-soft)]
              text-primary
            "
          >
            <ShieldCheck
              className="
                size-5
              "
            />
          </div>


          <div>
            <h3
              className="
                text-base
                font-black
                tracking-[-0.025em]
              "
            >
              Evaluation Contract
            </h3>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Vector, Graph, Hybrid 실험은
              Golden Dataset 자체를 변경하지 않고
              동일한 Case와 Source Hint를 기준으로
              비교합니다.
              Retrieval 알고리즘 변경과 평가 데이터 변경을
              분리하여 실험 결과의 비교 가능성을 유지합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}


function CasesTab({
  dataset
}: {
  dataset: GoldenDataset
}) {

  const [
    query,
    setQuery
  ] =
    useState(
      ""
    )

  const [
    filter,
    setFilter
  ] =
    useState<CaseFilter>(
      "ALL"
    )

  const [
    expandedCaseId,
    setExpandedCaseId
  ] =
    useState<string | null>(
      null
    )


  const filteredCases =
    useMemo(
      () => {

        const normalizedQuery =
          query
            .trim()
            .toLowerCase()


        return dataset.cases.filter(
          item => {

            if (
              filter !== "ALL" &&
              item.type !== filter
            ) {

              return false
            }


            if (
              !normalizedQuery
            ) {

              return true
            }


            const searchable =
              [
                item.id,
                item.question,
                item.referenceAnswer,
                item.category ?? "",
                item.difficulty ?? "",
                ...item.sourceHints,
                ...item.tags
              ]
                .join(
                  " "
                )
                .toLowerCase()


            return searchable.includes(
              normalizedQuery
            )
          }
        )
      },
      [
        dataset.cases,
        query,
        filter
      ]
    )


  return (
    <section>
      <SectionHeader
        kicker="01 · GOLDEN CASES"
        title="평가 Case"
        description="질문, 기준 답변, Expected Source와 Case 속성을 직접 확인합니다."
      />


      <div
        className="
          mb-5
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            relative
            w-full
            max-w-md
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
            placeholder="Case ID, 질문, Source 검색"
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
              transition
              placeholder:text-muted-foreground
              focus:border-primary/50
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </div>


        <div
          className="
            flex
            items-center
            gap-1
            rounded-[var(--goms-radius-sm)]
            border
            border-border
            bg-card
            p-1
          "
        >
          {
            (
              [
                "ALL",
                "ANSWERABLE",
                "NO_ANSWER"
              ] as CaseFilter[]
            )
              .map(
                value => (
                  <FilterButton
                    key={
                      value
                    }
                    active={
                      filter ===
                      value
                    }
                    onClick={
                      () =>
                        setFilter(
                          value
                        )
                    }
                  >
                    {
                      resolveFilterLabel(
                        value
                      )
                    }
                  </FilterButton>
                )
              )
          }
        </div>
      </div>


      <div
        className="
          mb-3
          text-xs
          font-bold
          text-muted-foreground
        "
      >
        {
          filteredCases.length
        }
        {" "}
        Cases
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
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[850px]
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
                  Case
                </TableHeader>

                <TableHeader>
                  Type
                </TableHeader>

                <TableHeader>
                  Category
                </TableHeader>

                <TableHeader>
                  Difficulty
                </TableHeader>

                <TableHeader>
                  Question
                </TableHeader>

                <TableHeader
                  className="
                    w-12
                  "
                >
                  <span
                    className="
                      sr-only
                    "
                  >
                    Detail
                  </span>
                </TableHeader>
              </tr>
            </thead>


            <tbody>
              {
                filteredCases.map(
                  item => {

                    const expanded =
                      expandedCaseId ===
                      item.id


                    return (
                      <GoldenCaseRows
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                        expanded={
                          expanded
                        }
                        onToggle={
                          () =>
                            setExpandedCaseId(
                              expanded
                                ? null
                                : item.id
                            )
                        }
                      />
                    )
                  }
                )
              }
            </tbody>
          </table>
        </div>


        {
          filteredCases.length ===
          0
            ? (
              <div
                className="
                  px-6
                  py-16
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                조건에 맞는 Golden Case가 없습니다.
              </div>
            )
            : null
        }
      </div>
    </section>
  )
}


function GoldenCaseRows({
  item,
  expanded,
  onToggle
}: {
  item: GoldenCase
  expanded: boolean
  onToggle: () => void
}) {

  return (
    <>
      <tr
        className="
          border-t
          border-border
          transition-colors
          first:border-t-0
          hover:bg-muted/25
        "
      >
        <TableCell>
          <span
            className="
              font-mono
              text-xs
              font-bold
            "
          >
            {item.id}
          </span>
        </TableCell>


        <TableCell>
          <CaseTypeBadge
            type={
              item.type
            }
          />
        </TableCell>


        <TableCell>
          <span
            className="
              text-xs
              font-bold
              text-muted-foreground
            "
          >
            {
              resolveCategory(
                item
              )
            }
          </span>
        </TableCell>


        <TableCell>
          <DifficultyBadge
            difficulty={
              item.difficulty
            }
          />
        </TableCell>


        <TableCell>
          <button
            type="button"
            onClick={
              onToggle
            }
            className="
              max-w-[520px]
              text-left
              text-sm
              font-semibold
              leading-6
              hover:text-primary
            "
          >
            {item.question}
          </button>
        </TableCell>


        <TableCell>
          <button
            type="button"
            onClick={
              onToggle
            }
            aria-label={
              expanded
                ? `${item.id} 상세 닫기`
                : `${item.id} 상세 보기`
            }
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-[var(--goms-radius-sm)]
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            {
              expanded
                ? (
                  <ChevronUp
                    className="
                      size-4
                    "
                  />
                )
                : (
                  <ChevronDown
                    className="
                      size-4
                    "
                  />
                )
            }
          </button>
        </TableCell>
      </tr>


      {
        expanded
          ? (
            <tr
              className="
                border-t
                border-border
                bg-muted/20
              "
            >
              <td
                colSpan={
                  6
                }
                className="
                  px-5
                  py-5
                "
              >
                <CaseDetail
                  item={
                    item
                  }
                />
              </td>
            </tr>
          )
          : null
      }
    </>
  )
}


function CaseDetail({
  item
}: {
  item: GoldenCase
}) {

  return (
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
          flex
          flex-col
          gap-5
        "
      >
        <DetailBlock
          title="Question"
        >
          {item.question}
        </DetailBlock>


        <DetailBlock
          title="Reference Answer"
        >
          {item.referenceAnswer}
        </DetailBlock>
      </div>


      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        <div>
          <DetailTitle>
            Source Hints
          </DetailTitle>

          {
            item.sourceHints.length >
            0
              ? (
                <div
                  className="
                    mt-2
                    flex
                    flex-col
                    gap-2
                  "
                >
                  {
                    item.sourceHints.map(
                      source => (
                        <code
                          key={
                            source
                          }
                          className="
                            rounded-[var(--goms-radius-sm)]
                            bg-card
                            px-3
                            py-2
                            font-mono
                            text-xs
                            text-primary
                          "
                        >
                          {source}
                        </code>
                      )
                    )
                  }
                </div>
              )
              : (
                <p
                  className="
                    mt-2
                    text-sm
                    text-muted-foreground
                  "
                >
                  Expected Source 없음
                </p>
              )
          }
        </div>


        <div>
          <DetailTitle>
            Tags
          </DetailTitle>

          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-1.5
            "
          >
            {
              item.tags.map(
                tag => (
                  <span
                    key={
                      tag
                    }
                    className="
                      rounded-[var(--goms-radius-round)]
                      bg-card
                      px-2.5
                      py-1
                      text-[11px]
                      font-bold
                      text-muted-foreground
                    "
                  >
                    {tag}
                  </span>
                )
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}


function JsonTab({
  dataset
}: {
  dataset: GoldenDataset
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
          dataset,
          null,
          2
        ),
      [
        dataset
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
        kicker="01 · RAW DATA"
        title="Golden Dataset JSON"
        description="실제 평가에 사용되는 Golden Dataset 원본을 그대로 확인합니다."
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
              rag-{dataset.projectId}-golden-v1.json
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


function MetricCard({
  label,
  value,
  description,
  tone = "default"
}: {
  label: string
  value: string
  description: string
  tone?:
    | "default"
    | "success"
    | "warning"
}) {

  const valueClassName =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
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
          ${valueClassName}
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


function RoleCard({
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
          tracking-[-0.03em]
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


function DistributionCard({
  title,
  description,
  counts
}: {
  title: string
  description: string
  counts: Record<string, number>
}) {

  const entries =
    Object.entries(
      counts
    )
      .sort(
        (
          left,
          right
        ) =>
          right[1] -
          left[1]
      )


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
      <h3
        className="
          text-base
          font-black
          tracking-[-0.025em]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-1
          text-xs
          text-muted-foreground
        "
      >
        {description}
      </p>


      <div
        className="
          mt-5
          flex
          flex-col
        "
      >
        {
          entries.map(
            (
              [
                key,
                value
              ],
              index
            ) => (
              <div
                key={
                  key
                }
                className={`
                  flex
                  items-center
                  justify-between
                  gap-4
                  py-3
                  ${
                    index ===
                    0
                      ? ""
                      : "border-t border-dashed border-border"
                  }
                `}
              >
                <span
                  className="
                    text-sm
                    font-bold
                  "
                >
                  {key}
                </span>

                <span
                  className="
                    rounded-[var(--goms-radius-round)]
                    bg-[var(--goms-primary-soft)]
                    px-2.5
                    py-1
                    text-xs
                    font-black
                    text-primary
                  "
                >
                  {value}
                </span>
              </div>
            )
          )
        }


        {
          entries.length ===
          0
            ? (
              <div
                className="
                  py-6
                  text-sm
                  text-muted-foreground
                "
              >
                분류 데이터가 없습니다.
              </div>
            )
            : null
        }
      </div>
    </article>
  )
}


function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        rounded-[var(--goms-radius-sm)]
        px-3
        py-1.5
        text-xs
        font-bold
        transition-colors
        ${
          active
            ? `
              bg-[var(--goms-primary-soft)]
              text-primary
            `
            : `
              text-muted-foreground
              hover:text-foreground
            `
        }
      `}
    >
      {children}
    </button>
  )
}


function CaseTypeBadge({
  type
}: {
  type: GoldenCaseType
}) {

  if (
    type ===
    "ANSWERABLE"
  ) {

    return (
      <span
        className="
          inline-flex
          rounded-[var(--goms-radius-round)]
          bg-emerald-50
          px-2.5
          py-1
          text-[10px]
          font-black
          text-emerald-700
          dark:bg-emerald-950/30
          dark:text-emerald-400
        "
      >
        ANSWERABLE
      </span>
    )
  }


  return (
    <span
      className="
        inline-flex
        rounded-[var(--goms-radius-round)]
        bg-amber-50
        px-2.5
        py-1
        text-[10px]
        font-black
        text-amber-700
        dark:bg-amber-950/30
        dark:text-amber-400
      "
    >
      NO ANSWER
    </span>
  )
}


function DifficultyBadge({
  difficulty
}: {
  difficulty?: GoldenCaseDifficulty
}) {

  if (
    !difficulty
  ) {

    return (
      <span
        className="
          text-xs
          text-muted-foreground
        "
      >
        -
      </span>
    )
  }


  const className =
    difficulty === "EASY"
      ? `
        bg-emerald-50
        text-emerald-700
        dark:bg-emerald-950/30
        dark:text-emerald-400
      `
      : difficulty === "MEDIUM"
        ? `
          bg-amber-50
          text-amber-700
          dark:bg-amber-950/30
          dark:text-amber-400
        `
        : `
          bg-red-50
          text-red-700
          dark:bg-red-950/30
          dark:text-red-400
        `


  return (
    <span
      className={`
        inline-flex
        rounded-[var(--goms-radius-round)]
        px-2.5
        py-1
        text-[10px]
        font-black
        ${className}
      `}
    >
      {difficulty}
    </span>
  )
}


function TableHeader({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {

  return (
    <th
      className={`
        px-4
        py-3
        text-left
        text-[11px]
        font-black
        uppercase
        tracking-[0.05em]
        text-muted-foreground
        ${className}
      `}
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


function DetailBlock({
  title,
  children
}: {
  title: string
  children: ReactNode
}) {

  return (
    <div>
      <DetailTitle>
        {title}
      </DetailTitle>

      <p
        className="
          mt-2
          text-sm
          leading-7
          text-foreground/85
        "
      >
        {children}
      </p>
    </div>
  )
}


function DetailTitle({
  children
}: {
  children: ReactNode
}) {

  return (
    <div
      className="
        text-[11px]
        font-black
        uppercase
        tracking-[0.08em]
        text-muted-foreground
      "
    >
      {children}
    </div>
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
          Golden Dataset을 불러오는 중입니다.
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
        <div
          className="
            mx-auto
            flex
            size-10
            items-center
            justify-center
            rounded-[var(--goms-radius-sm)]
            bg-red-50
            text-red-600
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          <AlertCircle
            className="
              size-5
            "
          />
        </div>

        <h2
          className="
            mt-4
            text-lg
            font-black
          "
        >
          Golden Dataset 조회 실패
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


function resolveCategory(
  item: GoldenCase
): string {

  if (
    item.category
  ) {

    return item.category
  }


  if (
    item.tags.includes(
      "factual"
    )
  ) {

    return "FACTUAL"
  }


  if (
    item.tags.includes(
      "semantic"
    )
  ) {

    return "SEMANTIC"
  }


  if (
    item.tags.includes(
      "multi-context"
    )
  ) {

    return "MULTI_CONTEXT"
  }


  if (
    item.tags.includes(
      "descriptive"
    )
  ) {

    return "DESCRIPTIVE"
  }


  if (
    item.type ===
    "NO_ANSWER"
  ) {

    return "NO_ANSWER"
  }


  return "-"
}


function createCountMap(
  values: string[]
): Record<string, number> {

  return values.reduce<Record<string, number>>(
    (
      result,
      value
    ) => {

      result[value] =
        (
          result[value] ??
          0
        ) +
        1

      return result
    },
    {}
  )
}


function resolveFilterLabel(
  filter: CaseFilter
): string {

  if (
    filter ===
    "ANSWERABLE"
  ) {

    return "Answerable"
  }


  if (
    filter ===
    "NO_ANSWER"
  ) {

    return "No Answer"
  }


  return "All"
}


function resolveErrorMessage(
  reason: unknown
): string {

  if (
    reason instanceof Error
  ) {

    return reason.message
  }


  return "Golden Dataset 조회 중 알 수 없는 오류가 발생했습니다."
}