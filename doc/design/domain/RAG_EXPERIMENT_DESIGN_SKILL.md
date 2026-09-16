# GomsBook RAG Experiment Design Skill

## Base Design Skill

이 문서는 GomsBook React의 공통 디자인 규칙을 확장한다.

기본 디자인 규칙:

`../GOMSBOOK_BASE_DESIGN_SKILL.md`

RAG Experiment 페이지 구현 시 다음 우선순위를 따른다.

## 1. Purpose

이 문서는 GomsBook의 **RAG Evaluation / Experiment 웹페이지 전용 디자인 규칙**을 정의한다.

Root에서 정의한 다음 사항은 다시 정의하지 않는다.

- Color Base
- Typography
- Header
- Card
- Border
- Radius
- Shadow
- Responsive
- Accessibility
- Base Table
- Base Tab
- Code / JSON Viewer

이 문서는 RAG Experiment에 특화된 정보 구조와 표현 방법만 정의한다.

---

# 2. RAG Navigation

Main Navigation은 다음 6개 항목으로 구성한다.

```text
Main
Golden Dataset
Vector
Graph
Hybrid
Result
```

실험 Version은 Header에 노출하지 않는다.

---

# 3. Version Navigation

각 Strategy 내부 Version은 Tab으로 구성한다.

Vector:

```text
Baseline
```

Graph:

```text
V1
V2
V3
V4
V5
V6
```

Hybrid:

```text
V1
V2
```

향후 버전이 추가되어도 Main Header는 변경하지 않는다.

---

# 4. RAG Strategy Semantic Color

Root Color Token을 활용하여 전략을 구분한다.

```text
Vector
Blue

Graph
Violet

Hybrid
Green
```

단, 해당 색상을 Page 전체 Theme로 사용하지 않는다.

사용 대상:

- Strategy Label
- Chart Series
- 작은 Indicator
- Architecture Node

Main UI는 Root Blue/Navy Design을 유지한다.

---

# 5. Experiment Story Structure

모든 실험 Version은 동일한 순서를 사용한다.

```text
Hypothesis
    ↓
Experiment
    ↓
Result
    ↓
Comparison
    ↓
Failure Analysis
    ↓
Interpretation
    ↓
Next Hypothesis
    ↓
Raw JSON
```

Version마다 Section 위치를 바꾸지 않는다.

---

# 6. Hypothesis

가설은 다음 두 요소가 드러나야 한다.

```text
무엇을 변경하는가
+
어떤 Metric이 개선될 것으로 예상하는가
```

예:

```text
Vector Retrieval에 Graph Relationship을 추가하면
Expected Document의 Top-K 진입률이 개선될 것이다.
```

Hypothesis는 일반 설명과 별도의 Callout 또는 Section으로 표현한다.

---

# 7. Experiment

실험 조건은 재현 가능하게 표시한다.

기본 항목:

```text
Experiment ID
Retriever
Embedding Model
Top-K
Vector
Keyword
Content Graph
EPUB Graph
Ranking Strategy
Golden Dataset
Evaluated Cases
```

필요한 경우 Version별 Parameter를 추가한다.

---

# 8. Result

모든 실험은 최소 다음 Retrieval Metric을 표시한다.

```text
Hit Rate@K
Average Recall@K
MRR
HIT Count
MISS Count
```

Answer Evaluation이 존재하면 별도 Metric Group으로 구분한다.

---

# 9. Metric Card

Result 상단에는 핵심 Metric을 Card 형태로 표시한다.

예:

```text
Hit Rate@K
97.1%

+2.9%p
vs HYBRID_V1
```

구조:

```text
Metric Name
Metric Value
Delta
Previous Version
```

현재 값이 가장 시각적으로 커야 한다.

---

# 10. Previous Version Comparison

각 실험은 직전 실험과 비교한다.

예:

