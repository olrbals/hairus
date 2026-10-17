# HAIRUS Designer Portfolio — 2026-10-17

## 기준과 작업 트리

- 시작 origin/main 및 Production SHA: `691a4933a69b067169bf52c4feb3a75904bfb4dc`.
- 최초 로컬 브랜치: `codex/hair-profile-flow`, HEAD `a9f0f88d9e9abc2fe9c0e37df00704f5f94a0c2c`.
- 기존 local main `9955aac19eb58b59d6201c7ee960ea24ce55c9e4`에서 최신 origin/main으로 fast-forward. 별도 브랜치/worktree 생성 없음. 기존 미추적 파일 및 다른 worktree 보존.
- 최초 Production: `dpl_35GpKp9B1PLfmKeWVeXEomdNCHBB`, READY.
- 작업 중 재확인한 origin/main도 `691a493`으로 동일.

## 구현

`DesignerPortfolio(designerId) → PortfolioSection → PortfolioCarousel`로 공유합니다. 데이터와 크롭은 `src/lib/prototype/portfolio.ts`, 연속 프레임 계산은 `src/lib/prototype/portfolio-carousel.ts`에 분리했습니다.

윤아는 Figma 920:4815의 17개 슬롯(6/4/7)을 그대로 사용합니다. 소희는 후속 승인에 따라 시술명과 소유 정보가 기존 catalog에서 일치하는 테슬컷(`05be4.png`), 허쉬컷(`deb8c.png`)을 각 대응 슬롯에 사용하고 나머지 슬롯은 Figma 이미지를 재사용합니다. 17개 캡션·순서·Figma 슬롯은 동일하며 빈 섹션이 없습니다. `83c13.png`는 기존 소희 IN FOCUS에서도 사용 중입니다. 인물 프로필 사진 및 시술 정보가 불명확한 이미지로 임의 대체하지 않았습니다.

각 페이지에는 디자이너 이름을 포함한 접근성 제목·캐러셀 레이블이 있습니다. Header는 공통 아이콘과 sticky 정책을 사용하고, 직접 URL로 진입해도 해당 디자이너 상세로 이동하는 링크를 제공합니다. 중앙 타이틀·저장 버튼·캐러셀 화살표·dot·모달은 추가하지 않았습니다.

HOME Magazine 코드는 변경하지 않았습니다. 동일한 단일 requestAnimationFrame 소유자, 520ms cosine easing, 연속 위치/실제 width/height 보간 및 3세트 카드 재활용 원리를 Portfolio 전용 코드에 적용했습니다. HOME 비활성 width 240px은 그대로, Portfolio만 241px입니다. 반응형에서는 카드 프레임만 비례 축소하고 gap 8px은 유지합니다. 카드는 중앙 정렬하며 캡션은 20px, left/bottom 24px로 유지합니다.

터치의 자식 figure → track 포인터 캡처 전환에서 발생하는 bubbling lostpointercapture를 무시하도록 처리했습니다. 실제 track 캡처 손실·취소만 제스처를 취소합니다. 세로 스크롤은 `pan-y pinch-zoom`, 좌우 방향키·스크린리더 상태·Reduced Motion을 지원합니다.

SELECTED WORKS는 세 이미지에 접근성 이름이 있는 링크만 추가했습니다. `display:contents`로 원래 grid의 이미지 치수와 크롭을 그대로 유지합니다. 430px 변경 전후 섹션 스크린샷의 SHA-1이 동일합니다: `a76f10ccfd9825eb846810649327d9fefdcb1645`.

## 수정·생성한 소스

- `src/app/designers/[id]/portfolio/page.tsx` — 두 디자이너만 공통 Portfolio로 연결, 다른 ID의 기존 동작 보존.
- `src/components/prototype/designer-detail.tsx` — 세 이미지 링크 추가.
- `src/components/prototype/designer-detail.module.css` — 링크 래퍼에서도 기존 이미지 배치 유지.
- `src/components/prototype/designer-portfolio.tsx` — 공유 페이지·섹션·Header.
- `src/components/prototype/designer-portfolio.module.css` — Figma 레이아웃 및 반응형 프레임.
- `src/components/prototype/portfolio-carousel.tsx` — 독립 캐러셀 상태와 입력 처리.
- `src/lib/prototype/portfolio.ts` — 디자이너별 작품·캡션·크롭·Figma 노드.
- `src/lib/prototype/portfolio-carousel.ts` — Portfolio geometry.
- `tests/portfolio-carousel.test.mjs` — 루프, 간격, 반응형, 슬롯 데이터 검증.

`details.tsx` 및 Reviews, HOME Magazine 컴포넌트·계산 모듈·공통 CSS는 변경하지 않았습니다.

## 추가 원본 이미지

