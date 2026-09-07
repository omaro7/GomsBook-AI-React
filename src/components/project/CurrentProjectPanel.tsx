import {
  Folder,
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

  return (
        <aside
        className="
            hidden
            h-full
            w-72
            shrink-0
            flex-col
            border-l
            bg-muted/20
            xl:flex
        "
>
      <div
        className="
          flex
          h-14
          shrink-0
          items-center
          justify-between
          border-b
          px-4
        "
      >
        <h2
          className="
            text-sm
            font-semibold
          "
        >
          현재 프로젝트
        </h2>

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
          currentProjectName
            .trim()
            .length === 0
            ? (
              <div
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                현재 선택된 프로젝트가 없습니다.
              </div>
            )
            : (
              <div
                className="
                  flex
                  flex-col
                  gap-5
                "
              >
                <div>
                  <div
                    className="
                      mb-1
                      text-xs
                      text-muted-foreground
                    "
                  >
                    프로젝트명
                  </div>

                  <div
                    className="
                      break-all
                      text-sm
                      font-semibold
                    "
                  >
                    {
                      currentProjectName
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      mb-1.5
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      text-muted-foreground
                    "
                  >
                    <Folder
                      className="
                        size-4
                        shrink-0
                      "
                    />

                    프로젝트 경로
                  </div>

                  <div
                    className="
                      break-all
                      rounded-md
                      border
                      bg-background
                      px-3
                      py-2
                      text-xs
                      leading-5
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
                </div>
              </div>
            )
        }
      </div>
    </aside>
  )
}