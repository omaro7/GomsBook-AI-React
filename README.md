# GomsBook-AI-React

React 기반 GomsBook AI Agent Web Chat 프론트엔드입니다. 기존 Eclipse e4 `AgentWebChatPart`의 채팅 UI를 독립적인 React 애플리케이션으로 이전하며, `GomsBook-AI-API`를 통해 `GomsBook-AI-Agent-Core`의 Agent 실행, RAG, Tool, Approval 기능을 사용합니다.

## 1. Architecture

```text
Browser
  │
  ▼
GomsBook-AI-React :5173
  │
  ├─ REST
  └─ SSE / EventSource
  │
  ▼
GomsBook-AI-API :5001
  │
  ▼
AgentEngineBridge
  │
  ▼
GomsBook-AI-Agent-Core
  ├─ Agent
  ├─ RAG
  ├─ Tool
  ├─ Approval
  └─ MCP
```

### 핵심 원칙

- `GomsBook-AI-API`가 유일한 HTTP/SSE 서버입니다.
- API 포트는 `5001`입니다.
- `GomsBook-AI-Agent-Core`는 API 프로세스 내부 Java dependency/engine으로 실행합니다.
- React에서 Agent-Core를 직접 호출하지 않습니다.
- 별도 Agent HTTP 서버와 `5002` 포트는 사용하지 않습니다.
- 개발 시 React는 Vite `5173`, API는 Spring Boot `5001`을 사용합니다.
- 배포 시 nginx를 통해 서비스하는 구조를 사용합니다.

## 2. Technology Stack

```text
React
TypeScript
Vite
Zustand
shadcn/ui
Tailwind CSS v4
Lucide React
react-markdown
remark-gfm
React Router
Fetch API
EventSource / SSE
```

PrimeFlex는 Tailwind CSS와 역할이 중복되므로 사용하지 않습니다.

## 3. Development Environment

```text
GomsBook-AI-Agent-Core   STS4 / Eclipse
GomsBook-AI-API          STS4 / Eclipse
GomsBook-AI-React        Visual Studio Code
GomsBook-AI-Docker       Visual Studio Code
```

프로젝트 열기:

```powershell
cd D:\04.GomsBook-AI\GomsBook-AI-React
code .
```

Vite 기준 Node.js는 `20.19+` 또는 `22.12+` 환경을 사용합니다.

## 4. Installation

```powershell
cd D:\04.GomsBook-AI
npm create vite@latest GomsBook-AI-React -- --template react-ts
cd GomsBook-AI-React

npm install
npm install zustand
npm install react-router-dom
npm install react-markdown remark-gfm
npm install tailwindcss @tailwindcss/vite
npm install lucide-react
npm install -D @types/node

npx shadcn@latest init
npx shadcn@latest add --all
```

실행:

```powershell
npm run dev
```

개발 URL:

```text
http://localhost:5173
```

## 5. Vite Proxy

`vite.config.ts`의 개발 프록시는 API `5001`로 연결합니다.

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
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
})
```

React에서는 `http://localhost:5001`을 직접 하드코딩하지 않고 `/api/...` 경로를 사용합니다.

## 6. Current Source Structure

```text
src/
├─ api/
│  ├─ agentApi.ts
│  ├─ approvalApi.ts
│  ├─ chatConfigApi.ts
│  └─ healthApi.ts
│
├─ components/
│  ├─ ui/
│  ├─ chat/
│  │  ├─ ChatLayout.tsx
│  │  ├─ ChatHeader.tsx
│  │  ├─ ChatPanel.tsx
│  │  ├─ ChatMessageList.tsx
│  │  └─ ChatInput.tsx
│  └─ agent/
│     ├─ AgentProgress.tsx
│     ├─ ApprovalCard.tsx
│     └─ RagContextPanel.tsx
│
├─ models/
│  ├─ AgentEvent.ts
│  ├─ AgentRun.ts
│  ├─ AgentRunRequest.ts
│  ├─ AgentRunResponse.ts
│  ├─ Approval.ts
│  ├─ ChatMessage.ts
│  ├─ HealthStatus.ts
│  ├─ RagContext.ts
│  └─ ToolCall.ts
│
├─ services/
│  ├─ agentEventHandler.ts
│  ├─ agentEventStream.ts
│  ├─ agentService.ts
│  └─ chatConfigService.ts
│
├─ stores/
│  ├─ agentStore.ts
│  ├─ chatConfigStore.ts
│  ├─ chatStore.ts
│  └─ ragStore.ts
│
├─ lib/
│  └─ utils.ts
├─ App.tsx
├─ index.css
└─ main.tsx
```

