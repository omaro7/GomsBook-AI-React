import {
  BookOpen,
  Search,
  X
} from "lucide-react"

import {
  useMemo,
  useRef,
  useState
} from "react"

import {
  Button
} from "@/components/ui/button"

import {
  Input
} from "@/components/ui/input"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import {
  epubGuideItems
} from "@/data/epubGuideItems"

import type {
  EpubGuideItem
} from "@/models/EpubGuideItem"


type GuideSection =
  | "EPUB 정보"
  | "EPUB 생성"
  | "EPUB 검증"
  | "RAG"


const GUIDE_SECTIONS:
  GuideSection[] = [
    "EPUB 정보",
    "EPUB 생성",
    "EPUB 검증",
    "RAG"
  ]


interface EpubGuidePopoverProps {

  disabled?: boolean

  onSelect:
    (
      prompt: string
    ) => void
}


export function EpubGuidePopover({
  disabled = false,
  onSelect
}: EpubGuidePopoverProps) {

  const [
    open,
    setOpen
  ] = useState(false)

  const [
    query,
    setQuery
  ] = useState("")

  const [
    activeSection,
    setActiveSection
  ] = useState<GuideSection>(
    "EPUB 정보"
  )


  const scrollRef =
    useRef<HTMLDivElement | null>(
      null
    )


  const sectionRefs =
    useRef<
      Partial<
        Record<
          GuideSection,
          HTMLDivElement | null
        >
      >
    >(
      {}
    )


  const filteredItems =
    useMemo(
      () => {

        const normalizedQuery =
          query
            .trim()
            .toLowerCase()


        if (
          !normalizedQuery
        ) {

          return epubGuideItems
        }


        return epubGuideItems.filter(
          item => {

            const category =
              item.category
                .toLowerCase()

            const title =
              item.title
                .toLowerCase()

            const prompt =
              item.prompt
                .toLowerCase()

            const description =
              item.description
                ?.toLowerCase() ?? ""


            return category.includes(
              normalizedQuery
            )
              || title.includes(
                normalizedQuery
              )
              || prompt.includes(
                normalizedQuery
              )
              || description.includes(
                normalizedQuery
              )
          }
        )
      },
      [
        query
      ]
    )


  const sectionItems =
    useMemo(
      () => {

        const result:
          Record<
            GuideSection,
            EpubGuideItem[]
          > = {

            "EPUB 정보": [],

            "EPUB 생성": [],

            "EPUB 검증": [],

            "RAG": []
          }


        filteredItems.forEach(
          item => {

            const section =
              resolveSection(
                item
              )


            result[
              section
            ].push(
              item
            )
          }
        )


        return result
      },
      [
        filteredItems
      ]
    )


  function handleOpenChange(
    nextOpen: boolean
  ) {

    setOpen(
      nextOpen
    )


    if (
      !nextOpen
    ) {

      setQuery(
        ""
      )

      setActiveSection(
        "EPUB 정보"
      )
    }
  }


  function handleClose() {

    handleOpenChange(
      false
    )
  }


  function handleSelect(
    prompt: string
  ) {

    onSelect(
      prompt
    )

    handleOpenChange(
      false
    )
  }


  function handleSectionClick(
    section: GuideSection
  ) {

    const container =
      scrollRef.current

    const target =
      sectionRefs
        .current[
          section
        ]


    if (
      !container ||
      !target
    ) {

      return
    }


    setActiveSection(
      section
    )


    const containerRect =
      container
        .getBoundingClientRect()

    const targetRect =
      target
        .getBoundingClientRect()


    const targetTop =
      container.scrollTop
        + targetRect.top
        - containerRect.top
        - 8


    container.scrollTo({
      top: targetTop,
      behavior: "smooth"
    })
  }


  function handleScroll() {

    const container =
      scrollRef.current


    if (
      !container
    ) {

      return
    }


    const scrollTop =
      container.scrollTop

    const maxScrollTop =
      container.scrollHeight
        - container.clientHeight


    /*
     * 마지막 섹션은 화면 상단까지
     * 올라올 수 없으므로 스크롤 끝에서는
     * 마지막 표시 가능한 섹션을 활성화한다.
     */
    if (
      scrollTop
        >= maxScrollTop - 4
    ) {

      const lastSection =
        [...GUIDE_SECTIONS]
          .reverse()
          .find(
            section =>
              sectionRefs
                .current[
                  section
                ] != null
          )


      if (
        lastSection
      ) {

        setActiveSection(
          lastSection
        )
      }


      return
    }


    const containerTop =
      container
        .getBoundingClientRect()
        .top


    const activationTop =
      containerTop + 80


    let currentSection:
      GuideSection =
        "EPUB 정보"


    GUIDE_SECTIONS.forEach(
      section => {

        const element =
          sectionRefs
            .current[
              section
            ]


        if (
          !element
        ) {

          return
        }


        const rect =
          element
            .getBoundingClientRect()


        if (
          rect.top
            <= activationTop
        ) {

          currentSection =
            section
        }
      }
    )


    setActiveSection(
      currentSection
    )
  }


  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="
              h-8
              gap-1.5
              px-2
              text-xs
              text-muted-foreground
              hover:text-foreground
            "
          />
        }
      >
        <BookOpen
          className="
            size-4
          "
        />

        가이드
      </PopoverTrigger>


      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        className="
          w-[520px]
          overflow-hidden
          p-0
          max-sm:w-[calc(100vw-32px)]
        "
      >
        <div
          className="
            relative
            border-b
            p-4
          "
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="가이드 닫기"
            className="
              absolute
              right-2
              top-2
              size-8
              text-muted-foreground
              hover:text-foreground
            "
          >
            <X
              className="
                size-4
              "
            />
          </Button>


          <div
            className="
              pr-8
            "
          >
            <div
              className="
                text-sm
                font-semibold
              "
            >
              무엇을 도와드릴까요?
            </div>

            <div
              className="
                mt-1
                text-xs
                text-muted-foreground
              "
            >
              원하는 기능을 선택하면 질문 입력창에 자동으로 입력됩니다.
            </div>
          </div>


          <div
            className="
              relative
              mt-3
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

            <Input
              value={query}
              onChange={
                event =>
                  setQuery(
                    event.target.value
                  )
              }
              placeholder="기능 또는 질문 검색"
              className="
                h-9
                pl-9
              "
            />
          </div>


          <div
            className="
              mt-3
              flex
              gap-1.5
              overflow-x-auto
            "
          >
            {
              GUIDE_SECTIONS.map(
                section => {

                  const active =
                    activeSection
                      === section


                  return (
                    <Button
                      key={section}
                      type="button"
                      variant={
                        active
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={
                        () =>
                          handleSectionClick(
                            section
                          )
                      }
                      className="
                        h-8
                        shrink-0
                        px-3
                        text-xs
                      "
                    >
                      {section}
                    </Button>
                  )
                }
              )
            }
          </div>
        </div>


        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            h-[420px]
            overflow-y-auto
            scroll-smooth
          "
        >
          <div
            className="
              p-3
            "
          >
            {
              filteredItems.length === 0
                ? (
                  <div
                    className="
                      px-3
                      py-10
                      text-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    검색 결과가 없습니다.
                  </div>
                )
                : GUIDE_SECTIONS.map(
                  section => {

                    const items =
                      sectionItems[
                        section
                      ]


                    if (
                      items.length === 0
                    ) {

                      return null
                    }


                    return (
                      <div
                        key={section}
                        ref={
                          element => {

                            sectionRefs
                              .current[
                                section
                              ] = element
                          }
                        }
                        className="
                          scroll-mt-2
                          pb-6
                          last:pb-2
                        "
                      >
                        <div
                          className="
                            sticky
                            top-0
                            z-10
                            mb-2
                            border-b
                            bg-popover
                            px-2
                            py-2
                            text-sm
                            font-semibold
                          "
                        >
                          {section}
                        </div>


                        <div
                          className="
                            space-y-1
                          "
                        >
                          {
                            items.map(
                              item => (

                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={
                                    () =>
                                      handleSelect(
                                        item.prompt
                                      )
                                  }
                                  className="
                                    flex
                                    w-full
                                    flex-col
                                    rounded-md
                                    px-3
                                    py-2.5
                                    text-left
                                    transition-colors
                                    hover:bg-accent
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-ring
                                  "
                                >
                                  <span
                                    className="
                                      text-sm
                                      font-medium
                                      text-foreground
                                    "
                                  >
                                    {item.title}
                                  </span>


                                  {
                                    item.description
                                      ? (
                                        <span
                                          className="
                                            mt-1
                                            line-clamp-2
                                            text-xs
                                            leading-5
                                            text-muted-foreground
                                          "
                                        >
                                          {item.description}
                                        </span>
                                      )
                                      : null
                                  }


                                  <span
                                    className="
                                      mt-1
                                      line-clamp-1
                                      text-xs
                                      text-muted-foreground/80
                                    "
                                  >
                                    {item.prompt}
                                  </span>
                                </button>

                              )
                            )
                          }
                        </div>
                      </div>
                    )
                  }
                )
            }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


function resolveSection(
  item: EpubGuideItem
): GuideSection {

  switch (
    item.category
  ) {

    case "EPUB 정보":

      return "EPUB 정보"

    case "EPUB 작성":

      return "EPUB 생성"


    case "EPUB 수정":

      return "EPUB 생성"

    case "EPUB 삭제":

      return "EPUB 생성"

    case "출판":

      return "EPUB 생성"

    case "검증":

      return "EPUB 검증"


    case "AI · RAG":

      return "RAG"


    default:

      return "EPUB 정보"
  }
}