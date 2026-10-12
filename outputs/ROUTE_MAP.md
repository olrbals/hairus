# HAIRUS — ROUTE MAP

> 최신 변경(2026-10-12): `1012 코덱스 시연용 920:3429`에 있는 화면은 기존 시연용보다 우선한다. 없는 화면만 기존 시연용 기록을 따른다. 초안은 기능/UX 참고, 95% 영역은 채택하지 않는다. 아래 이전 결정은 역사적 기록이며 이 우선순위가 최신이다. 전체 변경 목록은 [FIGMA_1012_UPDATE.md](FIGMA_1012_UPDATE.md)를 참조한다. PHASE 03 시작 승인, PHASE 04 미착수. 온보딩은 사용자 선택에 따라 시연용 시스템으로 새로 구성한다.

> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.


PHASE 01 전체 라우팅 계획. PHASE 02에서는 `/ui` 샘플과 `/home /explore /saved /my` 기반 경로만 생성했다. 현재 `/`는 `/ui`로 이동하며 아래 첫 실행 resolver는 PHASE 03 이후 구현한다. `(entry)`, `(main)` 같은 route group은 URL에 노출하지 않는 코드 구조다. Node ID는 FIGMA_SCREEN_AUDIT의 원본과 연결된다.

모든 경로의 공통 폰트 정책은 Cormorant Garamond / Cormorant / Pretendard 세 가지로 제한한다.

| URL | 화면/주요 노드 | 진입 → 다음 | 상태/가드 |
|---|---|---|---|
| `/` | 진입 resolver/Splash; 전용 시안 미확인 | 첫 실행→onboarding, 완료→home | 저장 복원 전 오표시 방지 |
| `/onboarding/[step]` | 1–3; `699:5722 / 5732 / 5743` 후보 | 다음/건너뛰기→login | step 검증, 마지막 단계 보관 |
| `/login` | `887:3809` | welcome | 데모 로그인 표기; 실제 인증 분리 |
| `/welcome` | `699:5789` 후보 | analysis/guide | 이름 없으면 중립 인사 |
| `/analysis/guide` | `889:4219` | camera 또는 미분석 home | intent=initial/reanalyze |
| `/analysis/camera` | `736:3951` + permission sheet `889:4234` | captured | 권한·기기·스트림 상태 |
| `/analysis/captured` | `887:4021` | processing 또는 camera | 메모리 사진 없으면 guide |
| `/analysis/processing` | `887:3876 / 3899 / 3919` | result | 하나의 작업 안에서 3상태; 3 URL 아님 |
| `/analysis/result` | 초안 `905:15091` | edit 또는 home | 분석 run 필요; 없으면 guide |
| `/analysis/edit` | U08 5개 상태 | result 또는 home | 임시 patch; 저장 전 원본 불변 |
| `/home` | `876:2654` + entry banner | 아래 콘텐츠 | 첫 진입/세션/하루 숨김 조건 |
| `/explore?type=styles` | `889:7251` | styles/[id] | q,length 등 필터 query |
| `/explore?type=designers` | `889:7597` | designers/[id] | q,region,sort |
| `/explore?type=salons` | `899:8165` | salons/[id] | 살롱 카드의 기사 링크 교정 |
| `/explore/image` | 초안 `905:15654` | features/results | 사용자 파일 메모리 보관 |
| `/explore/image/features` | 초안 `905:14539` | results | Mock 특징 수정; 검색 세션 필요 |
| `/explore/image/results` | 초안 `905:14562` | style/designer | 세션 없으면 업로드 복구 |
| `/styles/[styleId]` | `751:4689`, `814:2742 / 2966 / 2854` | related / saved / matching | 없는 ID는 404; 임의 상세 복제 금지 |
| `/editorials/soft-bob` | `876:2845` | 소희 상세 | 일반 스타일 상세와 다른 특집 구조 |
| `/magazine` | `814:1743` | articles/[slug] | 기사 4개 |
| `/articles/[slug]` | `814:2304 / 1679 / 2389 / 2476` 후보 | 이전 화면 | article01 후보 확정·본문 교정 |
| `/popups/[slug]` | `814:1535` | 쿠폰/응모 안내 | 실제 운영 CTA 여부 확인 |
| `/designers/[designerId]` | `905:11000` | portfolio/salon/reservation | 윤아를 다른 인물로 잘못 연결 금지 |
| `/designers/[designerId]/portfolio` | `905:11189` 후보 | 작업 viewer | CUT/COLORS/PERMS |
| `/salons/[salonId]` | 초안 `905:16132` | designers / 예약 | 새 디자인 필요 |
| `/salons/[salonId]/designers` | 초안 `905:16183` | designer | 살롱 종속 목록 |
| `/saved?type=all` | 초안 `905:15500` 재설계 | 저장 대상 상세 | all/styles/designers/salons 고정 |
| `/my` | 초안 `905:15671` | profile/reservations/settings | 개인 정보·예약 중심 |
| `/my/hair-profile` | 초안 `905:14575` | edit / 재분석 | confirmed effectiveProfile 표시 |
| `/my/hair-profile/edit` | 분석 편집 UI 재사용 | my/hair-profile | result 생성과 무관한 직접 편집 지원 |
| `/my/reservations` | 새 화면 | reservations/[id] | 모의 내역만 표시 |
| `/my/settings` | 새 화면 | my/login | 데모 로그아웃·로컬 데이터 초기화 |
| `/matching/[step]` | 시연용 01–05 | processing | 값·선택 제한 확인 후 저장 |
| `/matching/processing` | 초안 `905:15938` | results | 추천 모의 처리 |
| `/matching/results` | 초안 `905:15972` | designer/reason | 근거 없는 AI 점수 금지 |
| `/matching/reasons/[designerId]` | 초안 `905:16068` | compare/detail | 현재 추천 세션 근거 |
| `/matching/compare/[designerId]` | 초안 `905:16101` | reservation | 참조사진 없음 상태 |
| `/reservation/new?designerId=…` | 진입 resolver | draft의 service | 유효 디자이너 필요 |
| `/reservation/[draftId]/[step]` | service/reference/note/datetime/review | 다음/이전/완료 | 선행 단계 검사, 편집 복귀 지원 |
| `/reservations/[reservationId]/complete` | 초안 `905:16436` 재문구화 | my/reservations | 제출 결과 없으면 접근 복구 |
| `/reservations/[reservationId]` | 새 화면 | 수정/모의 취소 | snapshot 읽기 |
| `/hair-notes/[noteId]` | 초안 `905:16239` 재설계 | 편집/예약 복귀 | 공유 문서 URL 아님; 로컬 ID |

