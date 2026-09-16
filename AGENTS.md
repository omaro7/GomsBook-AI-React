# GomsBook AI React Agent Guide

## Design

모든 React UI 구현 및 수정 시 다음 문서를 우선 적용한다.

### Base Design

`doc/design/GOMSBOOK_BASE_DESIGN_SKILL.md`

모든 GomsBook React 화면에 공통 적용한다.

### Domain Design

RAG Evaluation / Experiment 관련 화면:

`doc/design/domain/RAG_EXPERIMENT_DESIGN_SKILL.md`

## Design Priority

다음 우선순위를 따른다.

1. GOMSBOOK_BASE_DESIGN_SKILL.md
2. Domain Design Skill
3. Page-specific requirements

## Implementation

디자인 문서는 규칙을 정의한다.

실제 구현은 다음 영역에서 수행한다.

- `src/styles/`
- `src/components/`
- `src/pages/`