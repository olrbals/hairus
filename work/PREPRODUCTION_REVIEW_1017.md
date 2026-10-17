# HAIRUS Production 배포 전 최종 수정 검수 · 2026-10-17

기준 `5cd1a4c0506289756d30988b418905240d43d867`, 기존 `codex/bottom-cta-three-screens-1016` 브랜치.

## 변경 사항

- 살롱 Featured Designer 이름만 13→14px. 기존 폰트/두께/색/카드/이미지/간격 유지.
- 살롱 상세의 ReviewSection에만 `countLabel="고객 후기 2,004개"` 전달. 원본 ReviewData와 다른 페이지의 출력은 유지.
- Figma MCP로 **현재** Information `929:3737`의 코드·렌더를 다시 확인. INFORMATION→매장 내부 간격 20→32px, SNS 구간 앞 간격 20→32px, SNS 제목 20px/600→16px/500, SNS 항목 간격 20→12px. 매장 내부 제목 색 #0e0e0e와 line-height 1.3 반영.
- 타이틀 Cormorant Garamond 34px/700/1.3, 매장 내부/SNS Pretendard 16px/500/1.3, SNS 채널명14px/500/1.3, 공통 자간−.02em. 기존 상하24px padding, 이미지 앞20px/사진 사이8px, 아이콘과 채널명12px 유지.
- Figma의 사진4개·벡터3개를 임시 폴더에 다운로드해 기존 로컬 에셋과 SHA-256 동일 확인. 사진 교체/크롭 변경 및 SNS 활성화 없음.
- 430px 화면에서 콘텐츠 너비382px, 메인382×257.078, 작은 사진119×169 /121×169 /126×168, 전체 섹션791.84px (Figma792px). 마지막 SNS 콘텐츠에서 예약 CTA까지 **64px** 유지.
- TEAM 공통 헤더 오른쪽 기존44px 액션 슬롯에 24px 캘린더. 별도 캘린더 에셋을 찾지 못해 프로젝트의 24px/1.5px/currentColor 선 SVG 규칙 사용. 헤더/타이틀/뒤로가기/Sticky 정책 유지.
- 사용자가 추가 답변으로 **예약 시작 화면** 연결을 명시. 기존 `/reservation/yoona/service`로 연결하며 TEAM의 윤아 예약 규칙 유지. 새로운 예약 페이지 없음.
- `.hc-article`의 care/issue 모두 기존 EditorialHeartSaveButton 한 개를 헤더에 배치. care 본문의 EditorialBookmarkButton 제거. AIRY와 동일한 공통 헤더 저장 스타일과 SaveHeart/SaveNoteControl 그대로 사용. 저장소·메모·사유 로직 변경 없음.

## 검증

- `corepack pnpm typecheck` 통과.
- `corepack pnpm test` 기존 **55/55** 통과.
- `corepack pnpm build` 통과.
- 신규 `work/preproduction-qa.cjs`: **112개 검증 통과**. 세 너비에서 Figma 수치, CTA64px, 후기문구, TEAM 타이틀 좌표/44px 터치영역/Sticky/예약 시작/뒤로가기 및 실제 터치·키보드 Enter, Article 저장 한 개/본문 제거/저장·즉시취소·재저장·메모/사유 복원·SAVED 매거진 반영 검증.
- AIRY와 Article 하트의 실제 버튼44×44, 우측 여백24px, 우측 정렬, 이미지 에셋/크기 동일 확인 (`heart-comparison.json`).
- TEAM 본문 전후 캡처 비교. Sticky 헤더가 locator 캡처 위에 겹치는 첫64px은 분리하고 나머지 본문을 비교. Article intro 캡처 전후 동일.
- 기존 Recommendation/EXPLORE/Preference 브라우저100개 검증 통과. 기존 Liquid Glass 브라우저154개 검증 통과.
- 모바일430/390/360px. 실물 iPhone 및 iOS Safari는 직접 검수하지 않음.
- Figma와 브라우저를 콘텐츠 너비382px로 나란히 비교: `information-comparison.png`.

증거 폴더 `/private/tmp/hairus-preproduction-qa/`: Figma 원본/비교PNG, 너비별 geometry JSON, 전후 캡처, 정적 검사 및 browser/navigation/recommendation 로그.

## 배포 준비 — 읽기 전용 확인

- `origin/main`: `8b2fdf44e5ad0d21f5d835a03dc0bbd604ccc0ea` (fetch 확인).
- main은 작업 브랜치 HEAD의 조상. 해당 스냅샷에서 Fast-forward 가능하며 merge 충돌 없음. 실제 병합/Push/배포는 미실행.
- 배포 예상 범위는 이번 수정뿐 아니라 main 이후 승인된 전체 개발 커밋(CTA/Login/Home Magazine/저장 UX/Magazine/Salon·Team/Reviews/Liquid Glass/Recommendation)을 포함.
- 공식 `https://hairus.vercel.app` 공개 HTTP 응답200 확인.
- Vercel MCP의 공식 `hairus` 프로젝트/현재 배포 조회는 kyumin2 scope **403 권한 오류**. Vercel CLI도 설치되어 있지 않아 같은 인증으로 보완 조회 불가. 실제 현재 Production SHA는 독립 검증하지 못함. 사용자 제공 기준은8b2fdf4이며 현재 SHA로 단정하지 않음.
- GitHub의 오래된 Production 배포 메타데이터만으로 현재 공식 도메인 SHA를 확정하지 않음.
- 사용자 승인 전 main과 Production 변경 없음. `hairus-rj22`의 설정/배포를 수동으로 변경하지 않음.

## 변경 파일

- src/components/prototype/salon-detail.tsx
- src/components/prototype/salon-detail.module.css
- src/components/prototype/reviews.tsx
- src/components/prototype/article-homecare.tsx
- work/preproduction-qa.cjs
- work/PREPRODUCTION_REVIEW_1017.md

기본 Mac 폴더 상태 및 기존 브랜치/worktree 보존. 새 브랜치/Reset/Clean/Force Push/기존 커밋 재작성 없음.
