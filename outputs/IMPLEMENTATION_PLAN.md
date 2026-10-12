# HAIRUS — IMPLEMENTATION PLAN

> 최신 변경(2026-10-12): `1012 코덱스 시연용 920:3429`에 있는 화면은 기존 시연용보다 우선한다. 없는 화면만 기존 시연용 기록을 따른다. 초안은 기능/UX 참고, 95% 영역은 채택하지 않는다. 아래 이전 결정은 역사적 기록이며 이 우선순위가 최신이다. 전체 변경 목록은 [FIGMA_1012_UPDATE.md](FIGMA_1012_UPDATE.md)를 참조한다. PHASE 03 시작 승인, PHASE 04 미착수. 온보딩은 사용자 선택에 따라 시연용 시스템으로 새로 구성한다.

> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.


2026-10-12 · PHASE 01 사용자 검토 반영본. 이번 작업은 조사/문서 작성만 수행했다. Next.js 생성, 페이지 구현, Figma 수정, Vercel 배포는 하지 않았다.

## 핵심 결론

HAIRUS는 일반적인 뷰티 카드 피드보다 세리프 제목·인물/헤어 이미지·긴 여백·흑백 섹션 전환이 중심이다. Home, 스타일 4종, In Focus, 탐색 목록, 카메라 관련 시연 화면을 우선 재현한다. 결과/편집, SAVED, MY, Hair Note, 예약은 초안의 입력과 흐름을 가져와 시연용 디자인 언어로 보완한다.

시연용 47개 화면/섹션/조각과 초안 60개 모바일 프레임의 구조·텍스트를 조사했다. 독립 페이지 수와 다르다. 대표 28개 화면은 스크린샷으로도 검토했으며 상세 범위는 Audit의 V/S/M 표시를 따른다. 원본 이미지 96개는 바이트 접근을 확인했다. 최종 기준은 시연용으로 확정했다. 95% 영역 47개를 대응 시연용과 속성 비교해 45개 동일, 1개 미세 좌표 차이, 1개 홈 변경을 확인했다(픽셀 동일성 검증은 아님). 외부 엔트리 후보와 일부 콘텐츠 데이터만 확인이 남아 있다. 예약 순서는 확정했다.

**폰트는 사용자 확정 3종(Cormorant Garamond / Cormorant / Pretendard)만 사용한다.** Figma의 Noto Sans KR·Inter는 Pretendard로 대체한다.

## 단계별 계획과 완료 기준

