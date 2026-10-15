# 아르보 성수 구현 및 검수

작업일: 2026-10-15 (Asia/Seoul)

## Git 기준

- 원격 fetch 후 브랜치와 커밋 일시, 통합 merge 이력을 확인했다.
- 기준: `origin/codex/final-integration-1015`
- 기준 SHA: `f2449b965757ae849de8362bdcf6843f291eee14`
- 작업 브랜치: `codex/salon-details-arvo-refinement`
- 별도 worktree: `.worktrees/salon-details-arvo-refinement`
- 기존 브랜치와 worktree, 미커밋 변경을 수정하지 않았다.

## Figma 비교

- 파일: [HAIRUS 작업 캔버스](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=693-4781)
- 구현 기준 `salonDetails`: `929:3554`, 430 × 3803. 첨부 첫 이미지와 구조·크기가 일치한다. 이전 430 × 3497 시안 `929:2868`은 사용하지 않았다.
- 구현 기준 `designersArvo`: `929:3947`, 430 × 1060. 첨부 두 번째 이미지와 그룹·배치가 일치한다.
- 각 하위 프레임의 고해상도 디자인 컨텍스트와 스크린샷을 확인했다.
- 히어로 430 × 338, 48px 탭, 매장 기본 정보, NOTICE, 가격표, 대표 디자이너 두 명, 내부 사진 구성과 크롭을 적용했다.
- Cormorant Garamond, Pretendard를 기존 프로젝트에서 재사용했다. 이름·그룹 제목에 쓰인 Noto Sans KR 500/700은 해당 문구의 경량 로컬 폰트로 추가했다. 다른 페이지에는 적용하지 않았다.
- 목록은 실제 표시된 여섯 명에 맞춰 7명 표기를 6명으로 수정했다. 마지막 중복 이름은 기존 ID `jonghun`에 맞게 종훈으로 표시했다. 윤아의 OFF 표기는 명시된 화·금 기준으로 수정했다.
- REVIEWS는 요청대로 최신 디자이너 상세 디자인을 그대로 공용화했다. 따라서 구형 Figma 리뷰와 전체 페이지 높이는 다르다. 살롱 통계가 실제 자료로 오해되지 않도록 데모 안내를 추가했다.
- INFORMATION은 원본 사진과 순서를 보존하고, SNS의 준비 중 상태와 46px 행을 적용했다.
- `salon.png`, `team.png`, `notice-expanded.png`, `salon-reviews.png`가 실제 프로덕션 430px 검수 캡처다. Figma 전체 화면과 픽셀 단위 동일성을 주장하지 않는다.

## 자산 출처

임시 Figma URL을 런타임에서 사용하지 않는다. 이미지 생성·대체·화질 축소를 하지 않았다.

| Figma 노드 | 로컬 파일 | 용도 |
| --- | --- | --- |
| `929:3559`, `929:3744` | 기존 `public/assets/figma/v1/4e00b.png` | 매장 히어로·내부 대표 사진 |
| `929:3746` | `public/assets/figma/salon-arvo/0ff44.png` | 샴푸 공간 |
| `929:3747` | `public/assets/figma/salon-arvo/147b8.png` | 라운지 공간 |
| `929:3748` | `public/assets/figma/salon-arvo/1b825.png` | 창가 시술 공간 |
| `929:3857` 하위 카드 | 기존 `31628`, `a91f5`, `63467`, `c451a`, `3a62b`, `92e32` PNG | 윤아·소희·하나·소율·경현·종훈 |
| `945:9574` | `arvo-logo.png` | 로고 노드 원본 export |
| `945:9569` | `download.svg` | 혜택 아이콘 |
| `929:3706` | `arrow-right.svg` | 전체 디자이너 이동 |
| `929:3752`, `929:3755` | `kakao.svg`, `naver.svg` | SNS 아이콘 |
| `929:3832` | `instagram.png` | 색상·마스크가 합성된 아이콘 노드 export |

추가 자산은 `public/assets/figma/salon-arvo/`에 있다. 내부 사진의 실제 원본 해상도·렌더링 크기는 `qa.json`의 `metrics.interior`에서 확인할 수 있다. 모든 사진은 표시 크기보다 충분한 원본 해상도를 확인했다.

