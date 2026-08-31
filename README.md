# GomsBook-AI-React

GomsBook AI의 독립형 React Web Chat UI입니다.

기존 Eclipse e4 Browser 기반 Web Chat을 React/TypeScript 기반
프론트엔드로 분리하고, `GomsBook-AI-API`의 REST/SSE 인터페이스를 통해
`GomsBook-AI-Agent-Core`와 연동합니다.

## 1. Architecture

``` text
┌─────────────────────────────┐
│ GomsBook-AI-React           │
│ React 19 + TypeScript       │
│ Vite + Zustand + shadcn/ui  │
└──────────────┬──────────────┘
               │
               │ REST / SSE
               ▼
┌─────────────────────────────┐
│ GomsBook-AI-API             │
│ Spring Boot :5001           │
│                             │
│ AgentRunController          │
│ AgentConfigController       │
│ AgentRunService             │
│ AgentSseEventDispatcher     │
└──────────────┬──────────────┘
               │ in-process
               ▼
┌─────────────────────────────┐
│ GomsBook-AI-Agent-Core      │
│                             │
│ AgentExecutor               │
│ ToolRegistry / ToolExecutor │
│ Approval / RAG / EPUB Tools │
└─────────────────────────────┘
```

### 서버 구성

  구성                      포트  역할
  ------------------------ ------ --------------------
  GomsBook-AI-React         5173  React 개발 서버
  GomsBook-AI-API           5001  REST/SSE API 서버
  GomsBook-AI-Agent-Core    없음  API 내부 Java 엔진

`GomsBook-AI-Agent-Core`는 별도 HTTP 서버로 실행하지 않습니다.\
`GomsBook-AI-API`가 Core를 Java dependency로 직접 호출합니다.

## 2. Frontend Stack

-   React 19
-   TypeScript
-   Vite
-   Zustand
-   Tailwind CSS v4
-   shadcn/ui
-   Base UI
-   Lucide React
-   React Markdown
-   remark-gfm
-   Fetch API
-   EventSource (SSE)

## 3. 주요 디렉터리

``` text
src/
├─ api/
│  ├─ agentApi.ts
│  └─ chatConfigApi.ts
├─ components/
│  ├─ ui/
│  ├─ chat/
│  ├─ agent/
│  └─ system/
├─ models/
├─ services/
│  ├─ agentService.ts
│  └─ chatConfigService.ts
├─ stores/
│  ├─ agentStore.ts
│  ├─ chatStore.ts
│  ├─ chatConfigStore.ts
│  └─ ragStore.ts
├─ lib/
├─ App.tsx
├─ index.css
└─ main.tsx
```

## 4. 개발 서버 실행

``` bash
npm install
npm run dev
```

기본 개발 URL:

``` text
http://localhost:5173
```

빌드:

``` bash
npm run build
```

## 5. Vite Proxy

React에서는 API 서버의 `5001` 포트를 직접 하드코딩하지 않습니다.

``` ts
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:5001",
      changeOrigin: true
    },
    "/actuator": {
      target: "http://localhost:5001",
      changeOrigin: true
    }
  }
}
```

따라서 React에서는 다음처럼 호출합니다.

``` text
/api/agent/config
/api/agent/runs
/api/agent/runs/{runId}/events
```

## 6. Chat Configuration

Chat Header에서 다음 설정을 관리합니다.

-   New Chat
-   Clear
-   Agent
-   Model
-   RAG
-   MCP

현재 기본값:

``` text
Agent : Default Agent
Model : gemma4:31b-cloud
RAG   : false
MCP   : false
```

설정 조회 API:

``` http
GET /api/agent/config
```

예시:

``` json
{
  "defaultAgent": "Default Agent",
  "defaultModel": "gemma4:31b-cloud",
  "ragEnabled": false,
  "mcpEnabled": false,
  "agents": [
    {
      "id": "Default Agent",
      "label": "Default Agent"
    }
  ],
  "models": [
    {
      "id": "gemma4:31b-cloud",
      "label": "gemma4:31b-cloud"
    }
  ]
}
```

## 7. Agent 실행

Agent 실행 API:

``` http
POST /api/agent/runs
```

React 요청 모델:

``` ts
export interface AgentRunRequest {
  message: string
  agent: string
  model: string
  ragEnabled: boolean
  mcpEnabled: boolean
}
```

응답:

``` json
{
  "runId": "..."
}
```

현재 Backend에서는 Agent/Model/RAG/MCP 설정의 Core 전달을 단계적으로
확장할 예정입니다.

## 8. SSE

Agent 실행 상태는 Server-Sent Events로 전달합니다.

``` http
GET /api/agent/runs/{runId}/events
```

주요 이벤트:

``` text
AGENT_STARTED
ASSISTANT_MESSAGE

RAG_STARTED
RAG_CONTEXT
RAG_COMPLETED

TOOL_STARTED
TOOL_COMPLETED
TOOL_FAILED

APPROVAL_REQUIRED
APPROVAL_APPROVED
APPROVAL_REJECTED
APPROVAL_EXPIRED

AGENT_COMPLETED
AGENT_FAILED
```

React에서는 `EventSource.addEventListener()`를 사용하여 named SSE
event를 처리합니다.

## 9. Approval

파일 생성과 같이 실제 프로젝트를 변경하는 작업은 사용자 승인을 거칩니다.

승인 흐름:

``` text
사용자 요청
   ↓
Agent Tool 실행
   ↓
ToolResult
approvalRequired=true
   ↓
AgentRunService
   ↓
APPROVAL_REQUIRED
   ↓
React Approval Card
   ↓
[취소] [승인]
```

승인:

