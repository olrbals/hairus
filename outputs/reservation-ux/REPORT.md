# HAIRUS 예약 UX 개선 검수 보고서

작업일: 2026-10-15 (Asia/Seoul)

## Git 기준과 변경 범위

- GitHub 원격을 작업 전과 커밋 전에 fetch해 최신 통합 브랜치를 확인했다.
- 기준: `origin/codex/final-integration-1015`, `377e38209049a8374f30e5e0d729824de1066c4c`.
- 작업 브랜치: `codex/reservation-ux-refinement`.
- 독립 worktree: `C:/Users/EZEN/Desktop/hairus/.worktrees/reservation-ux-refinement`.
- 최종 커밋 SHA와 push 결과는 전달 메시지에 기록한다. 통합 브랜치에 병합하지 않는다.
- 기존 체크아웃 `codex/home-visual`과 다른 worktree, 미커밋 파일을 변경하거나 삭제하지 않았다.
- 작업 중 갱신된 `codex/hair-profile-flow`는 `src/styles/analysis.css`만 변경했다. 이번 변경과 직접 겹치는 파일은 없다.

## 변경 파일

| 파일 | 역할 |
| --- | --- |
| `src/components/prototype/booking.tsx` | 예약 4단계, 요약 및 완료 화면 |
| `src/components/prototype/booking.module.css` | 예약에 한정된 스타일 및 모바일 대응 |
| `src/lib/prototype/booking-presentation.ts` | 노트 읽기 표시, 달력 셀, 선택 보존 함수 |
| `src/app/reservation/[designerId]/[step]/page.tsx` | 수정 완료 후 확인 화면으로 돌아오는 query 전달 |
| `tests/booking-ux.test.mjs` | 예약 상태·노트 원문·달력 경계 회귀 테스트 4개 |
| `outputs/reservation-ux/*` | 검수 스크립트, 430px 스크린샷, 비교 이미지, 결과 및 보고서 |

HOME, 디자이너 상세·목록, 살롱 페이지, 공용 global CSS는 수정하지 않았다. 기존 MY 예약 내역은 그대로 두고 예약 요약 컴포넌트의 개선된 표시를 재사용한다.

## 화면별 개선

| 화면 | 개선 |
| --- | --- |
| 공통 | 64px 헤더, 24px 좌우 여백, 4단계 진행 표시, 54px 고정 CTA, Safe Area 여백 |
| 시술 | 설명 문장 제거. 기존 이름·가격·소요 시간만 표시. 단일 선택, 검정 테두리와 체크, 미선택 CTA 비활성화 |
| 날짜·시간 | 월·요일 달력, 선택 날짜 강조, 이전/다음 달 이동, 정기 휴무·기간 밖·과거 날짜 비활성화, 기존 시간 칩 유지 |
| HAIR NOTE | 읽기 카드와 상단 수정 버튼. 비어 있는 기본 항목은 숨기고 입력한 정보 우선 표시. textarea 편집 시 즉시 기존 저장소에 보존 |
| 확인 | 디자이너·살롱, 시술, 일정, 금액, 결제 순서로 정돈. 항목 곁 수정 링크. 노트는 3줄 미리보기와 전체 보기. `데모 예약 저장하기` CTA |
| 완료 | 체크 아이콘, DEMO COMPLETE, 지정 완료 문구, 요약과 방문 안내, MY/홈 연결, 노트 기본 접힘 |
| 시작 목록 | 기존 6명 순서·이미지·레이아웃 보존. 개별 예약 버튼의 designerId 전달 및 상세페이지 링크 확인 |

## 보존한 데이터와 규칙

`BookingDraft`, `Booking`, 저장소 키 `hairus.prototype.v1`, 저장소 version 1, 기존 `PrototypeProvider`, `hairNote`, `demoDates`, `demoTimes`, `completeBooking`을 변경하지 않았다. 데이터 마이그레이션이나 삭제는 없다.

기존의 내일부터 14일 예약 기간과 6개 시간 슬롯을 유지한다. 휴무일은 `arvo.ts` 한 곳을 그대로 참조한다: 소율 화·토, 소희 월·목, 하나 수·목, 경현 화·일, 윤아 화·금, 종훈 월·수.

직접 수정한 노트는 시술 변경·일정 변경·이전 단계·새로고침·최종 저장 후에도 원문을 보존한다. 날짜를 실제로 바꾸면 시간만 초기화하고, 같은 날짜를 다시 누르면 시간을 유지한다. 수정하지 않은 자동 초안은 시술을 바꾸었을 때만 재생성한다. 확인 화면에서 바로 시술을 수정한 경우에도 변경된 시술로 초안을 생성한다.

