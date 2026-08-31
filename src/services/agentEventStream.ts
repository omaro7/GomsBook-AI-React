import type {
  AgentEvent,
  AgentEventType
} from "@/models/AgentEvent"

export interface AgentEventStreamOptions {
  onOpen?: () => void
  onEvent: (event: AgentEvent) => void
  onError?: (error: Event) => void
}

const AGENT_EVENT_TYPES:
  AgentEventType[] = [

  "AGENT_STARTED",
  "ASSISTANT_MESSAGE",

  "RAG_STARTED",
  "RAG_CONTEXT",
  "RAG_COMPLETED",

  "TOOL_STARTED",
  "TOOL_COMPLETED",
  "TOOL_FAILED",

  "APPROVAL_REQUIRED",
  "APPROVAL_APPROVED",
  "APPROVAL_REJECTED",
  "APPROVAL_EXPIRED",

  "AGENT_COMPLETED",
  "AGENT_FAILED"
]

export class AgentEventStream {

  private eventSource:
    EventSource | null = null

  connect(
    runId: string,
    options: AgentEventStreamOptions
  ): void {

    this.disconnect()

    const normalizedRunId =
      runId.trim()

    if (!normalizedRunId) {

      throw new Error(
        "SSE 연결에 runId가 없습니다."
      )
    }

    const url =
      `/api/agent/runs/${encodeURIComponent(normalizedRunId)}/events`

    const eventSource =
      new EventSource(
        url
      )

    this.eventSource =
      eventSource

    eventSource.onopen =
      () => {

        options.onOpen?.()
      }

    for (
      const eventType
      of AGENT_EVENT_TYPES
    ) {

      eventSource.addEventListener(
        eventType,
        event => {

          this.handleEvent(
            normalizedRunId,
            eventType,
            event,
            options
          )
        }
      )
    }

    eventSource.onmessage =
      event => {

        this.handleMessage(
          normalizedRunId,
          event,
          options
        )
      }

    eventSource.onerror =
      error => {

        options.onError?.(
          error
        )
      }
  }

  disconnect():
    void {

    if (
      !this.eventSource
    ) {
      return
    }

    this.eventSource.close()

    this.eventSource =
      null
  }

  isConnected():
    boolean {

    return (
      this.eventSource !== null &&
      this.eventSource.readyState ===
        EventSource.OPEN
    )
  }

  private handleEvent(
    runId: string,
    eventType: AgentEventType,
    messageEvent: MessageEvent,
    options: AgentEventStreamOptions
  ): void {

    try {

      const event =
        this.parseEvent(
          runId,
          eventType,
          messageEvent.data
        )

      options.onEvent(
        event
      )

    } catch (
      exception
    ) {

      console.error(
        "[GomsBook AI] SSE 이벤트 파싱 실패",
        eventType,
        exception,
        messageEvent.data
      )
    }
  }

  private handleMessage(
    runId: string,
    messageEvent: MessageEvent,
    options: AgentEventStreamOptions
  ): void {

    try {

      const parsed =
        JSON.parse(
          messageEvent.data
        ) as Partial<AgentEvent>

      if (
        !parsed.type
      ) {

        console.warn(
          "[GomsBook AI] SSE message 이벤트에 type이 없습니다.",
          messageEvent.data
        )

        return
      }

      const event: AgentEvent = {
        ...parsed,
        runId:
          parsed.runId ||
          runId,
        type:
          parsed.type
      } as AgentEvent

      options.onEvent(
        event
      )

    } catch (
      exception
    ) {

      console.error(
        "[GomsBook AI] SSE message 파싱 실패",
        exception,
        messageEvent.data
      )
    }
  }

  private parseEvent(
    runId: string,
    eventType: AgentEventType,
    data: string
  ): AgentEvent {

    const parsed =
      data
        ? JSON.parse(
            data
          ) as Partial<AgentEvent>
        : {}

    return {
      ...parsed,

      runId:
        parsed.runId ||
        runId,

      type:
        eventType
    }
  }
}

export const agentEventStream =
  new AgentEventStream()