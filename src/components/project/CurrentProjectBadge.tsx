import {
  FolderOpen
} from "lucide-react"

import {
  useProjectStore
} from "@/stores/projectStore"

export function CurrentProjectBadge() {

  const currentProjectName =
    useProjectStore(
      state =>
        state.currentProjectName
    )

  const hasCurrentProject =
    currentProjectName
      .trim()
      .length > 0

  if (!hasCurrentProject) {

    return (
      <span
        className="
          inline-flex
          min-w-0
          items-center
          gap-1.5
          rounded-[var(--goms-radius-round)]
          border
          border-border
          bg-[var(--goms-surface-subtle)]
          px-2.5
          py-1
          text-[11px]
          font-semibold
          text-muted-foreground
        "
      >
        <FolderOpen
          className="
            size-3
            shrink-0
          "
        />

        <span>
          프로젝트 없음
        </span>
      </span>
    )
  }

  return (
    <span
      className="
        inline-flex
        min-w-0
        max-w-[260px]
        items-center
        gap-1.5
        rounded-[var(--goms-radius-round)]
        border
        border-primary/15
        bg-[var(--goms-primary-soft)]
        px-2.5
        py-1
        text-[11px]
        font-bold
        text-primary
      "
      title={
        currentProjectName
      }
    >
      <span
        className="
          size-1.5
          shrink-0
          rounded-full
          bg-primary
        "
      />

      <FolderOpen
        className="
          size-3
          shrink-0
        "
      />

      <span
        className="
          truncate
        "
      >
        {
          currentProjectName
        }
      </span>
    </span>
  )
}