## 7. Chat UI

기존 GomsBookEditor Web Chat의 주요 기능을 React로 유지합니다.

```text
ChatLayout
├─ ChatHeader
│  ├─ New Chat
│  ├─ Clear
│  ├─ Agent Select
│  ├─ Model Select
│  ├─ RAG
│  └─ MCP
│
└─ ChatPanel
   ├─ ChatMessageList
   ├─ RagContextPanel
   ├─ AgentProgress
   │  ├─ Tool 진행 상태
   │  └─ ApprovalCard
   └─ ChatInput
```

### New Chat

새 대화를 시작합니다.

```text
disconnect SSE
chatStore.clearMessages()
ragStore.clear()
agentStore.reset()
chatConfigStore.reset()
```

Agent/Model/RAG/MCP는 API에서 받은 기본 설정으로 복원합니다.

### Clear

현재 화면의 대화 및 실행 표시를 초기화하되 Agent/Model/RAG/MCP 선택은 유지합니다.

### 실행 중 Toolbar

Agent 실행 중에는 다음 컨트롤을 비활성화합니다.

```text
New Chat
Clear
Agent
Model
RAG
MCP
```

## 8. Chat Configuration

`chatConfigStore.ts`에서 다음 상태를 관리합니다.

```text
agent
model
ragEnabled
mcpEnabled

agents
models

defaultAgent
defaultModel
defaultRagEnabled
defaultMcpEnabled

configLoading
configLoaded
configError
```

기존 Editor 기준 기본 설정은 다음과 같습니다.

```text
Agent       Default Agent
Model       gemma4:31b-cloud
RAG         false
MCP         false
```

### 현재 Config API 상태

`GET /api/agent/config`는 API 구현 전이므로 현재 React에서는 응답 JSON을 mock으로 처리할 수 있습니다.

이 mock은 **Chat Config 조회에만 사용**합니다. Agent 실행과 SSE는 실제 API를 사용합니다.

```text
GET  /api/agent/config                    현재 Mock 가능
POST /api/agent/run                       실제 API
GET  /api/agent/runs/{runId}/events       실제 SSE
POST /api/agent/runs/.../approve          실제 API
POST /api/agent/runs/.../reject           실제 API
```

API 구현 후에는 `chatConfigApi.ts`의 `getChatConfig()`만 실제 `fetch()`로 전환합니다.

예정 응답 계약:

```json
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

## 9. Agent Run Request

React의 실행 요청 모델은 다음 설정을 포함하도록 준비합니다.

```ts
export interface AgentRunRequest {
  message: string
  agent: string
  model: string
  ragEnabled: boolean
  mcpEnabled: boolean
}
```

전송 예정 JSON:

```json
{
  "message": "EPUB 구조를 검사해주세요.",
  "agent": "Default Agent",
  "model": "gemma4:31b-cloud",
  "ragEnabled": true,
  "mcpEnabled": false
}
```

`GomsBook-AI-API`의 `AgentRunRequest`가 동일한 필드를 받을 수 있도록 확장되면 실제 실행 설정까지 연결됩니다.

## 10. Agent Execution

실행 흐름:

```text
ChatInput
   │
   ▼
executeAgent(message)
   │
   ├─ chatConfigStore 설정 조회
   │
   ▼
AgentRunRequest
   │
   ▼
POST /api/agent/run
   │
   ▼
AgentRunResponse
   │
   └─ runId
       │
       ▼
GET /api/agent/runs/{runId}/events
       │
       ▼
EventSource / SSE
```

실행 응답:

```ts
export interface AgentRunResponse {
  runId: string
}
```

## 11. SSE Event Processing

기존 API/Web Chat에서 사용하는 이벤트를 React에서도 named SSE event로 처리합니다.

```text
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

AGENT_COMPLETED
AGENT_FAILED
```

React는 향후 API 지원을 위해 다음 이벤트도 선행 구현합니다.

```text
APPROVAL_EXPIRED
```

`APPROVAL_EXPIRED`는 React에서 임의 timeout을 계산하지 않습니다. API가 approval 만료를 결정하고 SSE 이벤트를 보내는 구조를 기준으로 합니다.

### Named SSE

서버가 다음과 같이 event name을 지정하는 구조를 사용하므로 React에서는 `EventSource.addEventListener()`를 사용합니다.

```text
event: TOOL_STARTED
data: {...}

event: TOOL_COMPLETED
data: {...}
```

개념적인 등록:

```ts
eventSource.addEventListener(
  "TOOL_STARTED",
  handler
)
```

## 12. Agent Event Routing

모든 SSE 이벤트를 UI 컴포넌트가 직접 처리하지 않습니다.

```text
agentEventStream
       │
       ▼
