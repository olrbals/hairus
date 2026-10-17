# HAIRUS Recommendation 2차 검수 · 2026-10-17

기준 `1f9919c869adb6c24060c4b0183da6a72df4ad3d`, 기존 `codex/bottom-cta-three-screens-1016` 브랜치.

## 구현

- 기존 EXPLORE의 18개 시도 목록(전체 포함)을 `regions.ts`로 그대로 분리하고 두 화면에서 동일 배열 사용. EXPLORE는 데이터 import만 변경하고 렌더링·CSS·필터 동작은 보존.
- Recommendation의 지역 BottomSheet 렌더링과 호출 제거. 기존 버튼 위치/디자인을 보존하고 바로 아래에 EXPLORE `regionOptions` CSS로 2열 목록 표시. 선택 표시·체크 아이콘 재사용, 선택하면 닫힘, 다시 열어 변경 가능. 추가 지역 단계 없음.
- `matching.location: string[]` 및 저장소 버전 유지. 예전 성수/강남/홍대 응답도 그대로 복원·표시하고 사용자가 새 지역을 선택할 때만 변경. 다른 응답/취향/저장 데이터는 초기화하지 않음.
- 기존 추천 점수와 정렬 유지. 기존 지역의 정확 일치 및 새 시도 이름과 기존 살롱 주소의 일치를 같은 지역 가산점에 연결. 새 추천 알고리즘·지역 API 없음. ‘전체’는 지역 가산점 없음.
- 상담 칩에 Preference의 실제 `preference-survey-step__chips chip-options` 클래스를 직접 재사용. 기존 Preference CSS 파일 수정 없음. 기본/선택 computed style과 반응형 gap/padding 동일.
- 기존 Preference처럼 설명 위치에 `preference-limit-feedback` 280ms 흔들림을 적용하고 attempt key로 반복 재생. 기존 안내 문구 유지, 최대 개수 문구와 반복 시도 횟수는 동일한 숨겨진 status 영역으로 전달. 카드 질문의 이미지/디자인은 보존하고 초과 선택 안내에만 동일 효과 적용.
- 선택 제한 `[1,1,1,3,3]`, 해제/재선택 및 ‘특별한 경험 없음’의 배타 선택 보존.
- 360px의 긴 칩 목록과 기존 CTA가 겹치지 않도록 상담 단계의 콘텐츠 하단 여백 확보. CTA 자체와 하단 배치 규칙 유지.

## 검증

- TypeScript 통과, 자동 테스트 **55/55** (기존52 + 신규3), Production Build 통과.
- `work/recommendation-qa.cjs`: **100개 검증 통과**, JavaScript runtime 오류 없음.
- 430/390/360px, 640px 높이에서 지역 선택·변경·전체·18개 목록 일치·BottomSheet 미표시·복원·이전/다음·결과 화면까지 진행 검증.
- 상담 칩 computed style을 Preference 기본/선택 스타일과 비교. 4번째 클릭 두 번, 3개 유지, 해제 후 교체, 상태/애니메이션 반복 검증. 카드 질문과 단일 선택 제한 보존.
- 가로 넘침과 칩/CTA 겹침 없음. 지역 목록 마지막 제주 옵션까지 스크롤로 선택 가능.
- EXPLORE 지역 목록 및 Preference 칩은 수정 전/후 같은 너비·상태의 PNG가 바이트 단위로 동일. 기존 지역 필터 적용과 Preference 초과 선택 효과도 정상.
- Liquid Glass 소스·스타일·Root Layout 변경 없음. 기존 Navigation 브라우저 회귀 **154개 검증 통과** (3개 너비/높이, Safe Area, 터치/키보드, 라우팅, 연결/분리 프레임).
- 실물 모바일 기기는 직접 검수하지 않았으며 Chrome 모바일 너비/높이 조건으로 확인.

증거: `/private/tmp/hairus-recommendation-qa/`의 reference.json, QA.json, browser.log, tests.log, typecheck.log, build.log 및 PNG.
검수 URL: http://127.0.0.1:3025/recommendation/intro

## 변경 파일

- src/components/prototype/matching-survey.tsx
- src/components/prototype/matching-survey.module.css
- src/components/prototype/people-explore.tsx (동일 데이터 import만 변경)
- src/lib/prototype/regions.ts
- src/lib/prototype/catalog.ts (추천 지역 옵션만 변경)
- src/lib/prototype/logic.ts (기존 지역 가산점의 시도 값 호환)
- tests/recommendation.test.mjs
- work/recommendation-qa.cjs
- work/RECOMMENDATION_REVIEW_1017.md

기존 브랜치/worktree와 기본 Mac 작업 폴더 보존. main 및 Production 변경 없음. Reset/Clean/Force Push·커밋 재작성 없음.
