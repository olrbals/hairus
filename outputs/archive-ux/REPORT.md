# HAIRUS Archive UX refinement

## Git 기준

- GitHub 원격 브랜치 전체 조회 및 fetch 후 기준 확정: `codex/final-editorial-airy-discover-savenote`
- 기준 커밋: `c84f314dffd99a2b781d2e39a3df3934778ee7d3`
- 해당 커밋은 `8d41b25`(Discover + SAVENOTE 통합) 이후 Airy Layered 원본 이미지와 크롭 개선을 포함한다.
- 작업 브랜치: `codex/archive-ux-refinement`
- 작업 폴더: `.worktrees/archive-ux-refinement`
- 기존 브랜치, 원본 체크아웃 및 모든 기존 worktree를 보존했다.

## 구현

- Archive: 스타일 / 디자이너 / 헤어샵 / 매거진. 최초 진입 및 새로고침 기본값은 스타일. 카테고리 내부 검색, 키보드 탭 이동, 카테고리별 빈 상태와 탐색 링크 제공. ALL / 중복 View All 구성 없음.
- STYLE: 183×251 이미지, 16px 가로 간격의 2열 그리드. 스타일명은 이미지 아래 8px, 16px Medium. 기존 저장 순서, 이미지 리소스, 상세 링크 유지.
- DESIGNER: 기존 프로필 + 이름 16px / 살롱 12px의 2줄 구성. 기존 3장 포트폴리오 이미지와 순서 재사용. 전문 분야는 Archive에서만 제외. 포트폴리오 아래 이유 칩.
- SALON: 기존 공간 이미지, 이름 20px, 위치 12px, 이유 칩. 평점이나 가격 추가 없음.
- 기존 Glass 하트와 하단 네비게이션 재사용. 이유 칩은 배경 #F5F4F2 / 글자 #666460 / 12px / 6px 10px 패딩 / 999px 모서리이며 Glass 없음.
- 이유 표시: 직접 메모 첫 줄을 우선한 뒤 선택형 이유 순서로 최대 2개 칩을 표시한다. 3개 이상이면 옆에 작은 +N으로 나머지 개수를 표시한다. 각 칩은 한 줄 말줄임이며, 칩과 +N 모두 기존 SAVENOTE를 연다. 전체 메모와 모든 선택 이유를 그대로 보존한다.
- 칩과 하트는 상세 링크 바깥에 배치하며 동일한 기존 SAVENOTE 편집기를 연다. OFF여도 기존 메모는 편집할 수 있다. 메모 입력은 여러 줄 원문을 유지하는 textarea로 보완했다.
- SAVENOTE 적용 시 기존 저장 항목의 위치와 savedAt을 유지한다. 해제와 ON/OFF 설정은 기존 동작 유지.
- MAGAZINE: 기존 ARTICLE 4개 및 IN FOCUS soft-bob을 지원한다. 큰 이미지 1열 리스트, 기존 영문 제목과 카테고리, 이미지 우측 상단 44px 북마크. 새 기사나 이미지 생성 없음.
- 북마크는 일반 ARTICLE 상세, HAIR CARE 상세, IN FOCUS 상세 및 실제 `/magazine` 카드에 연결한다. 즉시 저장/해제하며 SAVENOTE를 열지 않는다. HOME의 레이아웃과 상호작용은 변경하지 않았다.
- 기존 `/articles/issue`는 HAIR CARE 상세를 표시하는 경로이므로 care 북마크를 공유한다. 팝업 프로모션은 별도 항목으로 스크랩하지 않는다.

## 데이터 호환성 및 보존

- 기존 `hairus.prototype.v1`의 version/schema와 저장 키를 유지한다. 스타일/디자이너/헤어샵, 모든 이유/메모, 예약/초안, 취향/매칭 설정을 초기화하거나 마이그레이션하지 않는다.
- 스크랩 전용 localStorage 키: `hairus.editorial-bookmarks.v1`
- 저장 형식: `[{kind: "article" | "focus", id: string, savedAt: string}]`. 콘텐츠 종류와 ID를 함께 식별한다.
- 같은 페이지와 다른 브라우저 탭에서 상태를 동기화한다. 잘못된 데이터/중복/프로모션 항목은 스크랩 목록으로 복원하지 않는다. 저장소 쓰기 실패 시 현재 탭 메모리 상태와 오류 안내를 제공한다.
- 기존 상세페이지 직접 진입 시 최근 본 기록 갱신이 저장소 복원보다 먼저 실행될 수 있는 문제를 발견했다. Provider는 첫 갱신 전에 기존 저장소를 읽고, ARTICLE/일반 상세의 최근 기록 갱신은 ready 이후 실행하도록 보완했다. 디자인 변경 없이 데이터 덮어쓰기를 방지한다.
- 이미지 파일, Airy Layered 상세 구현/원본 크롭, HOME, MY, 디자이너 상세 구현, 예약 구현 및 하단 네비게이션 파일은 변경하지 않았다.
- Discover 디자이너 프레젠테이션 데이터를 공용 데이터 모듈로 추출해 Archive에서 동일 이미지와 순서를 재사용한다. Discover 화면의 마크업/스타일/동작은 유지한다.

