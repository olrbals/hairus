# HAIRUS 디자인·UX 검수 기록

- 작업 브랜치: `codex/bottom-cta-three-screens-1016`
- 시작 커밋: `5c2ffcdfbeb74e01e19ce0a1fbf065d7fc4646d9`
- 기반 통합본: `8b2fdf44e5ad0d21f5d835a03dc0bbd604ccc0ea` (조상 관계 확인)
- 작업 경로: `/private/tmp/hairus-bottom-cta-review`
- 로컬 검수: http://127.0.0.1:3023 (Production 모드)

## 구현 내용

1. Login: 상단 여백 200px, 요청한 약관 문구와 정확한 줄바꿈 적용. BottomSheet import, provider 상태 및 호출 제거. 기존 데모 진입 함수를 각 로그인 버튼에 직접 연결.
2. Welcome: 이름 필드 120px. 360px 규칙의 기존 100px 덮어쓰기 제거. 공통 CTA CSS 및 세 화면의 CTA 마크업 보존.
3. Analysis Result: 프로필 간격 16px. 400px 이하 기존 8px 덮어쓰기 제거. 이미지의 기존 너비 139px / 좁은 화면 120px, 높이 194px 보존. 긴 정보가 넘치지 않도록 정보 영역만 줄바꿈 허용.
4. `/articles/issue`: 기존 공통 Glass Heart를 헤더 오른쪽에 한 번만 표시. 기존 고정 헤더, 뒤로가기, 높이 64px 보존. `/articles/care` 등 다른 상세의 헤더 구조 보존.
5. HOME: Discover의 공통 Card에 `showSave={false}` 전달하여 저장 컨트롤 자체를 렌더링하지 않음. Card 기본값은 true이므로 다른 화면은 보존. HOME 전체 저장 컨트롤 0개 확인.
6. HOME Magazine: 3회 반복한 안정적인 카드 인스턴스와 하나의 연속 위치 값으로 무한 이동 및 확대·축소 구현. 카드 사이 간격은 이동 중에도 8px. 활성 335×460px, 비활성 240×330px, 기존 이미지·최종 크롭·텍스트·링크 보존. 520ms cosine easing, 연속 입력 순차 처리, 드래그 미리보기, 취소 복귀 및 클릭 방지. 자동 전환 없음. reduced-motion은 즉시 이동.
7. Magazine 목록: Figma `920:4397` 및 하위 4401 / 4403 / 4407 / 4415 / 4426의 실제 디자인 컨텍스트와 스크린샷을 확인하여 전용 컴포넌트/CSS Module로 구현. 430px에서 페이지 1272px, 24px 좌우 여백, 64px 헤더, 382×312px 커버, 188×250px 2열 이미지, 105×111px 가로 기사 이미지, 52px 섹션 간격을 대조. 각 기사는 기존 상세 링크 유지. 목록 저장 버튼 없음.
8. 공통 저장: 기존 SAVENOTE 마크업과 스타일을 `SaveNoteControl`로 공유. 현재 저장 여부만으로 비활성 → SAVENOTE, 활성 → 즉시 해제, 해제 후 비활성 → SAVENOTE 재표시. 기존 메모 칩을 통한 편집 유지. 메모 편집 시 Archive 순서 유지. 기존 `hairus.prototype.v1`과 기사 전용 `hairus.editorial-bookmarks.v1` 저장소 유지. 기사 메모는 기존 북마크에 선택 필드 `reasons` / `note`를 추가하여 예전 데이터와 호환.

요청의 “미저장 상태는 SAVENOTE” 규칙에 따라 과거 `saveNoteEnabled=false` 값도 신규 저장·재저장에서 SAVENOTE를 건너뛰지 않습니다. 기존 시트의 스위치·옵션·OFF 피드백과 설정 데이터는 보존했습니다.

## 검증

