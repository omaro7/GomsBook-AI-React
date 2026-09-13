export type RagIndexProgressStage =
  | "STARTED"
  | "SCANNING"
  | "DELETING"
  | "INDEXING"
  | "EMBEDDING"
  | "COMPLETED"
  | "FAILED"

export interface RagIndexProgress {
  projectId?: string | null
  stage: RagIndexProgressStage
  current: number
  total: number
  percent: number
  sourcePath?: string | null
  message?: string | null
}