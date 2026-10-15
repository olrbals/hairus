# 아르보 성수 통합 검수

2026-10-15 (Asia/Seoul)

- 대상: `codex/final-integration-1015`
- 기존 통합 SHA: `f2449b965757ae849de8362bdcf6843f291eee14`
- 통합한 브랜치: `codex/salon-details-arvo-refinement`
- 작업 SHA: `3330f5359aa2746aa362c0388ca5185485214b06`
- 원격을 갱신하고 최신 통합 브랜치 및 clean worktree를 확인했다.
- `git merge --no-ff --no-commit`으로 병합했으며 충돌은 없었다.
- 구현 파일(`src`, `public`, `tests`, `work`)은 검수된 작업 브랜치와 동일하다.
- main, 기존 개별 작업 브랜치, 다른 worktree를 변경하지 않았다.

## 검증

- 통합 worktree의 `node_modules`에 설치된 실행 파일을 사용했다.
- `node node_modules/typescript/bin/tsc --noEmit`: 통과.
- `node --test tests/*.test.mjs`: 31개 통과.
- `node node_modules/next/dist/bin/next build --webpack`: 통과, 정적 페이지 26개 생성.
- 최초 상위 폴더 Next 실행 파일로 빌드했을 때 이중 React 로드에 따른 오류가 발생했다. 통합 worktree 자체의 Next 실행 파일로 재실행하여 해결했다. 앱 코드는 수정하지 않았다.
- 실제 통합 프로덕션 서버 `http://127.0.0.1:3018`에서 `qa-salon-arvo.cjs`를 실행했다. 원본 작업의 검수 결과를 보존하기 위해 출력 경로만 본 폴더로 변경했다.
- 430 × 932 브라우저 기준 **106개 검수 통과**, 브라우저 런타임 오류 0개. `qa.json`과 캡처를 참조한다.
- 스티키 탭 고정·이동·활성 표시·제목 오프셋·최상단 복귀, 휴무일 펼침·접힘, 여섯 디자이너별 예약 가능 날짜, 기존 저장 상태 보존, 윤아 예약 완료, 공용 REVIEWS, 기존 디자이너 탭·후기 경로, SNS 비활성, 320/375px 가로 넘침을 확인했다.
- HOME, DISCOVER, ARCHIVE, ARTICLE, IN FOCUS, Airy Layered, Meet Your Match 경로의 HTTP 200과 main 렌더링도 확인했다.
- `git diff --cached --check`: 통과.

실제 예약·리뷰 API와 SNS URL이 없는 프로토타입 범위는 그대로 유지된다. 실제 모바일 기기 검수는 수행하지 않았다.