- `corepack pnpm typecheck`: 통과.
- `corepack pnpm test`: 46/46 통과 (기존 42 + 추가 4).
- `corepack pnpm build`: 통과, 26개 정적 페이지 생성.
- `git diff --check`: 통과.
- 브라우저: `work/final-design-ux-qa.cjs`로 Chromium Production 모드 검수. 최종 843개 검증 통과, 런타임 오류 0개. 집계는 `/private/tmp/hairus-qa-1016/FINAL_QA.json`에 기록.
- CTA: 430 / 390 / 360px × 높이 932 / 874 / 740 / 640px × Welcome / Guide / Captured, 총 36개. 하단 40px, 겹침 없음, 가로 넘침 없음, 기존 버튼 크기 보존. Guide / Captured 전체 높이도 원본과 동일.
- 키보드: 포커스 후 뷰포트 높이 360px 축소를 모사하여 입력창 접근 확인. 물리 기기와 OS 키보드 직접 검수는 별도.
- 저장: Airy, 윤아, 소희, Arvo, Issue Article, 일반 Article, IN FOCUS에서 SAVE / UNSAVE / RESAVE 확인. SAVED 즉시 목록 반영, 기사 목록 반영, 메모 편집·순서·새로고침 보존 확인.
- 캐러셀: 9회 정방향 이동(2회 이상 루프), 역방향 루프, 빠른 3회 클릭, 빠른 방향 반전, 마우스 드래그, Chromium touch 이벤트, 드래그 후 클릭 방지, 정상 링크 이동, reduced-motion 확인. 실제 프레임의 이동·크기·8px 간격도 샘플링. 마지막 카드 → 첫 카드 연속 화면 별도 시각 검수.
- 시각 보존: 원본 5c2ffcd를 별도 소스 복사본으로 실행하여 비교. HOME Hero / A Seat for You / 하단 추천 배너, `/articles/care` 헤더는 동일 조건 스크린샷의 픽셀 일치. HOME Magazine은 정지 상태의 위치·크기·크롭·글꼴 값 동일.
- Figma: 430px 원본 및 렌더 스크린샷 대조, 390 / 360px 반응형 검수. 이미지 전체 로딩과 슬롯·크롭 확인. 브라우저/캔버스 렌더링의 미세한 차이는 있음.

## 이미지·글꼴 출처

- Magazine 커버 `4d389.png`: 지정 노드의 Figma MCP 에셋. 기존 HOME의 `0dc76.png`를 바꾸지 않고 새 목록용 에셋으로 추가.
- `48a15.png`, `6b945.png`, `5f044.png`: Figma 제공 원본과 기존 파일 SHA-256 일치 확인 후 재사용.
- 뒤로가기: 기존 `HeaderBackIcon` / `30ced.svg` 재사용.
- 상단 라벨: Figma의 Noto Sans KR Medium 10px / 2px 자간. 공식 Google Fonts에서 해당 문구에 필요한 2,996바이트 서브셋을 로컬 저장. 기존 Noto Sans KR 라이선스 사용. 나머지는 기존 Pretendard와 Cormorant Garamond 재사용.

## 재실행

```sh
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm start --hostname 127.0.0.1 --port 3023
```

별도 터미널에서 설치된 Playwright 경로를 지정합니다.

```sh
HAIRUS_PLAYWRIGHT_MODULE=/Users/qm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright \
HAIRUS_QA_URL=http://127.0.0.1:3023 \
node work/final-design-ux-qa.cjs
```

원본 비교는 `HAIRUS_BASELINE_URL`을 지정하면 추가 실행됩니다. 증거 파일은 기본 `/private/tmp/hairus-qa-1016`에 생성됩니다. 스크린샷과 프레임 JSON은 저장소 밖에 두었습니다.

## Git 보호

- 원격 작업 브랜치가 시작 시 `5c2ffcd`임을 확인 후, 동일 이름의 원격 기존 브랜치를 임시 worktree에 체크아웃.
- 기본 `/Users/qm/Documents/hairus`의 브랜치 `codex/hair-profile-flow`, HEAD `a9f0f88` 및 미추적 파일을 그대로 보존.
- 기존 10개 worktree의 경로·HEAD 보존. 삭제·초기화·기존 커밋 재작성·Force Push 없음.
- main과 최종 통합 브랜치는 `8b2fdf4` 상태로 유지. 병합·수동 Production 배포·롤백 실행 안 함.
- 최종 사용자 시각 승인 및 실기기 확인은 별도.

## 변경 파일

- `public/assets/figma/magazine/4d389.png`
- `public/fonts/NotoSansKR-magazine-500.ttf`
- `src/app/(entry)/login/page.tsx`
- `src/app/magazine/page.tsx`
- `src/components/prototype/article-homecare.css`
- `src/components/prototype/article-homecare.tsx`
- `src/components/prototype/details.tsx`
- `src/components/prototype/editorial-bookmark.tsx`
- `src/components/prototype/home.tsx`
- `src/components/prototype/magazine-carousel.tsx`
- `src/components/prototype/magazine-index.module.css`
- `src/components/prototype/magazine-index.tsx`
- `src/components/prototype/save-note-control.tsx`
- `src/components/prototype/shared.tsx`
- `src/lib/prototype/editorials.ts`
- `src/lib/prototype/magazine-carousel.ts`
- `src/styles/analysis.css`
- `src/styles/entry.css`
- `src/styles/prototype.css`
- `tests/archive.test.mjs`
- `tests/magazine-carousel.test.mjs`
- `work/DESIGN_UX_REVIEW_1016.md`
- `work/final-design-ux-qa.cjs`