```text
GRAPH V5 → GRAPH V6

Metric         V5       V6       Delta

Hit@K          ...      ...      ...
Recall@K       ...      ...      ...
MRR            ...      ...      ...
MISS           ...      ...      ...
```

전체 Experiment 비교는 Result Page에서 수행한다.

---

# 11. Golden Dataset Page

Golden Dataset 페이지는 다음 Tab으로 구성한다.

```text
Overview
Cases
JSON
```

## Overview

표시 항목:

```text
Dataset Name
Version
Project
Total Cases
Answerable Cases
Unanswerable Cases
Evaluation Metrics
```

## Cases

Case Table을 제공한다.

권장 Column:

```text
Case ID
Question
Expected Document
Answerable
Status
```

## JSON

실제 Golden Dataset JSON을 보여준다.

---

# 12. Raw Experiment JSON

각 Version Page 마지막에 실제 Evaluation JSON을 제공한다.

기본 기능:

```text
Pretty
Raw
Search
Copy
```

원본 JSON은 UI에서 계산한 값을 검증할 수 있는 Evidence 역할을 한다.

---

# 13. Main Dashboard

Main은 상세 실험 Page가 아니다.

전체 RAG Evaluation 상태를 요약한다.

구성:

```text
Evaluation Summary
        ↓
Golden Dataset Summary
        ↓
Current Metrics
        ↓
Strategy Evolution
        ↓
Performance Evolution
        ↓
Key Findings
        ↓
Failure Summary
        ↓
Latest Experiment
```

---

# 14. Dashboard Summary

상단에는 다음 정보를 우선 표시한다.

```text
Project
Dataset
Total Cases
Experiments
Latest Experiment
Evaluation Status
```

예:

```text
Project
lunchwork_seoul

Golden Cases
40

Experiments
9

Latest
HYBRID_V2
```

---

# 15. Strategy Evolution

전체 RAG 발전 흐름을 시각화한다.

```text
Vector
   ↓
Graph
V1 → V2 → V3 → V4 → V5 → V6
                              ↓
                           Hybrid
                           V1 → V2
```

이 Diagram은 Main Dashboard의 핵심 Visual 중 하나다.

---

# 16. Performance Evolution

실험별 Metric 변화를 Chart로 보여준다.

기본 Series:

```text
Hit Rate@K
Recall@K
MRR
```

X축:

```text
VECTOR
GRAPH V1
GRAPH V2
GRAPH V3
GRAPH V4
GRAPH V5
GRAPH V6
HYBRID V1
HYBRID V2
```

---

# 17. Chart Color

Strategy별 Series 또는 Point 강조 시 다음 Semantic Rule을 사용한다.

```text
Vector   Blue
Graph    Violet
Hybrid   Green
```

Metric 자체의 색과 Strategy 색을 혼용하지 않는다.

한 Chart에서 어떤 의미로 색을 쓰는지 먼저 결정한다.

---

# 18. Failure Analysis

Failure Case는 숨기지 않는다.

각 Failure는 다음 정보를 제공한다.

```text
Case ID
Question
Expected Document
Expected Answer
Retrieved Documents
Rank
Score
Failure Status
Cause
Resolution
```

---

# 19. Failure Evolution

특정 Stable Failure는 Version별 변화로 표현한다.

예:

```text
RAG-GOLD-008

VECTOR          MISS
GRAPH V1        MISS
GRAPH V2        MISS
GRAPH V3        MISS
GRAPH V4        MISS
GRAPH V5        MISS
GRAPH V6        MISS
HYBRID V1       MISS
HYBRID V2       HIT
```

Timeline 또는 Compact Matrix 형태로 표현할 수 있다.

---

# 20. Retrieval Ranking

개별 Case에서는 Top-K Retrieval Ranking을 보여준다.

예:

```text
Rank    Source                Score      Expected

1       chapter10_2.xhtml     0.8421
2       chapter10_4.xhtml     0.8195     EXPECTED
3       ...
```

