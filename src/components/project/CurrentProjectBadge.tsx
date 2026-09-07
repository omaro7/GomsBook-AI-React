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

  if (
    currentProjectName.trim().length === 0
  ) {
    return null
  }

  return (
    <div
      className="
        inline-flex
        min-w-0
        max-w-52
        items-center
        gap-1.5
        rounded-full
        border
        bg-muted/50
        px-2.5
        py-1
        text-xs
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
          bg-green-500
        "
      />

      <FolderOpen
        className="
          size-3.5
          shrink-0
        "
      />

      <span
        className="
          truncate
          font-medium
        "
      >
        {
          currentProjectName
        }
      </span>
    </div>
  )
}