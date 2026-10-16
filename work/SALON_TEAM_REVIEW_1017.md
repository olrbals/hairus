# HAIRUS SALON / TEAM 검수 기록

- 브랜치: `codex/bottom-cta-three-screens-1016`
- 시작 SHA: `5a2bfbcbea71ff542b504354f53b88cc4586c873`
- 원격 작업 브랜치와 로컬 시작 HEAD 일치 확인. 시작 시 작업 worktree의 미커밋/미추적 파일 없음.
- 작업 경로: `/private/tmp/hairus-bottom-cta-review`
- 로컬 검수: http://127.0.0.1:3025/salons/arvo / http://127.0.0.1:3025/salons/arvo/designers
- 추가 요청 반영: Reviews의 세 가지 표시 수정을 윤아·소희 디자이너 상세에도 적용.

## Figma 원본 분석 및 구현

실제 Figma MCP 디자인 컨텍스트와 스크린샷을 확인했습니다.

### 로고: 945:9579

원본은 저해상도 사진이 아니라 배경 `#dfd8d8`, 8px 모서리, 40×40px 프레임 안에 Reenie Beanie Regular 24px / 130% / -2% / 검정 80%로 작성된 `ARVO` 텍스트입니다.

기존 `arvo-logo.png`를 확대하지 않고 동일한 글꼴과 텍스트를 HTML/CSS로 재현했습니다. 공식 Google Fonts에서 ARVO 문구용 4,660바이트 글꼴 서브셋과 SIL OFL 라이선스를 로컬 저장했습니다. 로고는 Figma와 동일한 프레임과 글자 배치이며 DPR 3에서도 네이티브 텍스트로 렌더링됩니다. 기존 Notice 카드의 크기, 콘텐츠, 혜택 안내 동작은 보존했습니다. 기존 PNG 파일은 삭제하지 않았습니다.

### Information: 929:3737

- 내용 순서: INFORMATION → 매장 내부 → 큰 이미지 → 3열 이미지 → SNS → 카카오톡 오픈 채팅 / 네이버 블로그 / 인스타그램.
- 430px에서 콘텐츠 너비 382px, 좌우 패딩 24px, 상하 패딩 24px.
- 타이틀 Cormorant Garamond Bold 34px / 130%. 매장 내부 Pretendard 16px / 500 / 130%, SNS 20px / 600 / 130%, 채널 이름 14px / 500 / 130%.
- 큰 이미지 382×257.08px (263:177), 작은 이미지 119×169px / 121×169px / 126×168px, 이미지 간격 8px. 세 이미지 행 170px, 중앙 정렬.
- 콘텐츠 및 SNS 행 간격 20px. 카카오·네이버 32px, 네이버 마크 14px, 인스타그램 원본 SVG 31.0085×31px, 아이콘과 문구 간격 12px.
- Figma 이미지 네 개와 기존 파일의 SHA-256 일치 확인 후 재사용. 원본 SNS SVG 세 개를 로컬 저장. 실제 에셋의 로딩·슬롯·치수를 브라우저에서 검증했습니다.
- Figma에 없는 기존 ‘채널 연결 준비 중이에요.’와 각 행 ‘준비 중’ 표시는 렌더링에서 제거했습니다. 기존 SNS 비활성 상태는 보존했으며 실제 채널 URL이나 새 기능을 만들지 않았습니다.
- 로딩 전후 이미지 치수가 안정적이도록 명시적 비율·그리드 행·이미지 크기를 적용했습니다. 390/360px에서는 같은 구조와 비율로 축소됩니다.

### TEAM: 929:3947

상위 섹션은 sparse 응답이므로 실제 하위 노드 `1099:2667`, `929:4223`, `929:3869`, `945:10299`, `945:10302`의 고정밀 응답을 추가 분석했습니다.

