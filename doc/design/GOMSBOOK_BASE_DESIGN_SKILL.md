# GomsBook Base Root Design Skill

## 1. Purpose

이 문서는 **GomsBook React 애플리케이션 전체에 적용하는 최상위 디자인 규칙**을 정의한다.

특정 기능이나 페이지에 종속되지 않는다.

적용 대상 예:

- GomsBook AI Chat
- Current Project
- EPUB Project
- Publish / Release
- Validation
- Accessibility
- RAG
- Evaluation
- Settings
- 향후 추가되는 모든 React Page

페이지별 Design Skill은 반드시 이 Root Skill을 기반으로 확장한다.

---

# 2. Design Philosophy

GomsBook의 기본 디자인은 다음 방향을 따른다.

> **Professional Technical UI**

핵심 원칙:

- 명확성
- 일관성
- 기술적 신뢰성
- 낮은 시각적 소음
- 충분한 여백
- 제한된 색상
- 데이터와 콘텐츠 중심
- 재사용 가능한 Component 중심

화려함보다 정보 전달을 우선한다.

---

# 3. Design Hierarchy

디자인 규칙은 다음 순서로 적용한다.

```text
Base Root Design Skill
        ↓
Domain Design Skill
        ↓
Page Design
        ↓
Component
```

예:

```text
DESIGN_SKILL.md
        ↓
RAG_EXPERIMENT_DESIGN_SKILL.md
        ↓
RagGraphPage
        ↓
MetricCard
```

하위 Skill은 Root Design을 임의로 변경하지 않는다.

필요한 경우에만 의미를 확장한다.

---

# 4. Color System

## 4.1 Base Color

```css
:root {
  --bg: #f4f7fb;
  --paper: #ffffff;

  --ink: #152033;
  --muted: #667085;
  --line: #dfe6ef;

  --blue: #2457e6;
  --blue2: #4e7cff;
  --cyan: #20a4f3;
  --navy: #0f2747;

  --green: #0f9f78;
  --amber: #e29413;
  --red: #d94d4d;
  --violet: #7657d6;

  --soft: #eef3ff;

  --shadow: 0 18px 48px rgba(24,45,82,.10);

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
}
```

---

# 5. Primary Color Rule

GomsBook의 Primary Color는 Blue다.

```text
Primary
#2457e6
```

사용 대상:

- Active Navigation
- Primary Button
- Active Tab
- Link
- Section Kicker
- Selected State
- 주요 Highlight

페이지 전체를 Blue로 채우지 않는다.

Blue는 강조색이다.

---

# 6. Semantic Color

상태 표현에는 Semantic Color를 사용한다.

```text
Success     Green
Warning     Amber
Error       Red
Secondary   Violet
Information Blue
```

색상만으로 의미를 전달하지 않는다.

잘못된 예:

```text
●
```

권장:

```text
PASSED
FAILED
WARNING
```

Text와 Color를 함께 사용한다.

---

# 7. Background

전체 App Background는 순백색보다 매우 옅은 Blue Gray 계열을 사용한다.

권장:

```css
body {
  background:
    radial-gradient(
      circle at 12% 0%,
      rgba(78,124,255,.12),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      #f8faff 0%,
      #f4f7fb 45%,
      #eef3f8 100%
    );
}
```

업무 화면에서는 Gradient를 더 약하게 적용할 수 있다.

---

# 8. Surface

주요 콘텐츠 Surface는 White를 기본으로 한다.

```text
Page Background
    ↓
White Surface
    ↓
Border
    ↓
필요한 경우 Shadow
```

Surface 구분을 Shadow에만 의존하지 않는다.

---

# 9. Typography

기본 Font Family:

```css
font-family:
  "Pretendard",
  "Noto Sans KR",
  "Apple SD Gothic Neo",
  "Malgun Gothic",
  Arial,
  sans-serif;
```

Code:

```css
font-family:
  Consolas,
  "SFMono-Regular",
  monospace;
```

---

# 10. Typography Scale

기본 권장 범위:

```text
Hero             44 ~ 60px
Page Title       32 ~ 40px
Section Title    26 ~ 34px
Card Title       18 ~ 22px
Body             14 ~ 16px
Lead             16 ~ 18px
Caption          12 ~ 13px
```

대형 제목은 약한 Negative Letter Spacing을 적용한다.

