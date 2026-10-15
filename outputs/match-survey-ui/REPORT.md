# Meet Your Match UI/UX 정밀 고도화

## 기준 및 격리

- 기준 브랜치: `origin/codex/designer-matching-survey`
- 기준 커밋: `defe1ec` (이전 Airy 통합 c84f314 → Archive 9e188cf/e6bb710 → 설문 defe1ec의 후속)
- 새 브랜치: `codex/match-survey-ui-refinement`
- 새 worktree: `.worktrees/match-survey-ui-refinement`
- 원격 fetch 및 브랜치 이력을 확인했다. 현재 최신 설문 통합본을 기준으로 사용했으며, 별도 진행 중인 디자이너 상세 브랜치 `75a7d38`은 병합하거나 변경하지 않았다. 기존 worktree와 미리보기 서버도 보존했다.
- 새 프로덕션 미리보기: http://localhost:3111/recommendation/intro

## Figma 확인

Figma file: Ja8Ep1JwxOOFgMArfYr16T, page 693:4781.

| 대상 | 노드 |
|---|---|
| Meet Your Match 인트로 | 920:4461 |
| Frame 442 / STEP01 | 920:5297 |
| Frame 422 / STEP02 | 920:4435 |
| Frame 444 / STEP03 | 920:5343 |
| Frame 432 / STEP04 | 920:4883 |
| Frame 433 / STEP05 | 920:4921 |
| STEP01 비활성화(미선택 시각 예시) | 920:5318 |
| STEP03 활성화 예시 | 920:5362 |

get_design_context의 상세 응답과 스크린샷, 읽기 전용 Plugin API로 Auto Layout, itemSpacing, 이미지 source hash, 원본 해상도, scaleMode, imageTransform, saturation, gradient opacity, 텍스트 스타일, CTA 크기를 확인했다. Figma 파일을 수정하지 않았다.

확인값:

- 성별 원형: 173×173, 세로 카드 211px, 사진-라벨 12px, 두 카드 간격 24px. 동일 이미지 hash에서 saturation 0 / -1만 달라진다.
- 강점 카드: 380×145, 20px 간격, 좌우 1px 인셋. 미선택 saturation -1, 선택 0. 오버레이는 미선택 전체 opacity .5 × 검정 alpha .7 = .35, 선택 .3 × .7 = .21. 선택 예시에 추가 stroke가 없어 임의의 선택 테두리를 제거했다.
- 공통: 헤더 64px, 진행 표시 3px, 이후 80px 간격, 질문 y147, 좌우 여백 24px. 강점 이미지 첫 슬롯 x25/y263.
- 일반 CTA: 382×56, y777. STEP03 선택 예시는 y766을 적용한다. 최종 CTA는 원본처럼 검정 배경이다.
- 질문은 Noto Sans KR Bold 24px/34px, 옵션은 Pretendard. 질문용 글꼴은 공식 Google Fonts에서 필요한 문자를 로컬 서브셋으로 저장하고 OFL을 동봉했다. 기존 페이지의 글꼴 설정은 변경하지 않았다.

## 수정 결과

1. **인트로**: 원래 Figma의 머리카락 배경, 에디토리얼 제목, 영문 설명, Glass CTA를 복원했다. 배경은 이미지 노드 단독 export의 정확한 Crop을 사용하며 화면 전체 스크린샷을 제품 배경으로 사용하지 않는다.
2. **STEP01**: 기존 `.image-choices`의 전역 크기/hover 스타일에서 분리했다. 마스크를 flex 축소 없는 173×173px, aspect-ratio 1/1, border-radius 50%, overflow hidden으로 고정했다. img는 100%×100% 및 object-fit cover를 적용한다. 원본 Figma Crop 행렬의 역변환을 object-position과 scale로 표현해 같은 인물·구도를 유지한다. 선택 사진만 컬러, 나머지는 grayscale(1), 미선택도 클릭 가능하다. 이미지 라벨 색은 원본처럼 검정이다.
3. **STEP02**: 기존 지역 옵션/바텀시트 기능 유지. 높이60px, 아이콘24px, 배경/테두리를 유지하고 빈 상태와 선택 상태의 텍스트를 구분한다. 주소검색/백엔드 추가 없음.
4. **STEP03**: 기존 흑백 가공 에셋 대신 Figma의 실제 컬러 원본 566×1008 / 736×1104 / 736×1058을 확보했다. 첫 이미지 Crop은 object-position y56.296363%, 세 번째는 y59.387156%, 가운데 FILL은 cover center. CSS 필터로 미선택 흑백/선택 컬러를 연결하고 선택 시 오버레이를 .35→.21로 낮춘다. hover는 선택 상태/채도를 변경하지 않는다. 키보드 focus-visible만 표시한다.
5. **STEP04**: Figma의 5행 Auto Layout을 반영해 칩 줄바꿈/간격/57px 높이/라운드/패딩을 정리했다. 검정+흰색 선택, 연회색 미선택. 최대3개 규칙과 저장 방식 유지.
6. **STEP05**: 원본6개 카드, 108×154px, 3열2행, 22px 세로 간격과 기존 설명을 보존했다. 실제 선택만 검정/흰색 아이콘으로 표시한다. 기존 ‘특별한 경험 없음’ 보조 선택을 유지하면서 그 선택도 다시 눌러 해제할 수 있게 보완했다. 최종 추천 버튼은 기존 결과 페이지로 연결한다.

