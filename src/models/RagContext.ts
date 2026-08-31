export interface RagContext {

  runId: string

  title: string

  text: string

  sourcePath?: string | null

  score?: number | null

  createdAt: string
}