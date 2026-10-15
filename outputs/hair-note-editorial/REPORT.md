# HAIR NOTE 에디토리얼 UI 검수

- 기준: `codex/personalized-hair-note` / `9ed51f2125586d25842e789eaea33e23a0ab1f2b`.
- 작업: `codex/hair-note-editorial-refinement`, 별도 worktree.
- 기존 브랜치·worktree·파일 보존. main 및 통합 브랜치 병합 없음.

## 변경 파일과 범위

- `src/components/prototype/booking.tsx`: STEP 03 설명 간결화 및 전용 표시 컴포넌트 연결. 기존 자동 생성·저장·재구성 확인 handler 유지.
- `src/components/prototype/hair-note-editorial.tsx`: STEP 03의 카드·선택·메모·접힌 최종 노트 및 편집 UI.
- `src/components/prototype/hair-note-editorial.module.css`: 전용 스타일. 공용 CSS 변경 없음.
- `outputs/hair-note-editorial/*`: 화면 증거, 브라우저 검수 스크립트와 결과.

## UI

HAIR NOTE 카드가 질문보다 먼저 보인다. 따뜻한 연회색 카드 안에 Cormorant Garamond 36px 제목, 짧은 MY HAIR, 읽기 중심 FOR YOU를 배치했다. MY HAIR는 저장된 effective profile의 기장·컬러·텍스처만 사용하며, 미저장 프로필에서 임의 정보를 만들지 않는다. FOR YOU는 기존 `styleSuggestion()`을 그대로 호출하고 첫 문장과 다음 문장의 정보 위계만 다르게 표시한다. 말줄임은 없다.

질문은 ‘조금 더 알려주세요.’로 낮춰 배치하고 기존 시술별 질문을 유지한다. 미선택 칩은 테두리 없는 연회색, 선택 칩은 검정/흰색이다. 터치 높이 44px. 자유 메모는 약 2줄로 시작하며 내용에 따라 높이가 늘어난다.

최종 노트는 기본 접힘 상태의 ‘디자이너에게 전달할 내용 보기’로 모았다. 펼치면 저장될 원문 전체와 수정 버튼이 나타난다. 프로필 확인·재구성은 그 안의 보조 액션이다. 직접 수정 시 칩과 메모가 잠기는 이유와 안전한 재구성 경로를 안내한다. 재구성의 기존 사용자 확인과 원문 보존을 유지했다.

## 보존

개인화 규칙, `readProfile/effectiveProfile`, `hairNote`, BookingDraft·noteInput 저장 구조, store provider, 기존 예약 레코드를 수정하지 않았다. 질문·메모 change handler와 직접 수정 플래그, 재구성 확인·보존 handler는 기존 동작을 유지한다. 최종 `draft.note`가 확인·완료·MY 상세에 전달된다. STEP 01/02/04, 예약 완료, MY, 헤더·프로필·고정 CTA 스타일은 변경하지 않았다.

## 검증 결과

- `npx pnpm typecheck`: 통과.
- `npx pnpm test`: 38개 통과, 실패 0.
- `npx pnpm build`: 통과.
- Chrome 프로덕션 브라우저 검수: 30 assertions 통과, runtime error 0 (`qa.json`).
- 카드 우선 배치, 대형 YOUR WISH 제거, 추천 전문 표시, 기본 접힘 및 펼치기/접기, 수정 경로 확인.
- 한글 Pretendard / 130% / -2% 실제 계산값, 375/430px 가로 넘침 없음 확인.
- 실제 프로필 수정 화면에서 기장·색상·텍스처 저장 후 노트 반영, 시술별 추천 변경 확인.
- 칩·자유 메모·새로고침 보존, 직접 수정 보호 및 입력 잠금, 재구성 취소/확인, 원문 보존 확인.
- 기존 예약을 먼저 저장소에 두고 신규 저장 후 기존 객체가 그대로 남는지 검증.
- STEP 04·예약 저장·완료·MY 상세의 최종 노트 연결 확인.
- 실제 고정 CTA 상태에서 마지막 콘텐츠가 스크롤로 CTA 위에 나타나는지 검증. CTA 자체 수정 없음.

기존 Node 모듈 타입 경고는 있으며 테스트 실패는 아니다. 실제 iPhone/Android 키보드 및 물리 Safe Area는 미검수다. 프로필에 별도 미저장 변경이 있는 경우 기존과 같이 저장 후 반영된다.

## 스크린샷

- `01-default.png`: STEP 03 기본.
- `02-selected.png`: 칩 선택·메모 입력.
- `03-expanded.png`: 최종 노트 전체 펼침.
- `04-editing.png`: 최종 노트 직접 수정.

전체 페이지 스크린샷은 내용을 한눈에 볼 수 있게 캡처 시에만 CTA를 페이지 끝에 배치한다. 실제 고정 동작 검증은 원래 레이아웃에서 수행한다.

재실행: 전용 프로덕션 서버 `http://127.0.0.1:3077`에서 `node outputs/hair-note-editorial/verify.cjs`. 이전 개인화 노트 검수 스크립트는 이전 UI를 대상으로 하므로 이번 검수는 이 폴더의 결과를 기준으로 한다.
