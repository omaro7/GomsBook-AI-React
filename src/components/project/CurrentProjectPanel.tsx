import {
  Folder,
  FolderOpen,
  RefreshCw
} from "lucide-react"

import {
  Button
} from "@/components/ui/button"

import {
  useProjectStore
} from "@/stores/projectStore"

export function CurrentProjectPanel() {

  const currentProjectName =
    useProjectStore(
      state =>
        state.currentProjectName
    )

  const currentProjectPath =
    useProjectStore(
      state =>
        state.currentProjectPath
    )

  const loading =
    useProjectStore(
      state =>
        state.loading
    )

  const loadProjects =
    useProjectStore(
      state =>
        state.loadProjects
    )

  const hasCurrentProject =
    currentProjectName
      .trim()
      .length > 0

  return (
    <aside
      className="
        hidden
        h-full
        w-[var(--goms-project-panel-width)]
        shrink-0
        flex-col
        overflow-hidden
        rounded-[var(--goms-radius-panel)]
        border
        border-border
        bg-card
        shadow-[var(--goms-shadow-lg)]
        lg:flex
      "
    >
      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          justify-between
          border-b
          border-border/90
          bg-card/85
          px-4
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <div
            className="
              flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-[var(--goms-radius-sm)]
              bg-[var(--goms-primary-soft)]
              text-primary
            "
          >
            <FolderOpen
              className="
                size-4
              "
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h2
              className="
                truncate
                text-sm
                font-bold
                tracking-[-0.02em]
                text-foreground
              "
            >
              현재 프로젝트
            </h2>

            <p
              className="
                mt-0.5
                text-[11px]
                text-muted-foreground
              "
            >
              Current Project
            </p>
          </div>
        </div>


        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={
            loading
          }
          onClick={
            () => {
              void loadProjects()
            }
          }
          title="프로젝트 정보 새로고침"
          aria-label="프로젝트 정보 새로고침"
          className="
            size-9
            shrink-0
            rounded-[var(--goms-radius-sm)]
            text-muted-foreground
            hover:bg-[var(--goms-primary-soft)]
            hover:text-primary
          "
        >
          <RefreshCw
            className={
              loading
                ? "size-4 animate-spin"
                : "size-4"
            }
          />
        </Button>
      </div>


      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          p-4
        "
      >
        {
          !hasCurrentProject
            ? (
              <div
                className="
                  flex
                  h-full
                  min-h-40
                  flex-col
                  items-center
                  justify-center
                  rounded-[var(--goms-radius-lg)]
                  border
                  border-dashed
                  border-border
                  bg-[var(--goms-surface-subtle)]
                  px-5
                  py-8
                  text-center
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-[var(--goms-radius-md)]
                    bg-[var(--goms-primary-soft)]
                    text-primary
                  "
                >
                  <Folder
                    className="
                      size-5
                    "
                  />
                </div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  선택된 프로젝트가 없습니다.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-muted-foreground
                  "
                >
                  상단 Project에서
                  <br />
                  작업할 EPUB 프로젝트를 선택하세요.
                </p>
              </div>
            )
            : (
              <div
                className="
                  flex
                  flex-col
                  gap-4
                "
              >
                <section
                  className="
                    rounded-[var(--goms-radius-lg)]
                    border
                    border-border
                    bg-[var(--goms-surface-subtle)]
                    p-4
                  "
                >
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.06em]
                        text-muted-foreground
                      "
                    >
                      Project
                    </span>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-[var(--goms-radius-round)]
                        bg-[var(--goms-primary-soft)]
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        text-primary
                      "
                    >
                      <span
                        className="
                          size-1.5
                          rounded-full
                          bg-primary
                        "
                      />

                      Active
                    </span>
                  </div>

                  <div
                    className="
                      break-all
                      text-sm
                      font-bold
                      leading-6
                      text-foreground
                    "
                  >
                    {
                      currentProjectName
                    }
                  </div>
                </section>


                <section>
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-muted-foreground
                    "
                  >
                    <Folder
                      className="
                        size-4
                        shrink-0
                        text-primary
                      "
                    />

                    프로젝트 경로
                  </div>

                  <div
                    className="
                      break-all
                      rounded-[var(--goms-radius-md)]
                      border
                      border-border
                      bg-card
                      px-3
                      py-3
                      font-mono
                      text-[11px]
                      leading-5
                      text-[var(--goms-text-secondary)]
                      shadow-[var(--goms-shadow-xs)]
                    "
                    title={
                      currentProjectPath
                    }
                  >
                    {
                      currentProjectPath ||
                      "-"
                    }
                  </div>
                </section>
              </div>
            )
        }
      </div>
    </aside>
  )
}