```css
letter-spacing: -.04em;
```

---

# 11. Page Width

기본 Content Width:

```css
.wrap {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}
```

모든 Page를 무조건 Full Width로 확장하지 않는다.

단, Chat, Editor, Table 등 업무상 넓은 공간이 필요한 화면은 예외로 한다.

---

# 12. Header

기본 Header는 Sticky를 사용한다.

```css
position: sticky;
top: 0;
z-index: 50;

backdrop-filter: blur(14px);

background:
  rgba(255,255,255,.86);

border-bottom:
  1px solid rgba(223,230,239,.9);
```

Header는 콘텐츠보다 강하게 보이지 않게 한다.

---

# 13. Navigation

Navigation은 다음 원칙을 따른다.

- 메뉴 수를 최소화한다.
- 기능군 중심으로 구성한다.
- 세부 Version을 Main Navigation에 노출하지 않는다.
- Active 상태를 명확하게 표시한다.
- 하위 상태는 Tab 또는 Secondary Navigation을 사용한다.

---

# 14. Section Header

기술 설명형 Page는 다음 계층을 사용한다.

```text
SECTION KICKER
Title
Lead Description
```

예:

```text
PROJECT VALIDATION

EPUB Validation

현재 프로젝트의 구조와 접근성 상태를 검증합니다.
```

Kicker:

```css
font-size: 13px;
font-weight: 950;
letter-spacing: .09em;
color: var(--blue);
```

---

# 15. Card

Base Card:

```css
.card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;

  box-shadow:
    0 12px 35px rgba(24,45,82,.06);
}
```

Card를 모든 콘텐츠에 사용하지 않는다.

Card는 정보 그룹을 구분할 필요가 있을 때 사용한다.

---

# 16. Highlight Panel

중요한 Summary나 Conclusion에 한해서 Navy/Blue Gradient를 사용할 수 있다.

```css
background:
  linear-gradient(
    145deg,
    #102a50,
    #173865 58%,
    #2457e6
  );
```

적용 대상:

- 중요 Summary
- 완료 결과
- 핵심 Architecture
- Primary Conclusion

일반 Card에는 사용하지 않는다.

---

# 17. Split Layout

설명 + 시각 자료 조합에는 2:1 구조를 우선 검토한다.

```css
.split {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 22px;
}
```

왼쪽:

- Visual
- Data
- Table
- Diagram
- Preview

오른쪽:

- Explanation
- Summary
- Key Point
- Action

---

# 18. Grid

일반 Card Grid:

```text
Desktop
3 Columns

Tablet
2 Columns

Mobile
1 Column
```

레이아웃은 콘텐츠 밀도에 맞게 결정한다.

---

# 19. Spacing

권장:

```text
Page Section     32 ~ 64px
Card Padding     20 ~ 28px
Grid Gap         16 ~ 24px
Element Gap       8 ~ 16px
```

정보량이 많다고 Padding을 지나치게 축소하지 않는다.

---

# 20. Border Radius

```text
Input / Control       8 ~ 12px
Tag / Badge           8 ~ 12px
Card                 18 ~ 24px
Highlight Surface    24 ~ 30px
```

Pill Style을 남용하지 않는다.

---

# 21. Shadow

Shadow는 깊이를 강하게 표현하지 않는다.

권장:

```css
box-shadow:
  0 12px 35px rgba(24,45,82,.06);
```

Modal, Hero 등 특별한 Surface만 조금 더 강하게 사용할 수 있다.

---

# 22. Badge

Badge는 작은 상태 표현에만 사용한다.

예:

```text
ACTIVE
PASSED
FAILED
CURRENT
NEW
```

Badge는 문장을 포함하지 않는다.

---

# 23. Button

Button 계층:

```text
Primary
Secondary
Ghost
Danger
```

Primary Button은 한 화면에서 과도하게 반복하지 않는다.

가장 중요한 Action에 사용한다.

---

# 24. Table

Table 기본 원칙:

- Header에 옅은 Background
- 얇은 Row Border
- 좌측 정렬 우선
- 숫자는 필요하면 우측 정렬
- 상태는 Badge 사용
- 전체 Row를 상태 색으로 칠하지 않는다

---

# 25. Code Block

기술 데이터, Log, JSON, Source Preview는 Dark Surface를 사용할 수 있다.