## 검증

- `npx pnpm typecheck`: 통과.
- `npx pnpm build`: Next.js 16.4.0 / Turbopack 프로덕션 빌드 통과.
- `npx pnpm test`: 28개 통과, 실패 0 (기존 24개 + Archive 회귀 테스트 4개).
- 테스트에는 기존 Node MODULE_TYPELESS_PACKAGE_JSON 경고가 있으며 실패는 아니다.
- 초기 공유 node_modules Junction으로 빌드할 때 Turbopack root 제한 오류가 있었다. 새 worktree에 `npx pnpm install --offline --frozen-lockfile`로 독립 설치한 후 표준 빌드가 통과했다. package.json/lockfile/빌드 설정은 변경하지 않았다.
- 프로덕션 서버 + 실제 Chrome headless 브라우저 / 모바일 터치 에뮬레이션 / viewport 430×932 / DPR 1.
- `node outputs/archive-ux/verify.cjs`: **92개 확인 통과**, 브라우저 런타임 오류 0. 상세 결과는 `qa.json`.
- 최대 2개 칩, 3개 이상 +N 표시 및 편집 연결, 4개 탭, 기본 STYLE, 2열/16px 간격, 텍스트 배치, 칩 우선순위·숨김·말줄임, 전체 다중 이유와 여러 줄 메모 복원/수정, 저장 순서, 저장 해제, SAVENOTE ON/OFF, 빈 상태, 실제 기사/IN FOCUS 저장·해제·Archive 동기화, issue 별칭, 새로고침 유지, 다른 탭 동기화, 저장소 실패 안내를 검증했다.
- 기존 저장/예약/초안/취향/매칭 데이터를 삽입한 격리된 테스트 브라우저에서 스크랩 전후 및 상세 직접 진입 전후 동일성을 비교했다. 실제 사용자 브라우저의 저장소는 수정하지 않았다. 스크린샷에 보이는 저장 항목은 이 테스트 fixture이며 제품 초기 데이터가 아니다.
- HOME / Discover / MY / 디자이너 / 살롱 / Airy Layered / 예약 페이지 HTTP 200 및 가로 넘침 없음을 확인했다. 기존 예약 서비스 선택 유지, Airy Layered 4슬라이드와 원본 이미지 경로 유지도 확인했다.
- 스크린샷 STYLE / DESIGNER / SALON / MAGAZINE / SAVENOTE / ARTICLE / IN FOCUS를 직접 열어 시각 검수했다.
- 실물 모바일 기기 및 iOS Safari 검수는 수행하지 않았다. 전체 예약 신규 완료 플로우는 이번 브라우저 검수 범위에 포함하지 않았으며 기존 예약 자동 테스트가 통과했다.

## 변경 파일 목록

제품 및 테스트:

- `src/app/(main)/saved/page.tsx`
- `src/components/prototype/saved.tsx` (신규)
- `src/components/prototype/saved.module.css` (신규)
- `src/components/prototype/editorial-bookmark.tsx` (신규)
- `src/components/prototype/editorial-bookmark.module.css` (신규)
- `src/components/prototype/article-homecare.tsx`
- `src/components/prototype/in-focus-editorial.tsx`
- `src/components/prototype/details.tsx`
- `src/components/prototype/explore.tsx`
- `src/components/prototype/people-explore.tsx`
- `src/components/prototype/shared.tsx`
- `src/components/prototype/savenote.module.css`
- `src/components/prototype/store.tsx`
- `src/lib/prototype/archive.ts` (신규)
- `src/lib/prototype/editorials.ts` (신규)
- `src/lib/prototype/people-presentation.ts` (신규)
- `tests/archive.test.mjs` (신규)

검수 산출물:

- `outputs/archive-ux/REPORT.md`
- `outputs/archive-ux/verify.cjs` (브라우저 검수 재현 스크립트)
- `outputs/archive-ux/qa.json`
- `outputs/archive-ux/style-430.png`
- `outputs/archive-ux/designer-430.png`
- `outputs/archive-ux/salon-430.png`
- `outputs/archive-ux/magazine-430.png`
- `outputs/archive-ux/magazine-empty-430.png`
- `outputs/archive-ux/savenote-430.png`
- `outputs/archive-ux/article-bookmark-430.png`
- `outputs/archive-ux/focus-bookmark-430.png`

## 미해결 사항

요청한 기능 범위에 미해결 항목 없음. 실물 기기/iOS Safari 검수는 위 한계 참고. 커밋 SHA 및 Push 결과는 최종 응답과 Git 이력 참조.
