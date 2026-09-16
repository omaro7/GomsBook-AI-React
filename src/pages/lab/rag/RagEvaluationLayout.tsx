import {
  FileDown,
  FlaskConical
} from "lucide-react"

import {
  NavLink,
  Outlet
} from "react-router-dom"


interface NavigationItem {
  label: string
  to: string
  end?: boolean
}


const navigationItems: NavigationItem[] = [
  {
    label: "Main",
    to: "/lab/rag",
    end: true
  },
  {
    label: "Golden Dataset",
    to: "/lab/rag/golden"
  },
  {
    label: "Vector",
    to: "/lab/rag/vector"
  },
  {
    label: "Graph",
    to: "/lab/rag/graph"
  },
  {
    label: "Hybrid",
    to: "/lab/rag/hybrid"
  },
  {
    label: "Result",
    to: "/lab/rag/result"
  }
]


export function RagEvaluationLayout() {

  function printPdf() {

    window.print()
  }


  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >
      <header
        className="
          rag-lab-header
          sticky
          top-0
          z-40
          border-b
          border-border/80
          bg-background/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[66px]
            w-full
            max-w-[1220px]
            items-center
            justify-between
            gap-6
            px-5
            max-md:flex-col
            max-md:items-stretch
            max-md:gap-2
            max-md:px-4
            max-md:pb-2
            max-md:pt-3
          "
        >
          <NavLink
            to="/lab/rag"
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <span
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-[var(--goms-radius-sm)]
                bg-[var(--goms-primary-soft)]
                text-primary
              "
            >
              <FlaskConical
                className="
                  size-4
                "
              />
            </span>


            <span>
              <span
                className="
                  block
                  text-[15px]
                  font-black
                  leading-none
                  tracking-[-0.03em]
                "
              >
                GomsBook

                <span
                  className="
                    text-primary
                  "
                >
                  {" "}RAG Lab
                </span>
              </span>


              <span
                className="
                  mt-1
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-muted-foreground
                "
              >
                Retrieval Evaluation
              </span>
            </span>
          </NavLink>


          <div
            className="
              flex
              items-center
              gap-3
              max-md:flex-col
              max-md:items-stretch
              max-md:gap-2
            "
          >
            <nav
              aria-label="RAG Lab"
              className="
                flex
                items-center
                gap-1
                overflow-x-auto
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {
                navigationItems.map(
                  item => (
                    <NavLink
                      key={
                        item.to
                      }
                      to={
                        item.to
                      }
                      end={
                        item.end
                      }
                      className={
                        ({
                          isActive
                        }) => `
                          relative
                          shrink-0
                          rounded-[var(--goms-radius-sm)]
                          px-3
                          py-2
                          text-[13px]
                          font-bold
                          transition-colors
                          ${
                            isActive
                              ? `
                                bg-[var(--goms-primary-soft)]
                                text-primary
                              `
                              : `
                                text-muted-foreground
                                hover:bg-muted/60
                                hover:text-foreground
                              `
                          }
                        `
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                )
              }
            </nav>


            <button
              type="button"
              onClick={
                printPdf
              }
              className="
                rag-print-hidden
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-[var(--goms-radius-sm)]
                border
                border-border
                bg-card
                px-3
                py-2
                text-[12px]
                font-bold
                text-muted-foreground
                shadow-[var(--goms-shadow-xs)]
                transition
                hover:border-primary/30
                hover:bg-[var(--goms-primary-soft)]
                hover:text-primary
                max-md:self-start
              "
              aria-label="현재 RAG Lab 페이지 PDF 출력"
              title="PDF로 저장"
            >
              <FileDown
                className="
                  size-4
                "
              />

              PDF
            </button>
          </div>
        </div>
      </header>


      <Outlet />
    </div>
  )
}