읽기 화면의 빈 기본 항목 숨김은 표시 처리이며 저장 문자열을 변경하지 않는다. 수정 화면에서는 원문 전체를 편집할 수 있다. 기존 예약 1건을 먼저 저장소에 둔 브라우저 검수에서 새 예약 저장 후 기존 객체가 그대로 남는 것을 확인했다. 취향과 알림 설정도 보존했다.

## 검사 결과

| 검사 | 결과 |
| --- | --- |
| `npx pnpm typecheck` | 통과 |
| `npx pnpm build` | 통과, 최종 UI 변경 포함 |
| `npx pnpm test` | 35개 통과, 실패 0 (기존 31 + 추가 4) |
| 프로덕션 Chrome 검수 | 261개 assertion 통과, pageerror 0 |
| 430 × 874 모바일 | 시술·달력·시간·노트 읽기/수정·확인·완료·MY 검수 |
| 375px 보조 검수 | 예약 4단계 가로 넘침 없음 |
| Pretendard | font face `loaded`, WOFF2 HTTP 성공, 한글 요소의 실제 font-family/line-height/letter-spacing 검사 통과 |
| 고정 CTA | 높이 54px, x=24px, 폭 382px. 끝까지 스크롤하면 마지막 내용이 CTA 위에 나타남 |

브라우저 검수는 개인 Chrome 프로필을 사용하지 않는 격리 context에서 수행했다. 6명 진입, 휴무일과 14일 범위, 날짜/시간 필수 조건, 선택 복원, 노트 직접 수정과 새로고침, 시술/일정/노트 수정 후 확인 복귀, 원문 저장, 중복 저장 방지, MY 상세 연결, 월말 다음 달 선택과 선택 월 복원을 포함한다. 월 경계 검수는 브라우저 시간을 2026-10-26으로 고정했다.

테스트 실행 중 Node의 기존 `MODULE_TYPELESS_PACKAGE_JSON` 경고가 출력된다. 테스트 실패는 아니다. 불필요한 공용 package 설정 변경은 하지 않았다.

## 화면 증거와 재실행

- [시술 전후 비교](comparison-service.png)
- [달력 전후 비교](comparison-schedule.png)
- [HAIR NOTE 전후 비교](comparison-note.png)
- [예약 확인 전후 비교](comparison-review.png)
- [예약 완료 전후 비교](comparison-complete.png)
- [시간 칩과 실제 고정 CTA 뷰포트](after-time-slots.png)
- [노트 편집](after-note-editor.png)
- [다음 달 달력](after-calendar-boundary.png)
- [MY 예약 내역](after-my-reservations.png)
- [261개 검수 결과](qa.json)

`before-*.png`는 기준 커밋의 변경 전 화면이다. `after-*.png` 전체 페이지 이미지는 긴 내용을 한눈에 비교하도록 캡처 시에만 고정 CTA를 페이지 끝에 배치했다. 실제 화면은 고정 CTA이며, 겹침·스크롤 assertions와 `after-time-slots.png`는 원래 고정 레이아웃으로 검수했다. 변경 전과 후 노트의 취향 입력 여부는 다르므로 해당 이미지는 레이아웃 비교용이다.

재실행: `HAIRUS_QA_URL` 환경변수에 로컬 서버 주소를 지정하고 `node outputs/reservation-ux/verify.cjs` 실행. Playwright 경로는 `HAIRUS_PLAYWRIGHT`로 변경할 수 있다. 이미지 비교 생성은 Pillow가 있는 Python으로 `outputs/reservation-ux/make-comparisons.py`를 실행한다. `capture-before.cjs`는 기준 커밋에서만 실행하는 변경 전 기록 스크립트다.

## 남은 검수 범위와 통합 주의

- 실제 iPhone/Android 기기 및 가상 키보드·물리 Safe Area는 직접 검수하지 않았다. 모바일 Chrome 에뮬레이션과 CSS Safe Area 대응을 확인했다.
- 실시간 예약·결제·AI API는 기존과 같이 없다.
- 현 저장소의 단일 draft 구조를 유지한다. 다른 디자이너로 새 예약을 시작하면 해당 디자이너의 새 draft가 만들어지는 기존 동작이다.
- 통합 시 `booking.tsx`와 예약 route query 전달 변경을 함께 반영한다. 휴무일 데이터는 계속 `arvo.ts` 한 곳에서 관리해야 한다.
- 프로필 후속 작업은 기존 `readProfile/effectiveProfile`과 규칙 기반 `hairNote`의 연결을 유지하면 이번 UI와 연동된다.
- 통합 브랜치 자동 병합은 수행하지 않는다.