## 선택 확장 경로

취향 질문 `/preferences/[step]`, 컬렉션 `/saved/collections/[id]`, 방문 피드백 `/my/visits/[id]/feedback`는 초안 근거만으로 구현하지 않으며 현재 계획에서 보류한다. 기본 4탭/필수 여정을 완성한 뒤 필요한 경우만 재검토한다. Intro는 Splash와 역할을 분리하며 확정 첫 여정에 삽입하지 않는다. 별도 Intro 진입은 Q02 후속 범위다. 약관 본문·휴대폰 OTP는 실제 인증을 추가하기 전의 후속 항목이다.

## URL로 만들지 않는 상태

Entry Banner, 권한 설명, 검색 필터, 저장 이유는 원 페이지 위의 overlay 상태다. 닫기/뒤로 시 페이지 자체가 사라지지 않게 한다. 이미지 viewer는 선택 index를 UI 상태 또는 query로 관리한다. 새 라우트가 필요한 공유/복원 요구가 생기면 별도로 검토한다. 로딩 3단계와 기장 5가지 선택 상태를 별도 페이지로 복제하지 않는다. 분석 결과 수정은 선택 분기다.

메인 탭은 `/home /explore /saved /my` 네 개다. 상세 뒤로 이동 시 진입 탭·검색어·필터·스크롤을 복원한다. 직접 URL 진입으로 이전 히스토리가 없으면 내용에 맞는 기본 목록으로 돌아간다. 개인정보·사진·Hair Note 본문은 query에 넣지 않는다. `returnTo`는 허용된 내부 경로만 사용한다.

프로토타입 client guard는 상태 복구용이며 보안 인증이 아니다. 실제 서버 도입 시 권한과 데이터 소유권은 서버에서 검증한다.

## 현재 실행 경로 (PHASE 03)

`/`는 Splash → 저장된 온보딩 단계 / Login / Welcome으로 이동한다. `/ui` 샘플은 유지. `/onboarding/[step]`는 1~3만 허용. `/login`, `/welcome` 구현. `/home /explore /saved /my`는 PHASE02 기반 화면이며 본문 구현 전이다. Permission·PhotoGuide 이후는 미구현이다.


## 2026-10-12 PHASE 04 반영

PHASE 04 실구현: `/analysis/guide`, `/analysis/camera`, `/analysis/captured`, `/analysis/processing`, `/analysis/result`. `/analysis/edit` → result 리다이렉트. Permission은 Guide에서 열린 시트, 각 수정 UI는 Result의 modal state다. Home은 기존 기반 화면이며 결과 재진입 링크만 추가했다. 이전 계획 중 PHASE 04 미구현 표시는 이 기록으로 갱신한다.