agentEventHandler
       │
       ├─ agentStore
       ├─ chatStore
       └─ ragStore
              │
              ▼
           React UI
```

책임 분리:

```text
agentStore
├─ run 상태
├─ SSE 연결 상태
├─ Tool Call
├─ Approval
└─ Error

chatStore
├─ User Message
└─ Assistant Message

ragStore
├─ RAG 실행 상태
└─ RAG Context
```

## 13. Agent Status

React에서 관리하는 실행 상태:

```ts
export type AgentRunStatus =
  | "IDLE"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "EXPIRED"
  | "COMPLETED"
  | "FAILED"
```

주요 전환:

```text
IDLE
 ↓
RUNNING
 ├─→ WAITING_APPROVAL
 │       ├─ APPROVED → RUNNING
 │       ├─ REJECTED → RUNNING / 종료 이벤트 대기
 │       └─ EXPIRED  → EXPIRED
 │
 ├─→ COMPLETED
 └─→ FAILED
```

## 14. Tool Call

Tool 상태:

```ts
export type ToolCallStatus =
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"
```

이벤트 매핑:

```text
TOOL_STARTED
  ↓
RUNNING

TOOL_COMPLETED
  ↓
SUCCESS

TOOL_FAILED
  ↓
ERROR
```

`AgentProgress.tsx`에서 Tool 실행 상태를 표시합니다.

## 15. RAG

RAG는 ChatMessage와 분리해서 `ragStore`에서 관리합니다.

```text
RAG_STARTED
    ↓
running = true

RAG_CONTEXT
    ↓
RagContext 추가

RAG_COMPLETED
    ↓
running = false
```

`RagContextPanel.tsx`에서 검색된 Context를 별도 영역으로 표시합니다.

RAG payload 필드는 실제 API의 최종 event payload에 맞춰 계속 정합성을 유지해야 합니다.

## 16. Approval

Approval UI는 `ApprovalCard.tsx`에서 처리합니다.

```text
APPROVAL_REQUIRED
       │
       ▼
WAITING_APPROVAL
       │
       ├─ 승인
       │    ↓
       │  approve API
       │    ↓
       │  APPROVAL_APPROVED SSE
       │
       └─ 취소
            ↓
          reject API
            ↓
          APPROVAL_REJECTED SSE
```

### Approval 안전 규칙

과거 다음 오류를 방지하기 위해 React에서 중복 요청을 차단합니다.

```text
승인 요청에 runId 또는 approvalId가 없습니다.

Approval is not pending: ..., status=APPROVED
```

따라서:

- `runId` 검증
- `approvalId` 검증
- 첫 클릭 즉시 Approve/Reject 버튼 잠금
- 처리 중 중복 요청 차단
- HTTP 성공만으로 Approval을 임의 제거하지 않음
- 최종 상태는 SSE `APPROVAL_APPROVED` / `APPROVAL_REJECTED`로 확정

### Approval Expiration

React는 다음 상태를 선행 지원합니다.

```text
APPROVAL_EXPIRED
       ↓
Approval 제거
status = EXPIRED
running = false
message/error 표시
```

실제 timeout 판단은 API에서 구현합니다.

## 17. Markdown

Assistant 메시지는:

```text
react-markdown
     +
remark-gfm
```

으로 출력합니다.

따라서 다음을 지원합니다.

- Markdown
- GFM Table
- 목록
- 강조
- Code

Tool/RAG/Approval은 ChatMessage role로 섞지 않고 각각의 도메인 UI로 분리합니다.

## 18. Zustand Stores

### `agentStore.ts`

```text
runId
status
running
streamConnected
toolCalls
approvals
error
```

### `chatStore.ts`

```text
messages
addUserMessage
addAssistantMessage
handleAgentEvent
clearMessages
```

### `ragStore.ts`

```text
contexts
running
addContext
handleAgentEvent
clear
```

### `chatConfigStore.ts`

```text
agent
model
ragEnabled
mcpEnabled
agents
models
default values
configLoading
configLoaded
configError
```

## 19. API Summary

현재/예정 React 연동 지점:

| Method | Endpoint | Purpose | Status |
|---|---|---|---|
| GET | `/actuator/health` | API 상태 확인 | 실제 API |
| GET | `/api/agent/config` | Agent/Model/기본 설정 | React Mock → API 예정 |
| POST | `/api/agent/run` | Agent 실행 | 실제 API |
| GET | `/api/agent/runs/{runId}/events` | Agent SSE | 실제 API |
| POST | `/api/agent/runs/{runId}/approvals/{approvalId}/approve` | 승인 | 실제 API |
| POST | `/api/agent/runs/{runId}/approvals/{approvalId}/reject` | 거절 | 실제 API |

## 20. API Remaining Work

React UI와 상태 계층은 API 확장을 받을 수 있도록 준비합니다.

API에서 남은 주요 연동 항목:

```text
1. GET /api/agent/config 구현

