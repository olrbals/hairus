# HAIRUS Bottom Navigation 검수 기록 · 2026-10-17

기준: `6891ff042ab535c23402afbc2c78bb3e2fb0fe82` / `codex/bottom-cta-three-screens-1016`.
작업 경로: `/private/tmp/hairus-bottom-cta-review`.

## 변경 범위

- Bottom Navigation의 네 라벨만 홈 / 탐색 / 저장 / 마이로 변경.
- 기존 페이지의 `BottomNav active` 호출을 유지하고, Root Layout에 지속되는 Navigation host를 추가. 페이지별 표시 정책과 Next Link 라우팅을 유지하며 이동을 지연하지 않음.
- Spring 위치·속도를 유지하면서 새 목적지로 전환. 빠른 재선택/방향 반전 때 위치나 형태를 초기화하지 않음.
- SVG 앞쪽 Glass, 뒤쪽 물방울, 양쪽 접합부까지 연속적으로 수축하는 오목한 Bézier 연결부를 하나의 알파 실루엣으로 합성. 연결부가 가늘어져 분리된 뒤 물방울이 소멸. 아이콘과 텍스트는 별도 레이어.
- 정지 상태는 승인된 CSS의 배경·테두리·내부/외부 그림자·반경을 그대로 재사용. SVG에서 정지 CSS로 마지막 미세한 차이만 부드럽게 전환.
- `requestAnimationFrame`에서 SVG/스타일 ref만 갱신하여 프레임마다 React를 렌더링하지 않음. 비활성화/해제 시 rAF, ResizeObserver, 미디어 이벤트 정리. Reduced Motion에서는 즉시 전환.
- 외부 라이브러리, 색상, 아이콘, 페이지 기능 추가 없음. Recommendation 및 다른 화면의 구현 파일은 수정하지 않음.

동작 참고: [Apple WWDC25 · Build a SwiftUI app with the new design](https://developer.apple.com/videos/play/wwdc2025/323/). 네이티브 API를 추가하는 작업이 아닌 기존 웹 UI에 맞춘 SVG/Spring 구현.

## 검증

- `corepack pnpm typecheck`: 통과.
- `corepack pnpm test`: 기존 47개 + 새 Spring/형태 회귀 테스트 5개 = 52개 통과.
- `corepack pnpm build`: 통과.
- 브라우저: **184개 검증 통과**, JavaScript 및 Navigation 관련 console 오류 0개. `node work/bottom-nav-qa.cjs` (프로덕션 빌드, Chrome / 모바일 터치 에뮬레이션).
- 430 / 390 / 360px, 높이 640 / 874 / 932px. 바닥 Safe Area 0px 및 CDP 환경값 34px.
- 기존 값과 비교: bar 높이 64px, 너비 viewport−32px(최대398px), bottom14px+safe area, 탭 너비/좌표, Glass 배경·blur·border·shadow·radius 동일.
- 인접 및 먼 탭 6가지 전환, 빠른 연속 클릭·반전·동일 탭 재선택, URL/aria-current/Indicator 동기화, 동일 Navigation DOM 유지, 뒤로/앞으로가기, 터치, 키보드 Enter, Reduced Motion 검증.
- SALON / TEAM / LOGIN / MAGAZINE의 Navigation 미표시와 AIRY 상세의 탐색 활성 정책 유지.
- 430px에서 실제 Link 라우팅과 함께 0–800ms 구간을 제어해 시작 / 늘어남 / 연결 / 가늘어짐 / 분리 / 종료 렌더링을 캡처.
- 기존 기준 커밋에도 없는 `/favicon.ico`의 404는 Navigation 검수 오류에서 제외. 해당 자산은 요청 범위 밖이므로 변경하지 않음.
- 실물 iPhone 및 iOS Safari는 이 환경에서 직접 검수하지 않음. 모바일 조건은 Chrome 에뮬레이션 검증 범위.

증거 파일은 `/private/tmp/hairus-nav-qa/`의 `NAV_QA.json`, `browser.log`, `typecheck.log`, `tests.log`, `build.log`, 단계별 Navigation PNG.
검수 주소: http://127.0.0.1:3025/home

## Git 보호

기존 승인 커밋을 재작성하지 않고 기존 작업 브랜치에 새 커밋을 추가. 다른 브랜치/worktree 및 기본 Mac 작업 폴더 보존. main/최종 통합 브랜치 병합, 수동 배포, Reset/Clean/Force Push 없음.

## 변경 파일

- `src/app/layout.tsx`
- `src/components/bottom-nav.tsx`
- `src/components/bottom-nav.css`
- `src/components/liquid-indicator.tsx`
- `src/lib/routes.ts`
- `src/lib/liquid-navigation.ts`
- `tests/liquid-navigation.test.mjs`
- `work/bottom-nav-qa.cjs`
- `work/BOTTOM_NAV_REVIEW_1017.md`