```css
.code {
  background: #0e1c2f;
  color: #dfe9f7;

  border-radius: 16px;

  padding: 17px 18px;

  font-family:
    Consolas,
    "SFMono-Regular",
    monospace;
}
```

---

# 26. Diagram

Architecture나 Flow는 가능하면 Inline SVG 또는 React Component로 구현한다.

스타일:

- Rounded Rectangle
- White / Soft Surface
- Blue Connector
- Ink Text
- 제한된 Accent Color
- 최소한의 Shadow

Diagram 자체가 콘텐츠보다 화려해지지 않는다.

---

# 27. Timeline

순차 Process에는 Timeline을 사용할 수 있다.

적합한 사례:

- Validation Process
- Publish Process
- Release History
- Experiment History
- Build Pipeline

Timeline은 시간 또는 단계 순서가 실제 의미를 가질 때만 사용한다.

---

# 28. Tabs

같은 Context 내 Variant 또는 하위 Category 전환에는 Tab을 사용한다.

Tab은 Main Navigation을 대체하지 않는다.

예:

```text
Overview
Files
Validation
History
```

Active Tab:

```text
Blue Background
White Text
```

또는 Underline 방식도 허용한다.

한 서비스 내에서는 동일 Tab Style을 유지한다.

---

# 29. Responsive

900px 이하에서는 다중 Column을 적극적으로 단일 Column으로 전환한다.

```css
@media (max-width: 900px) {
  .split,
  .cards3,
  .pipeline {
    grid-template-columns: 1fr;
  }
}
```

560px 이하에서는 Horizontal Padding을 줄인다.

---

# 30. Accessibility

기본 필수사항:

- Semantic HTML
- Keyboard Navigation
- Visible Focus
- 적절한 Contrast
- Label 제공
- ARIA가 필요한 Component에 정확히 적용
- Heading Level 유지
- Color만으로 상태 표현 금지
- SVG aria-label
- Table Header 사용

---

# 31. Motion

Motion은 기능 이해를 도울 때만 사용한다.

권장:

- Fade
- Expand / Collapse
- Tab Transition
- Loading
- 완료 Feedback

피한다:

- 의미 없는 Bounce
- 지속 Animation
- 강한 Parallax
- 과도한 Confetti
- 콘텐츠보다 강한 Motion

---

# 32. Writing Tone

UI 문구는 짧고 기술적으로 작성한다.

권장:

```text
EPUB Validation
Project Indexing
Accessibility Result
Publish History
Current Project
```

피한다:

```text
놀라운 결과
완벽합니다!
엄청난 개선
```

객관적이고 확인 가능한 표현을 사용한다.

---

# 33. Component Reuse

새 Page를 구현하기 전에 기존 Component를 먼저 확인한다.

우선순위:

```text
Existing Component
        ↓
Variant 확장
        ↓
Composition
        ↓
새 Component
```

비슷한 Component를 Page마다 중복 생성하지 않는다.

---

# 34. Base Components

장기적으로 다음 Component를 공통화한다.

```text
PageHeader
SectionHeader
Card
MetricCard
Badge
Tabs
DataTable
CodeViewer
JsonViewer
Callout
Timeline
EmptyState
LoadingState
ErrorState
ConfirmDialog
```

Domain Page는 이 Component를 조합한다.

---

# 35. Design Consistency Rule

페이지별로 새로운 Design Language를 만들지 않는다.

다음 요소는 전체 GomsBook에서 동일하게 유지한다.

- Typography
- Primary Color
- Card Radius
- Border
- Shadow
- Header
- Tabs
- Badge
- Table
- Code Viewer
- Spacing

---

# 36. Page-Specific Extension

특정 Domain에만 필요한 디자인은 별도 Skill에서 정의한다.

예:

```text
DESIGN_SKILL.md
    │
    ├─ RAG_EXPERIMENT_DESIGN_SKILL.md
    ├─ EPUB_VALIDATION_DESIGN_SKILL.md
    └─ PUBLISH_DESIGN_SKILL.md
```

Domain Skill은 Root Skill을 상속한다.

---

# 37. Root Rule

> **GomsBook의 모든 화면은 같은 제품처럼 보여야 하며, 페이지의 기능 차이는 정보 구조로 표현하고 디자인 언어 자체를 바꾸지 않는다.**