Noto Sans KR는 [Google Fonts 원본](https://github.com/google/fonts/tree/main/ofl/notosanskr)과 Google Fonts의 text subset 응답을 사용했다. 라이선스를 `public/fonts/NotoSansKR-LICENSE.txt`에 포함했다.

## 기능 검수

- `position: sticky; top: 0`을 사용한다. 기존 헤더는 고정 헤더가 아니므로 탭은 뷰포트 최상단에 고정된다.
- 다섯 탭 클릭: 부드러운 이동, 64px 오프셋, 제목 노출, 활성 밑줄, 수동 스크롤 동기화, 최상단 복귀를 확인했다. 모션 감소 설정에서는 즉시 이동한다.
- `history.replaceState`에 Next의 기존 history state를 유지한다. 목록·후기에서 브라우저 뒤로 가기를 검증했다.
- NOTICE는 지정 순서의 여섯 휴무일을 펼치고 접는다.
- 휴무일은 `src/lib/prototype/arvo.ts` 한 곳에서 공지와 예약이 참조한다. 14일 후보 중 각 디자이너의 주 2회 휴무일을 제외한 10일만 표시한다.
- 저장된 초안이 휴무일과 충돌하면 날짜·시간만 해제한다. 시술·편집된 노트·기존 완료 예약·SAVENOTE는 보존한다. 최종 제출 검증에서도 휴무일을 거절한다.
- 여섯 예약 버튼은 기존 `/reservation/{designerId}/service`로 연결한다. 윤아의 일정 재선택 → 편집 노트 보존 → 데모 예약 완료까지 확인했다.
- 매장 예약 CTA는 디자이너 선택 목록으로 이동한다. 목록 하단 CTA는 첫 예약 선택 위치로 이동하고 포커스를 제공한다. CTA는 Figma처럼 문서 하단에 배치하며 Safe Area를 반영했다.
- SNS 세 항목은 disabled button이며 외부 URL이 없다.
- 매장 저장은 기존 SAVENOTE를 사용하며 새로고침 후 메모 유지까지 확인했다.

## REVIEWS 회귀 검증

- 공용 `ReviewSection`에 데이터만 전달한다. 원래 막대그래프·타이틀·별점·카드·구분선·여백·모든 후기 보기를 유지한다. 원래 그래프에 추가 애니메이션은 없으며 새 애니메이션을 만들지 않았다.
- 살롱은 청결·공간·직원 응대·방문 안내의 네 장점과 요청된 두 방문 리뷰를 사용한다.
- 실제 살롱 리뷰 API가 없어 평점·분포·비율·개수·리뷰 모두 프로토타입 예시임을 화면에 명시했다. 디자이너의 개인 통계를 실제 매장 통계로 표시하지 않는다.
- 윤아·소희의 원래 개인 리뷰 문구, 개수 623/513, 개인 장점이 그대로 유지된다.
- 두 디자이너의 변경 전후 REVIEWS는 각각 430 × 810이다. 개발 전용 Next 표시 영역(x 0–77, y 726–810)을 제외한 이미지 픽셀 차이는 0이다. `review-regression.json`에 기록했다.
- 살롱·디자이너의 주요 요소 computed style이 동일함을 검사했다. 글자 수에 따른 리뷰 카드 높이와 살롱 데모 안내 높이는 다르다.
- 디자이너의 스티키 탭, 제목 오프셋, 스크롤 활성 상태와 기존 모든 후기 경로도 확인했다.

## 실행 결과

- TypeScript: `tsc --noEmit` 통과.
- 단위 테스트: `node --test tests/*.test.mjs`, 31개 통과.
- Production Build: `next build --webpack` 통과, 정적 페이지 26개 생성. 최초 샌드박스의 파일 생성 권한 오류 후 권한이 허용된 실행에서 완료했다.
- 실제 프로덕션 서버(`next start`)에서 `work/qa-salon-arvo.cjs`: **106개 검수 통과**, 브라우저 런타임 오류 0개.
- 430 × 932 브라우저 기준. 320/375px에서 두 화면의 가로 넘침도 확인했다.
- HOME, DISCOVER(`/explore`), ARCHIVE(`/saved`), ARTICLE, IN FOCUS, Airy Layered, Meet Your Match 경로는 HTTP 200과 main 렌더링을 확인했다. 해당 페이지 전체의 픽셀 비교를 수행했다고 주장하지 않는다.
- `git diff --check` 통과.
- 브라우저 실행 방법: 설치된 Playwright 모듈 경로를 `PLAYWRIGHT_MODULE`, 서버 주소를 `QA_BASE_URL` 환경 변수로 지정하고 `node work/qa-salon-arvo.cjs` 실행.

## 수정 파일

- `src/app/salons/[id]/page.tsx`
- `src/app/salons/[id]/designers/page.tsx`
- `src/app/salons/[id]/reviews/page.tsx`
- `src/components/prototype/salon-detail.tsx`
- `src/components/prototype/salon-detail.module.css`
- `src/components/prototype/reviews.tsx`
- `src/components/prototype/reviews.module.css`
- `src/components/prototype/designer-detail.tsx`
- `src/components/prototype/designer-detail.module.css`
- `src/components/prototype/booking.tsx`
- `src/lib/prototype/arvo.ts`
- `src/lib/prototype/reviews.ts`
- `src/lib/prototype/logic.ts`
- `tests/prototype.test.mjs`
- `tests/salon-arvo.test.mjs`
- `work/qa-salon-arvo.cjs`
- `public/assets/figma/salon-arvo/` 원본 사진·아이콘 9개
- `public/fonts/NotoSansKR-*` 폰트 2개·라이선스 1개
- `outputs/salon-arvo/` 검수 캡처·JSON·본 보고서

## 남은 제한

실제 예약·쿠폰 발급·매장 리뷰 API와 SNS URL은 제공되지 않은 기존 프로토타입 범위다. SNS는 의도적으로 비활성 상태다. 전체 후기 화면에는 준비된 살롱 데모 리뷰 두 개를 표시한다. 실제 iOS/Android 기기에서의 검수는 수행하지 않았다.