2. AgentRunRequest 확장
   ├─ agent
   ├─ model
   ├─ ragEnabled
   └─ mcpEnabled

3. 위 설정을 AgentEngineBridge/Core 실행 Context까지 전달

4. APPROVAL_EXPIRED lifecycle 구현

5. RAG_CONTEXT payload와 React 모델 최종 정합성 확인
```

## 21. Current React Implementation Status

현재 React에서 구현된 핵심 범위:

```text
✓ React + TypeScript + Vite
✓ Tailwind CSS v4
✓ shadcn/ui
✓ Zustand
✓ Vite API Proxy

✓ ChatLayout
✓ ChatHeader
✓ ChatMessageList
✓ ChatInput
✓ Markdown / GFM

✓ New Chat
✓ Clear
✓ Agent Select
✓ Model Select
✓ RAG Toggle
✓ MCP Toggle

✓ Agent REST 실행
✓ runId 처리
✓ EventSource SSE
✓ named SSE event 처리

✓ Agent 상태
✓ Tool 상태
✓ RAG Context
✓ Approval UI
✓ Approve / Reject
✓ 중복 Approval 요청 방지
✓ APPROVAL_EXPIRED 선행 지원

✓ Chat Config Store
✓ Config response 처리
✓ Config Mock
```

### 최종 통합 점검 항목

새 기능 추가보다는 다음 통합 검증이 남아 있습니다.

```text
□ ChatLayout / ChatPanel Header 중복 제거
□ 모든 Store/Event type 정합성 최종 점검
□ 실제 RAG_CONTEXT payload 확인
□ SSE 종료 및 오류 처리 최종 검증
□ TypeScript build 오류 점검
□ npm run build
□ 실제 API + 브라우저 End-to-End 테스트
□ nginx / Docker 배포
```

## 22. End-to-End Target

최종 목표 흐름:

```text
사용자 메시지 입력
       ↓
ChatInput
       ↓
chatConfigStore
       ↓
AgentRunRequest
       ↓
POST /api/agent/run
       ↓
runId
       ↓
SSE 연결
       ↓
AGENT_STARTED
       ↓
RAG / TOOL
       ↓
APPROVAL_REQUIRED (필요 시)
       ↓
APPROVAL_APPROVED / REJECTED / EXPIRED
       ↓
ASSISTANT_MESSAGE
       ↓
AGENT_COMPLETED
       ↓
React UI 최종 결과 표시
```

## 23. Build

개발 실행:

```powershell
npm run dev
```

프로덕션 빌드:

```powershell
npm run build
```

빌드 결과:

```text
dist/
```

최종적으로 `dist/`를 nginx를 통해 서비스하도록 `GomsBook-AI-Docker`와 연결합니다.

## 24. Development Principles

1. 실제 API가 존재하는 기능은 mock으로 대체하지 않습니다.
2. Config처럼 API가 아직 준비되지 않은 부분만 명확히 격리해서 mock 처리합니다.
3. React 컴포넌트에서 REST/SSE 로직을 직접 처리하지 않습니다.
4. Agent runtime 공유 상태는 Zustand에서 관리합니다.
5. Tool/RAG/Approval은 ChatMessage와 도메인을 분리합니다.
6. Approval timeout의 authoritative source는 API입니다.
7. API event type과 payload를 변경할 때 React 모델도 함께 정합성을 점검합니다.
8. 기존 `chat.js`를 하나의 거대한 React 컴포넌트로 옮기지 않고 API/Service/Store/UI 계층으로 분리합니다.

## 25. Next Step

React의 새로운 기능 구현보다는 전체 통합 점검을 우선합니다.

```text
1. ChatLayout.tsx
2. ChatPanel.tsx
3. AgentProgress.tsx
4. agentStore.ts
5. agentEventHandler.ts
6. agentEventStream.ts
7. chatStore.ts
8. ragStore.ts
9. chatConfigStore.ts
10. npm run build
11. 실제 API End-to-End 테스트
```

그 다음 API의 Config / AgentRunRequest / Approval Expiration을 완성하고 nginx/Docker 배포 단계로 이동합니다.
