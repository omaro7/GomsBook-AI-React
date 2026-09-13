export interface RagContext {

  runId: string

  title: string

  text: string

  sourcePath?: string | null

  score?: number | null

  createdAt: string

  chunkId?: string | null

  heading?: string | null

  type?: string | null

  sequence?: number | null
}