``` http
POST /api/agent/runs/{runId}/approvals/{approvalId}/approve
```

취소:

``` http
POST /api/agent/runs/{runId}/approvals/{approvalId}/reject
```

### Approval 이벤트 중복 문제 해결

초기에는 Core의 `APPROVAL_REQUIRED` 이벤트와 `ToolResult` 기반 API
이벤트가 동시에 SSE로 전달되어 승인 이벤트가 두 번 발생했습니다.

기존 경로:

``` text
CreateBasicXhtmlTool
→ DefaultAgentEventPublisher
→ SseAgentEventListener
→ AgentSseEventDispatcher
```

신규 정상 경로:

``` text
CreateBasicXhtmlTool
→ ToolResult
→ DefaultAgentExecutor.notifyToolResult
→ DefaultAgentEngineBridge
→ AgentRunService.handleToolResult
→ AgentSseEventDispatcher
```

최종적으로 `SseAgentEventListener`에서 Core `APPROVAL_REQUIRED` 이벤트를
SSE로 전달하지 않도록 차단했습니다.

``` java
if (event.getType()
        == AgentEventType.APPROVAL_REQUIRED) {

    return;
}
```

승인 SSE는 `AgentRunService.handleToolResult()`에서 단일 생성합니다.

이로써 다음 필드가 React까지 정상 전달됩니다.

``` text
runId
approvalId
toolName
title
fileName
content
```

실제 XHTML 생성 승인 및 파일 생성까지 정상 동작을 확인했습니다.

## 10. Chat Message UI

메시지 역할:

``` ts
export type ChatMessageRole =
  | "user"
  | "assistant"
  | "system"
  | "tool"
```

### User Message

사용자 질문은 오른쪽 정렬의 primary bubble로 표시합니다.

주요 스타일:

``` text
w-fit
max-w-[80%]
rounded-2xl
bg-primary
px-4
py-3
```

### Assistant Message

AI 응답은 왼쪽에 표시하며, 답변 길이에 맞게 bubble 폭을 결정합니다.

``` text
w-fit
max-w-[80%]
```

Markdown blockquote 형태의 응답 영역도 사용자 질문과 유사한 radius와
padding을 사용합니다.

``` text
rounded-2xl
px-4
py-3
```

따라서 짧은 응답은 내용 길이만큼만 표시되고 긴 응답은 최대 폭 이후 자동
줄바꿈됩니다.

### Markdown

Assistant 응답은 다음을 지원합니다.

-   paragraph
-   inline code
-   code block
-   blockquote
-   ordered/unordered list
-   table
-   link
-   GFM Markdown

사용 라이브러리:

``` text
react-markdown
remark-gfm
```

## 11. New Chat / Clear

### New Chat

다음을 초기화합니다.

-   SSE 연결
-   Chat messages
-   Agent runtime
-   RAG state
-   Agent/Model/RAG/MCP 설정을 API 기본값으로 복원

### Clear

현재 화면 상태만 초기화합니다.

-   Chat messages
-   Agent runtime
-   RAG state

Agent/Model/RAG/MCP 설정은 유지합니다.

## 12. Agent 상태

대표 상태:

``` text
IDLE
RUNNING
WAITING_APPROVAL
EXPIRED
COMPLETED
FAILED
```

Approval 상태:

``` text
PENDING
APPROVED
REJECTED
EXPIRED
```

Tool 상태:

``` text
RUNNING
SUCCESS
ERROR
```

## 13. 현재 구현 완료

-   React/Vite 프로젝트 구성
-   Tailwind CSS v4
-   shadcn/ui
-   Zustand store
-   Chat Header
-   Agent/Model 선택
-   RAG/MCP toggle
-   실제 Agent Config API
-   실제 Agent Run REST API
-   실제 SSE 연결
-   Assistant Markdown
-   Tool execution state
-   Approval Card
-   Approve/Reject API
-   승인 대기 중 SSE 유지
-   승인 후 XHTML 실제 생성
-   `APPROVAL_REQUIRED` 중복 SSE 제거
-   `approvalId` 정상 전달
-   User/Assistant Chat Bubble UI 조정

## 14. 다음 작업

다음 단계에서는 아래 항목을 진행합니다.

1.  Assistant 응답 UI 세부 조정
2.  Tool execution 결과 UI 개선
3.  Agent 완료/실패 결과 표현 개선
4.  RAG_CONTEXT 실제 payload 검증
5.  AgentRunRequest의 Agent/Model/RAG/MCP Core 전달
6.  `APPROVAL_EXPIRED` Backend lifecycle 구현
7.  SSE close/error 처리 보강
8.  TypeScript 전체 build 검증
9.  실제 API 기반 Browser E2E 테스트
10. nginx / Docker 배포

## 15. 목표

`GomsBook-AI-React`의 목표는 단순 Chat UI가 아닙니다.

``` text
사용자 자연어 요청
        ↓
Agent 판단
        ↓
RAG / Tool / MCP
        ↓
필요 시 사용자 승인
        ↓
EPUB 실제 작업
        ↓
검증 및 결과 표시
```

이 흐름을 독립적인 Web UI에서 제공하여 GomsBook Editor의 EPUB 제작,
검증, 접근성 자동화 및 AI Agent 기능을 확장하는 것을 목표로 합니다.

## 16. Chat UI 실행 화면

GomsBook-AI-React에서 실제 Agent REST/SSE 연동, 사용자 승인 및 EPUB
XHTML 파일 생성까지 동작하는 Chat UI 실행 화면입니다.

![GomsBook-AI-React ChatUI
실행화면](doc/GomsBook-AI-React%20ChatUI실행화면.png)