모두 `public/assets/figma/v1/`에 저장했으며 런타임에 임시 Figma URL을 사용하지 않습니다. 기존 8개 원본은 Figma 다운로드 파일과 바이트 해시가 일치했습니다.

| 파일 | 사용 위치 | Figma 카드 |
|---|---|---|
| b40dd.png | DESIGN CUT 3 | 920:4828 |
| 14959.png | DESIGN CUT 4 (윤아) | 920:4830 |
| 8288b.png | DESIGN CUT 5 | 920:4832 |
| 1440b.png | DESIGN CUT 6 | 920:4834 |
| 79719.png | COLORS 1 | 920:4841 |
| 3f757.png | PERMS 4 | 920:4860 |
| 00c16.png | PERMS 5 | 920:4862 |
| eebc4.png | PERMS 7 | 920:4866 |

Root·Header·각 section/heading/carousel 및 17개 카드 모두 `data-figma-node`를 기록했습니다. 디자이너 ID는 별도 `data-designer-id`로 기록합니다. 각 원본의 실제 크롭, 로컬 이미지 경로, 캡션은 `cards.json`과 `card-contact-sheet.jpg`에 기록했습니다.

## 시각 검증

Figma의 실제 screenshot, 하위 get_design_context와 Plugin API의 Auto Layout/Fill/크롭을 직접 확인했습니다. Figma screenshot은 비교용으로만 사용했습니다.

430px: Header 64px, 섹션 Y=64/681/1317 및 H=565/584/584, gap 52px, heading 44/48px, heading-to-carousel 28px, 활성 335×460px, 비활성 241×330px, gap 8px, 첫 카드 X=24 및 다음 X=367을 확인했습니다. Figma의 outside border는 흐름 높이에 더해지지 않도록 처리했습니다. Portfolio에만 하단 98px 여백을 적용합니다.

최종 AGENTS.md 지시에 따라 자간은 공통 `-0.02em` 규칙을 유지합니다. Figma 제목의 원본 tracking 0과 달리 제목에도 공통 자간을 적용한 점은 의도된 차이입니다. 캡션의 -2%는 원본과 동일합니다.

390/360px: 좌측 24px, heading 44px, 캡션 20px 유지. 카드 크기는 각각 `(viewport - 48)/382` 비율이며 오른쪽 다음 카드가 계속 보이고 페이지 수평 overflow가 없습니다. 전체 스크린샷 `yoona-430/390/360.png`, `sohee-430/390/360.png`를 확인했습니다.

## 검증 범위와 한계

- 단위/로직: `npm test` 전체 59개 통과. 기존 Magazine geometry, 매칭, 저장/노트, 예약, 프로필 마이그레이션, 살롱 관련 테스트 포함.
- `npm run typecheck`, `git diff --check`, `npm run build` 통과.
- 첫 로컬 Turbopack 빌드는 sandbox port-binding 제한으로 실패했습니다. 실패가 저장된 generated cache를 `/private/tmp/hairus-portfolio-build-cache-1017`에 보존한 뒤 정상 환경에서 다시 빌드하여 성공했습니다. 앱 코드를 우회 변경하지 않았습니다.
- 최종 Production 빌드 서버에서 브라우저 체크 258개 통과, 런타임 오류 0개. 양방향 루프, 3개 캐러셀 독립 상태, 연속 크기 보간, 빠른 키보드 입력, Reduced Motion, 430/390/360 실제 터치 입력 및 native 세로 스크롤, 각 4개 진입 링크, 직접 진입 뒤로가기, 두 디자이너 저장/SAVENOTE/해제/Reviews, 지수 상세와 Reviews, HOME Magazine 한 바퀴, Explore/Saved/예약/HAIR NOTE 경로 응답을 확인했습니다.
- 추가 경계 사례: 짧은 드래그 원위치 복귀, touchCancel 복귀, 빠른 3회 터치 큐 처리, sticky Header 고정까지 통과 (`extra-qa.json`).
- 브라우저 검증은 macOS Chrome headless와 CDP 실제 터치 입력을 이용한 모바일 에뮬레이션입니다. 실제 iPhone/Android 기기 및 Safari/Firefox는 검증하지 않았습니다.
- 앱 기능은 기존 데모 데이터 및 로컬 저장소 흐름입니다. 실제 예약·결제·서버 저장을 새로 구현하거나 검증한 것은 아닙니다.
- QA 재현: Playwright가 설치된 환경에서 `BASE_URL=http://localhost:3102 node outputs/portfolio/verify.cjs`. 런타임 패키지가 별도 위치이면 `NODE_PATH`로 지정합니다.

최종 브라우저 결과는 `qa.json`, 전체 테스트 로그는 `tests.txt`, Production 빌드 로그는 `build.txt`를 참조합니다. 최종 GitHub SHA·배포 ID·Production SHA는 배포 확인 보고에서 기록합니다.