Selected / Unselected는 aria-pressed와 실제 React/localStorage 응답에 연결된다. 선택지의 disabled는 저장 상태를 불러오기 전만 적용한다. 선택 개수 한도에 도달해도 다른 옵션을 회색 disabled로 막지 않으며, 기존 안내와 선택 제한을 유지한다. 답이 없으면 CTA는 실제 native disabled이고 흐리게 표시한다. 이 상태는 클릭 가능한 미선택과 구별된다. 별도 애니메이션 추가 없음.

## 변경 파일

제품 코드:

- `src/components/prototype/matching-survey.tsx`
- `src/components/prototype/matching-survey.module.css`

설문 전용 에셋/글꼴(신규):

- `public/assets/figma/match-survey/female.png`
- `public/assets/figma/match-survey/male.png`
- `public/assets/figma/match-survey/experience.png`
- `public/assets/figma/match-survey/consultation.png`
- `public/assets/figma/match-survey/styling.png`
- `public/assets/figma/match-survey/intro.png`
- `public/assets/figma/match-survey/NotoSansKR-Bold.ttf`
- `public/assets/figma/match-survey/NotoSansKR-OFL.txt`

검수 산출물: 이 폴더의 `verify.cjs`, `qa.json`, `compare.py`, Figma 원본 PNG 8개, 구현 PNG 8개, 비교 PNG 8개, `figma-image-properties.json`, 이 보고서.

기존 원본 이미지 파일, HOME, DISCOVER, ARCHIVE, SAVENOTE, ARTICLE, IN FOCUS, 상세페이지, 공용 컴포넌트, 예약 코드, 추천 알고리즘 및 기존 저장 schema는 수정하지 않았다. Golden Path 결과 라우트와 실제 응답 키도 유지한다.

## 검증 결과

- `npx pnpm typecheck`: 통과.
- `npx pnpm build`: Next.js 16.4.0 Turbopack 프로덕션 빌드 통과.
- `npx pnpm test`: 기존 28개 통과, 실패0. 기존 MODULE_TYPELESS_PACKAGE_JSON 경고는 남아 있다.
- Chrome headless / 모바일 터치 에뮬레이션 / 430×874 / DPR1: **57개 검증 통과**, 런타임 오류0. 375px 추가 확인도 포함한다.
- 실제 마스크2개 각각173×173, aspect 1/1, radius50%, overflow hidden, 이미지 CSS173×173 및 cover를 브라우저에서 측정했다.
- 미선택→선택→해제→재선택, 단일 선택 교체, 최대3개, 선택 해제 후 빈 슬롯 재선택, 터치, Space/Enter, 키보드 focus-visible, hover 비선택 유지 검증.
- 지역 선택/닫힘, 필수값 전 native disabled, 단계 이동, 뒤로 이동 후 복원, 새로고침 복원 검증.
- 기존 추천 결과로 이동하고 matching 응답 전체가 동일하게 전달됨을 검증했다.
- 375px/430px STEP01~05 가로 넘침 없음. 두 폭 모두 원형173×173 유지.
- Figma 원본과 구현을 `compare-*.png`로 나란히 만들고 직접 열어 원형 마스킹, Crop, 이미지 색상, 카드/칩 배치와 CTA 위치를 시각 검수했다. 비교 이미지의 Figma 섹션 바깥 40px 캔버스만 제거했다. 제품 원본 사진은 편집하지 않았다.

## 한계 / 남은 문제

요청한 선택 및 원형 마스킹 기능에 미해결 항목 없음. Figma GLASS의 굴절/조명은 브라우저의 backdrop-filter·그라데이션·그림자로 근사하므로 모든 픽셀이 동일하다고 주장하지 않는다. 글꼴의 안티앨리어싱도 Figma 렌더와 Chrome/OS에 따라 소폭 다를 수 있다. 비교 PNG에서 이를 확인할 수 있다.

Figma의 STEP01 비활성 예시는 두 사진 흑백인 시각 상태다. 실제 동작에서는 해당 사진들을 disabled로 막지 않는다. 선택 전 CTA의 native disabled와 흐린 표시는 필수 선택 UX를 구현하기 위한 동작이며 시안의 정적 CTA 렌더와 구별된다.

실물 모바일 기기/iOS Safari 및 전체 신규 예약 완료 플로우는 이번에 검수하지 않았다. 다른 화면 전체를 재검수했다고 보고하지 않는다. 보호 대상 파일의 변경 없음과 기존 자동 테스트 통과를 확인했다.
