# HAIRUS PHASE 02 결과

2026-10-12. 시연용 전체가 사용자 확정 최종 디자인이며 95% 영역과 혼합하지 않는다. In Focus 캡션은 16px이다. PHASE 01의 관련 문서 9개와 비교 기록에 이를 반영했고 디자인 선택 질문을 해결 처리했다.

## 구현한 기반

- Next.js 16.4.0 / React 19.3.0 / TypeScript 7.0.2 / Tailwind CSS 4.3.3. pnpm lockfile 포함.
- `src/app`: App Router, 한국어 메타데이터, 모바일 viewport, `/ui` 샘플. 네 탭은 준비 상태 화면으로만 구성했다. `/`는 현재 `/ui`로 이동한다.
- `src/components`: Button, Icon, SectionHeading, EditorialCard, BottomNav, BottomSheet.
- `src/lib/routes.ts`: 후속 경로 계약. `src/types/domain.ts`: 분석 원본/수정값 분리, 분석 건너뛰기, 저장 repository, 분석/예약 adapter 인터페이스.
- 모바일 최대 너비 430px, 24px 콘텐츠 여백, safe-area 하단 여백, 키보드 포커스 및 모션 감소 CSS.
- Cormorant Garamond / Cormorant은 Fontsource variable 패키지로 자체 호스팅. Pretendard는 로컬 WOFF2. 세 폰트 모두 라이선스 동봉. Noto Sans KR/Inter 사용 없음.

## Figma 근거와 샘플 범위

| 공통 요소 | 시연용 노드 | 반영 |
|---|---|---|
| In Focus | `876:2656` | 44/48px 영문 제목, 16px 설명·캡션, 14px 영문 캡션, 382×466 사진, 28/16px 간격 |
| Next glass 버튼 | `814:1799` | 56px 높이, 사각 형태, 반투명 테두리/배경 |
| BottomNav | `876:2762` | 398×64 기준, 원본 SVG, 4탭, 활성 표시, 하단 safe-area |
| Permission sheet | `889:4234` | 상단 radius16, handle52×4, 28px 제목, 공통 시트 동작. 권한 화면 전체 복제는 후속 단계 |

Figma의 광학 유리 효과는 브라우저 blur/투명도/그림자로 근사했다. 실제 권한 요청, AI 분석, 로그인, 예약, 전체 Home은 이번 단계에 포함하지 않았다. 샘플 저장은 메모리 상태만 사용하며 영속 저장 adapter 구현은 후속 단계다. 시트 문구는 권한·개인정보 안내가 아닌 동작 확인용이다.

## 자산

실제 Figma 사진 1개와 원본 SVG 5개를 `public/assets/figma`에 저장했다. `manifest.json`에 source node/local path를 기록하고, `observed-image-placements.json`에는 PHASE 01에서 확인한 **237개 이미지 배치**의 hash·crop·filter·크기를 보존했다. 전체 96개 원본 이미지 다운로드를 완료했다는 뜻은 아니다. 추가 화면 구현 시 해당 원본을 확보한다. 스톡 이미지 대체는 없다.

## 실행

프로젝트 루트에서 `pnpm install --frozen-lockfile`, `pnpm dev` 순서로 실행한 뒤 `http://localhost:3000/ui`를 연다. `pnpm typecheck`, `pnpm build`로 검증할 수 있다. Vercel에는 일반 Next.js 프로젝트로 연결할 수 있지만 이번 단계에서 배포하지 않았다.

## 검증

- 타입 검사 통과.
- 프로덕션 빌드 통과. `/ui`와 네 탭 기반 경로가 정적 생성됨.
- 실제 브라우저: 430px에서 사진 382×466, 캡션16px, 폰트 로드 상태 확인.
- 320px에서 수평 overflow 없음 확인.
- 저장 버튼 선택 상태와 안내, 바텀시트 열기/Escape 닫기/호출 버튼으로 포커스 복원 확인.
- 헤드리스 자동 테스트는 로컬 브라우저 실행 제한으로 수행하지 못했다. 대신 연결된 브라우저로 검증했다. 실제 iOS/Android 기기, 광학 유리 효과, 모든 반응형 너비에 대한 검증은 후속 QA에 남는다.

## 다음 단계

PHASE 03은 사용자 검토 후 Splash/Onboarding/Login/Welcome을 연결한다. 시연용에 없는 화면은 같은 디자인 시스템으로 설계한다. 전체 서비스 구현으로 확대하지 않으며 이후 분석→Home→탐색/상세→저장/MY→모의 예약 순서로 진행한다.

남은 사용자 결정은 분석 편집 필드(Q05), 매칭 선택 규칙(Q07), 기사 본문(Q09), 팝업 날짜(Q10), 디자이너/살롱 누락 데이터 정책(Q15/Q16)이다. 시연용 내부의 실제 중복 차이가 확인될 경우에만 Q03을 제시한다. 시연용과 95% 영역 중 선택은 다시 요청하지 않는다.