| 단계 | 화면/산출물 | 컴포넌트·기능 | 선행 확인 | 완료 기준 |
|---|---|---|---|---|
| 01 Audit & Planning | 요청한 한국어 Markdown 9개 | 화면 상태·UX·자산·상태 모델·검토 질문 | 원본 접근·영역 구분 | 문서 9개 제공, 불확실성 표시, 사용자 검토 대기 |
| 02 Project Setup & Design System | Next.js/TS/Tailwind 구조·토큰·자산 manifest·기본 UI 샘플 | MobileShell, Header, BottomNav, Button, Sheet, Typography, Image | 시연용 기준 확정; 허용 폰트 파일·glass 근사 검증 | 타입/빌드 통과, 세 폰트만 사용, 430px 비교 및 작은 화면 검수 |
| 03 Splash / Onboarding / Login | Splash, 온보딩3, Login, Welcome | progress 저장·데모 인증·진입 resolver | Splash/Intro 분리 확정; 외부 온보딩/Welcome 후보 채택 | 첫 방문·재방문·건너뛰기·실패 경로 작동 |
| 04 Camera / Hair Analysis | Guide, Permission, Camera, Captured, Loading3, Result, Edit | 실제 카메라/파일·mock AnalysisService·profile revision | 건너뛰기·선택 수정 확정; 분석 필드 범위·사진 문구 | 거절/재촬영/수정/새로고침 복구; 원본과 수정 분리·Mock 고지 |
| 05 Home & Entry Banner | Home, 배너2, Popup, In Focus, Magazine/Article4 | 이미지 레일·노출 정책·콘텐츠 detail | 최종 배너/기사01, 이벤트 날짜, 기사02–04 본문 | 실제 섹션 순서·이미지 보존, 배너 정책 경계 테스트, CTA 대상 정확 |
| 06 Explore & Detail Pages | 스타일/디자이너/살롱 탐색, 필터, 이미지검색, 스타일 상세, Designer/Portfolio/Salon | 검색/정렬·필터·상세 template·모의 이미지검색 | 필터 오복사, 나머지 상세 자산, 디자이너-사진 매핑 | 검색/0결과/저장 연결·이미지검색 데모·잘못된 기사 링크 없음 |
| 07 Saved & My | Saved4분류, MY, Profile edit, 설정 | 공통 저장 repository·선택적 이유·프로필/계정 | 기본 4분류 우선; 부가 기능 보류·데이터 보관 정책 | 페이지 간 저장 동기화·재진입 복원·역할 중복 없음 |
| 08 Reservation & AI Hair Note | 매칭5, 결과/근거/비교, 예약5단계+완료, 내역, Note5필드 | Recommendation/Availability/Reservation/Note adapters | 시연용 질문·예약 순서 확정; 선택 개수·메뉴 데이터 | 전체 상담→모의 예약 journey 완주, 이중 제출 방지·snapshot·전송 없음 고지 |
| 09 Interaction Refinement & QA | 전 화면 상태/모바일 QA | reduced motion·접근성·gesture·시각 회귀·오류 복구 | 확정 원본 baseline 및 실제 기기 | 핵심 E2E, 타입/빌드, 시각 검수, 모바일 브라우저 통과; 중요 결함 해소 |
| 10 Vercel Deployment | 테스트용 Vercel Preview 배포 | env 분리·HTTPS·직접 경로·캐시·운영 안내 | 추후 배포 지시·계정·환경 설정 | Vercel 테스트 URL에서 핵심 흐름 완주·HTTPS 카메라·route 새로고침 점검; 실서비스 출시 제외 |

배포는 이번 범위 밖이며 별도 진행 요청 후 수행한다. PHASE 02 시작이 승인되었다. 전체 페이지 구현은 후속 단계이며 PHASE 03은 사용자 검토 후 시작한다.

## 작업 순서와 의존성

처음부터 state/service 인터페이스를 정의하되 실제 화면은 단계 순서대로 구현한다. Saved repository 인터페이스는 PHASE 02에 두어 Home/Detail에서 공용으로 사용하고, Saved 화면은 PHASE 07에 만든다. PHASE 06의 예약 CTA는 PHASE 08 계약을 사용하며 그 전 중간 데모에서는 기능 준비 중임을 표시한다. 필수 흐름이 다 연결되기 전 완성 앱으로 보고하지 않는다.

Result/Edit/Note의 데이터 계약을 04에서 확정해야 07·08의 개인화가 일관된다. CMS/실제 AI/실제 OAuth/실제 예약은 이번 프로토타입 필수 범위가 아니며 adapter 교체 대상으로 남긴다. 네트워크가 없어도 fixture로 필수 여정을 시연할 수 있도록 한다.

## 신규 디자인 보완 순서

1. Result/Edit: 시연용 분석 화면과 연속되는 구성으로 형태·시술·관리 구획, 원본/수정 구분.
2. SAVED/MY: 동일 이미지/서체를 쓰면서 저장 아카이브와 개인 정보 역할 분리.
3. Salon/추가 상세: 기존 Designer/Style 상세의 사진·구분선·타이틀을 재사용하고 데이터만 정확히 연결.
4. Hair Note/Reservation: 파란 초안의 정보를 흑백 편집 레이아웃으로 변환. 원본 단계 모순 해결.
5. 모든 empty/error/permission recovery: 새로운 컬러 체계 없이 기존 UI로 보완.

## 검증 전략

- 토큰/컴포넌트: 실제 asset과 승인 폰트가 로딩된 후 비교. 430px screenshot baseline, crop, 줄바꿈, 여백·높이 확인.
- 의미 있는 로직 테스트: profile override/복원, 배너 자정·세션, Saved 중복, 필터 조합, 예약 종속값 무효화·snapshot·중복 제출.
- 통합: mock adapter 지연·실패·취소·재시도. 실제 모델 없이 실제 결과로 표시하지 않는지 확인.
- E2E: 첫 실행부터 모의 예약 내역까지, 권한 거절 분기, 직접 URL/새로고침/뒤로, 저장소 손상.
- 실제 기기: iOS Safari·Android Chrome의 카메라/파일/키보드/viewport. desktop mouse/keyboard도 기본 조작 가능.
- 성능: 처음 보이는 Hero 우선, 나머지 이미지 지연 로딩·적절한 해상도. 원본 96개를 최초 진입에 모두 로딩하지 않는다.