- 기존 `SalonHeader` 마크업과 스타일을 그대로 보존했습니다. 세 너비의 헤더 스크린샷은 수정 전과 픽셀이 일치합니다.
- 본문 상단 20px, 타이틀 28px / 600 / 130%, 소개 12px / 400 / 130%, 타이틀과 소개 간격 8px.
- 첫 추천 섹션 위 28px, 그룹 사이 24px, 그룹 제목 20px / 600 / 130%, 제목과 카드 간격 12px, 같은 그룹의 두 카드 간격 12px.
- 이름 14px / 500 / 130%, 전문 분야 12px. 기존 430px 이미지 64×76px, 12px 모서리·중앙 크롭·상세 링크를 유지했습니다. 360px의 기존 축소 규칙도 유지했습니다.
- 모든 텍스트의 자간은 저장소 AGENTS.md의 공통 `-0.02em` 정책을 유지했습니다.
- Figma의 ‘7명의 디자이너’와 윤아 ‘화 · 토 OFF’는 사용자의 명시적 요구인 6명 / 화·금으로 우선 적용했습니다. 새 디자이너나 정보를 추가하지 않았습니다.
- 추가 검수 요청에 따라 Figma에 없는 하단 검정 예약 CTA와 스크롤·포커스 호출을 렌더링에서 제거했습니다. Figma의 본문 하단 52px 여백을 적용했습니다. 디자이너별 예약 버튼은 유지했습니다.

## 동작 및 간격

- 살롱 상세 공통 헤더: 제목을 사용자 요청대로 `아르보 성수`로 변경했습니다. 기존 디자인·64px 높이를 보존하고 상단 Sticky. 기존 48px 섹션 내비게이션은 헤더 아래 64px에 Sticky. 섹션 이동과 스크롤 감지는 총 112px 기준으로 정렬하여 제목이 가리지 않게 했습니다. TEAM 및 다른 페이지 헤더는 변경하지 않았습니다.
- 예약 CTA: Information 마지막 SNS 행 하단부터 버튼 상단까지 정확히 **64px**. Information 하단 패딩 24px + 별도 간격 40px. 기존 버튼 61px 높이, 너비, 색상, 글꼴, 모서리, `/salons/arvo/designers` 링크를 보존했습니다.
- Featured Designers: 간격만 **12px**. 기존 이미지, 카드 디자인, 상세 링크 보존.
- Reviews: 공통 `refined` 옵션을 살롱 상세와 디자이너 상세에만 적용. Demo Label 미렌더링, Rating Meta 위 여백 **12px**, Rating Score의 별 `<span>` **28px**. 리뷰 원문·개수·별점·분포·장점 그래프·카드·모든 후기 버튼은 유지했습니다. 별도 살롱 후기 페이지는 기존 상태를 보존했습니다.
- 예약 제한: TEAM의 윤아 행은 기존 `/reservation/yoona/service` 링크. 나머지 다섯 행은 `disabled`인 실제 button이며 opacity 1로 기존 시각적 강조를 유지합니다. 클릭·예약 시작·모달·이동이 발생하지 않습니다. 다른 페이지의 소희 예약 링크 등은 유지했습니다.

| 디자이너 | 휴무일 | TEAM 예약 |
| --- | --- | --- |
| 소율 원장 | 화 · 토 OFF | 비활성 |
| 소희 실장 | 월 · 목 OFF | 비활성 |
| 하나 디자이너 | 수 · 목 OFF | 비활성 |
| 경현 디자이너 | 화 · 일 OFF | 비활성 |
| 윤아 디자이너 | 화 · 금 OFF | 기존 기능 유지 |
| 종훈 디자이너 | 월 · 수 OFF | 비활성 |

기존 `arvoTeam` / `offDaysLabel`을 재사용했습니다. 예약 가능 요일 계산·다른 예약 플로우·저장 상태 데이터는 변경하지 않았습니다.

## 검증 결과