Expected Document에는 별도 Badge를 표시한다.

---

# 21. HIT / MISS

상태는 Root Semantic Color를 사용한다.

```text
HIT
Green

MISS
Red
```

전체 Row Background를 Green/Red로 칠하지 않는다.

Badge와 작은 Indicator만 사용한다.

---

# 22. Interpretation

Result 다음에는 반드시 해석 영역을 둔다.

해석은 Metric 반복이 아니다.

설명 대상:

```text
왜 변화했는가
무엇이 개선됐는가
무엇이 개선되지 않았는가
새로운 Failure가 발생했는가
```

---

# 23. Next Hypothesis

최종 Experiment가 아닌 경우 다음 가설을 표시한다.

구조:

```text
Observed Problem
        ↓
Next Hypothesis
        ↓
Next Version
```

예:

```text
Vector + Graph에서 Lexical Signal이 부족함
        ↓
Keyword Retrieval을 결합하면 Stable Miss가 감소할 것이다
        ↓
HYBRID_V1
```

이 연결이 실험 Storytelling의 핵심이다.

---

# 24. Graph Page

Graph Page:

```text
Graph Retrieval Experiments

[V1] [V2] [V3] [V4] [V5] [V6]

Hypothesis
Experiment
Result
Comparison
Failure Analysis
Interpretation
Next Hypothesis
Raw JSON
```

공통 Layout 하나를 사용하고 Version Data만 변경한다.

---

# 25. Hybrid Page

Hybrid Page:

```text
Hybrid Retrieval Experiments

[V1] [V2]

Hypothesis
Experiment
Result
Comparison
Failure Analysis
Interpretation
Next Hypothesis 또는 Conclusion
Raw JSON
```

---

# 26. Vector Page

Vector는 Baseline 역할을 명확하게 표시한다.

```text
VECTOR_ONLY

BASELINE
```

핵심 목적:

```text
향후 모든 실험과 비교할 기준 성능 확립
```

---

# 27. Result Page

Result는 전체 연구의 Final Report다.

구성:

```text
Evaluation Summary
Performance Comparison
Performance Evolution
Failure Evolution
Final Architecture
Key Findings
Conclusion
```

새로운 Hypothesis를 제시하지 않는다.

---

# 28. Experiment Comparison Table

Result Page의 전체 Table:

```text
Experiment
Hit@K
Recall@K
MRR
HIT
MISS
```

행 순서는 실제 실험 순서를 유지한다.

```text
VECTOR
GRAPH V1
GRAPH V2
GRAPH V3
GRAPH V4
GRAPH V5
GRAPH V6
HYBRID V1
HYBRID V2
```

---

# 29. Final Architecture

최종 Result에는 실제 최종 Retrieval Architecture를 보여준다.

예:

```text
Query
 │
 ├── Vector Retrieval
 ├── Keyword Retrieval
 ├── Content Graph
 └── EPUB Graph
 │
 ▼
Candidate Merge
 │
 ▼
Hybrid Ranking
 │
 ▼
Top-K Retrieval
```

---

# 30. Evidence Principle

모든 중요한 결론에는 검증 가능한 근거를 연결한다.

예:

```text
Summary Metric
   ↕
Experiment Result
   ↕
Case Result
   ↕
Raw Evaluation JSON
```

Dashboard에 나온 숫자가 Raw JSON과 연결되어야 한다.

---

# 31. Experiment Design Rule

> **각 Version Page는 결과를 보여주는 페이지가 아니라, 가설이 어떻게 검증되고 다음 실험으로 연결되었는지를 설명하는 페이지다.**

---

# 32. RAG Final Rule

> **RAG Experiment UI는 “좋아졌다”를 보여주는 것이 아니라, 동일 Golden Dataset에서 무엇을 변경했고 어떤 Metric과 Failure Case가 어떻게 변했는지를 증명해야 한다.**