문서 작업에는 앱 테스트를 실행하지 않았다. 문서 파일 개수·화면/자산 집계·Node ID 연결·폰트 정책을 검증한다. 개발에서 테스트가 통과한 뒤 변경이 없으면 불필요한 반복 실행을 하지 않는다.

## 범위 관리

필수: 네 탭, 첫 분석과 수정, 이미지 탐색, 저장 3엔티티, 상세, 디자이너 연결, Hair Note, 모의 예약.

현재 계획에서 보류: 취향 3질문, 컬렉션, 방문 피드백, 실쿠폰/응모, 실제 인증/AI/예약/지오로케이션, 지도 SDK. 핵심 흐름 완성에 필수인 경우에만 재검토한다. 기본은 데모 인증·모의 AI·모의 예약이며 실제 서비스 출시와 production 운영은 목표가 아니다.

기간/비용은 수치로 확정하지 않는다. 남은 필수 결정은 외부 엔트리 시안, 분석 필드, Home 연결 콘텐츠/자산과 매칭 선택 규칙이다. 해당 단계 전에 해소하며 기초 구조 작업과 관계없는 후속 질문을 전체 개발의 차단 조건으로 삼지 않는다.

## 이번 검토로 고정한 개발 기준

- 첫 여정: Splash → Onboarding 01–03 → Login → Welcome → Photo Guide → Permission → Camera → Captured → Loading 01–03 → Analysis Result → Home. Intro는 별도 역할, 결과 수정은 선택 분기다.
- 분석을 건너뛰면 개인화 결과를 생성하지 않고 Home으로 이동한다. 빈 프로필로도 일반 콘텐츠 탐색·저장·상담 흐름이 가능해야 한다.
- 배너 두 장은 좌우 swipe. Close는 현재 세션, 오늘 숨김은 Asia/Seoul 해당 날짜, 두 장 전체에 적용한다.
- 현재 Home에서 연결되는 In Focus·스타일·기사·Popup·디자이너 상세를 먼저 연결하고, 섹션 구조를 유지한 채 잘못된 링크와 placeholder 문구를 수정한다.
- 매칭은 시연용 흐름 우선. 질문 통합/단계 단축은 후속 검토 기록으로 남기고 즉시 재설계하지 않는다.
- 예약은 시술 → 참고 이미지 → AI Hair Note → 날짜/시간 → 예약 정보 확인 → 모의 완료. 실제 예약·디자이너 전송이 없음을 표시한다.
- 신규 페이지는 기존 이미지·서체·흑백 디자인 패턴으로 설계하며 새 컬러나 디자인 언어를 추가하지 않는다.
- 이번 수정은 계획 동기화만 수행했다. 실제 페이지·프로젝트 설정·배포는 시작하지 않았다.


> 2026-10-12 정밀 재검토 정정: 변경 Home `905:10025`는 배너·캡션 배치뿐 아니라 Hero 이미지 교체와 하단 검정 그라데이션 추가도 확인됐다. 캡션 제목은 Pretendard Medium 16→20px이다. [스크린샷과 상세 비교](FIGMA_DESIGN_COMPARISON.md)를 기준으로 검토하며 최종 선택은 사용자 결정으로 시연용 전체 채택으로 해결됐다. 비교 결과는 이력이며 구현에 혼합하지 않는다.


## 2026-10-12 PHASE 04 반영

PHASE 04 구현 완료, 실기기 카메라 검증 남음. 타입 검사·빌드·자동 테스트12개와 파일/샘플 전체 여정 및 12필드 편집·복원을 확인했다. PHASE 03 온보딩/로그인 및 기존 UI 시트 보존. PHASE 05는 사용자 검토 후 진행한다. 다음 단계로 넘어가기 전에 iOS Safari/Android Chrome의 카메라 허용·거절·촬영·재촬영·전환과 화면 키보드를 확인한다.