- `corepack pnpm typecheck`: 통과.
- `corepack pnpm test`: **47/47** 통과. 기존 46개와 이름·직급·휴무일 표시 검증 1개 포함.
- `corepack pnpm build`: 통과, 26개 정적 페이지 생성.
- `git diff --check`: 통과.
- 살롱·TEAM 브라우저: **1,129개 검증 통과**, 오류 0개. 최종 결과는 `/private/tmp/hairus-salon-qa-1017/SALON_TEAM_QA.json`.
- 반응형: 430 / 390 / 360px × 높이 932 / 874 / 740 / 640px × 두 페이지 = **24개 조합**. 가로 넘침 없음, 헤더·내비게이션 겹침 없음, CTA 64px 및 Featured 12px 유지, 6명 데이터 정확, 비활성 버튼 클릭 무동작.
- 이전 승인 기능 브라우저: **746개 검증 통과**, CTA **36개 조합**, 오류 0개. `work/final-design-ux-qa.cjs`를 새 빌드에 실행하여 캐러셀 2회 이상 루프·드래그·터치·연속 입력·reduced-motion, SAVE/UNSAVE/RESAVE, SAVED, 메모 편집·새로고침, Login/Welcome/Analysis/Magazine을 확인했습니다.
- Figma와 같은 430px에서 Information 전체 높이 약 **789.05px**, 실제 사진 크기와 64px 간격 확인. 원본 스크린샷과 렌더를 대조했습니다. 브라우저·Figma의 이미지 리샘플링 차이는 있습니다.
- TEAM 헤더 430/390/360px: 수정 전후 픽셀 일치.
- 변경 제외 영역 스크린샷: EXPLORE 세 탭, SAVED, Login, Welcome, Analysis Guide, Magazine, 별도 살롱 후기 페이지가 픽셀 일치. HOME도 레이아웃·이미지·타이포그래피 보존(극소수 픽셀의 렌더링 반올림 차이만 존재).
- 물리 기기와 실제 OS 키보드의 직접 검수는 수행하지 않았습니다. Chromium 모바일 너비·높이 및 Retina DPR 3 환경에서 검수했습니다.

## 재실행

```sh
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm start --hostname 127.0.0.1 --port 3025
```

별도 터미널:

```sh
HAIRUS_PLAYWRIGHT_MODULE=/Users/qm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright \
node work/salon-team-qa.cjs

HAIRUS_PLAYWRIGHT_MODULE=/Users/qm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright \
HAIRUS_QA_URL=http://127.0.0.1:3025 \
HAIRUS_QA_OUTPUT=/private/tmp/hairus-salon-qa-1017/previous-regression \
node work/final-design-ux-qa.cjs
```

## Git 보호

기존 브랜치와 worktree를 그대로 사용했습니다. `/Users/qm/Documents/hairus`의 미추적 파일 목록과 다른 worktree 경로·HEAD를 시작 기록과 대조하여 보존을 확인했습니다. main과 최종 통합 브랜치는 `8b2fdf4` 상태를 유지합니다. 기존 커밋 재작성, Force Push, 다른 브랜치 변경, worktree 삭제·초기화, main 병합, 수동 Production 배포는 수행하지 않습니다.

## 변경 파일

- `public/assets/figma/salon-arvo/instagram.svg`
- `public/assets/figma/salon-arvo/kakao-original.svg`
- `public/assets/figma/salon-arvo/naver-mark.svg`
- `public/fonts/ReenieBeanie-LICENSE.txt`
- `public/fonts/ReenieBeanie-arvo.ttf`
- `src/components/prototype/designer-detail.tsx`
- `src/components/prototype/reviews.module.css`
- `src/components/prototype/reviews.tsx`
- `src/components/prototype/salon-detail.module.css`
- `src/components/prototype/salon-detail.tsx`
- `tests/salon-arvo.test.mjs`
- `work/SALON_TEAM_REVIEW_1017.md`
- `work/salon-team-qa.cjs`
