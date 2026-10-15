# 예약 UX 최종 디테일 검수

- 기준: `origin/codex/reservation-ux-refinement` / `9e101e04a1a9b87e40a3129a8a0e90fb421764e0`.
- 최신 통합 `codex/final-integration-1015` / `377e382`는 위 예약 브랜치의 조상임을 fetch와 merge-base로 확인.
- 작업: `codex/reservation-final-polish`, 독립 worktree. 원래 체크아웃의 분석 페이지 미커밋 2개를 보존.
- 변경 코드: `src/components/prototype/booking.tsx`, `booking.module.css`, `my.tsx`의 예약 내역 분기만 수정.
- 검수 자료: `outputs/reservation-final-polish/*`.

## 변경

예약 헤더 MY와 중복 STEP 라벨, DEMO 강조를 제거했다. 완료 문구는 예약 정보 저장 결과로 수정했다. 예약 내역은 같은 헤더의 꺾쇠 아이콘을 재사용하고 작은 중앙 제목 없이 60px Cormorant Garamond 본문 제목을 사용한다. 430px에서는 자연스럽게 두 줄로 표시한다.

내역은 저장 상태, 날짜·시간, 디자이너, 살롱, 시술·가격, 상세 링크를 단일 테두리 카드에 배치한다. 기존 예약 확인·완료 요약 카드는 유지했다.

노트 편집만 내용에 따라 자동 높이를 조정하고 내부 스크롤과 포커스 강조를 완화했다. 자동 생성 노트의 빈 기본 필드는 편집 표시에서 제외하며, 사용자가 입력하기 전까지 저장 원문을 변경하지 않는다. 직접 편집한 기존 노트는 전체 원문을 보존한다. 직접 작성한 노트가 있으면 프로필 초안은 아래에 추가하므로 덮어쓰기 확인이 필요한 동작은 없다.

달력 디자인과 실제 선택 규칙, 시술·시간 칩, 프로필·진행 표시, 읽기 카드, 고정 CTA 위치와 동작은 유지했다. 날짜 안내 문구만 간결하게 변경했다. 저장 스키마·예약 로직·휴무일·localStorage provider는 변경하지 않았다.

## 결과

- `npx pnpm typecheck`: 통과.
- `npx pnpm test`: 35개 통과, 실패 0. 기존 Node 모듈 타입 경고만 있음.
- `npx pnpm build`: 통과.
- 프로덕션 Chrome 430×874: 278 assertions 통과, runtime error 0. `qa.json` 참고.
- 6명 진입·휴무일, 이전 선택·새로고침 복원, 노트 편집·자동 저장·초안 추가 보호, 확인 화면 수정, 예약 저장·MY 상세 이동 검증.
- 기존 예약 1건과 신규 예약을 함께 표시하여 개수·원문 보존 및 단일 카드 확인.
- 한글 Pretendard / 1.3 / -.02em 계산값 검사, 폰트 실제 로드, 430px 예약 내역 및 375/430px 예약 단계 가로 넘침 없음 확인.
- 기존 완료·확인 카드와 고정 CTA를 재디자인하지 않았다.

실제 iPhone/Android 키보드 및 물리 Safe Area는 미검수다. 모바일 Chrome 에뮬레이션으로 검수했다. 실제 예약 확정·결제 API는 추가하지 않았다. 통합 브랜치 병합은 수행하지 않는다.

검수 재실행: `HAIRUS_QA_URL`에 로컬 서버 주소를 설정하고 `node outputs/reservation-final-polish/verify.cjs`. 스크린샷은 같은 폴더에 저장한다. 전체 페이지 캡처는 기존 검수 방식처럼 캡처 시에만 CTA를 페이지 끝에 정렬한다. 실제 고정 CTA 검증과 시간 칩 뷰포트 이미지는 원래 레이아웃을 사용한다.
