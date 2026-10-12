# HAIRUS — FIGMA SCREEN AUDIT

> 최신 변경(2026-10-12): `1012 코덱스 시연용 920:3429`에 있는 화면은 기존 시연용보다 우선한다. 없는 화면만 기존 시연용 기록을 따른다. 초안은 기능/UX 참고, 95% 영역은 채택하지 않는다. 아래 이전 결정은 역사적 기록이며 이 우선순위가 최신이다. 전체 변경 목록은 [FIGMA_1012_UPDATE.md](FIGMA_1012_UPDATE.md)를 참조한다. PHASE 03 시작 승인, PHASE 04 미착수. 온보딩은 사용자 선택에 따라 시연용 시스템으로 새로 구성한다.

> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.


조사일: 2026-10-12 (Asia/Seoul). PHASE 01 검토본. 구현·배포·Figma 수정 없음.

## 근거와 범위

원본 파일 `Ja8Ep1JwxOOFgMArfYr16T`, 작업 페이지 `693:4781`의 **시연용 `814:1264`**과 **시연용 / 초안 / 디자인 참고 XXX `905:14215`**의 화면·조각을 전수 목록화했다. 시연용 47개 화면/섹션/조각과 초안 60개 모바일 프레임의 텍스트 구조를 읽었다. 숫자는 독립 라우트 수가 아니다. 아래 개별 행의 V는 스크린샷도 검토, S는 구조·텍스트 검토, M은 목록 메타데이터만 확인이다. S를 픽셀 단위 검수 완료로 해석하지 않는다.

추가로 ‘95% 이상 완성’의 최상위 목록, ‘70% 이상 완성’ 목록, 외부 엔트리 후보, assets 페이지를 확인했다. 파일의 13개 페이지 이름은 확인했지만, 과거 페이지 전체의 모든 하위 화면까지 검토한 것은 아니다. 이번 구현의 기준은 사용자가 지정한 두 영역이다. 숨겨진 참조/과거 페이지에 화면이 없다고 단정하지 않는다.

폰트 정책은 후속 사용자 지시로 **Cormorant Garamond / Cormorant / Pretendard만 허용**한다. 원본의 다른 폰트는 기록하되 구현에는 사용하지 않는다.

## 상태 기준

- A DESIGN COMPLETE: 구조·콘텐츠가 구현 기준으로 충분한 시연용 화면. 기능 완료나 최종 승인 뜻은 아니다.
- B DESIGN DRAFT: UX 참고용 초안. 블루 UI는 복제 금지.
- C DESIGN MISSING: 지정 영역에서 독립 설계가 확인되지 않은 필요 화면/상태. 파일 전체 부재 판정은 아니다.
- D NEEDS CONFIRMATION: 중복·잘못된 내용·최종안/역할 불명확. D 안에서도 완성된 부분은 보존한다.
- P0: 필수 여정, P1: 연결 콘텐츠/완성도, P2: 선택 확장. `/ 05` 등은 개발 Phase 번호다.

## 시연용 화면 목록

출처는 모두 `작업 진행 중 / 시연용 (814:1264)`이며 Source Frame 열은 원본 이름이다. 기능·목적지는 확인된 콘텐츠 및 요구사항을 조합한 구현 계획이다. 실제 Figma prototype 연결은 별도 표에 구분한다. 자산은 ASSET_INVENTORY의 같은 Screen ID로 역추적한다.

| Screen Name | Figma Node ID | Source Frame | 상태/근거 | Required Functionality | Navigation Destination | Interaction | Required Assets | 우선순위 |
|---|---|---|---|---|---|---|---|---|
| 홈·상세의 독립 섹션 시안 | [814:1292](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1292) | magazine · 430×613 | D / S | 홈·상세의 독립 섹션 시안; 페이지와 구분 | 소속 홈/디자이너 상세 | View·가로 스크롤; 채택본 확인 | 이미지 노드 4개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 홈·상세의 독립 섹션 시안 | [814:1267](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1267) | Frame 99 · 430×696 | D / S | 홈·상세의 독립 섹션 시안; 페이지와 구분 | 소속 홈/디자이너 상세 | View·가로 스크롤; 채택본 확인 | 이미지 노드 1개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 홈·상세의 독립 섹션 시안 | [814:1275](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1275) | dicover · 430×649 | D / S | 홈·상세의 독립 섹션 시안; 페이지와 구분 | 소속 홈/디자이너 상세 | View·가로 스크롤; 채택본 확인 | 이미지 노드 8개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 검색 없는 Archive 이전 후보 | [814:1374](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1374) | archive · 430×1628 | D / S | 검색 없는 Archive 이전 후보 | 스타일 상세 4종 | 스타일 선택 | 이미지 노드 8개; 원본 텍스트·아이콘 | P1 / 06 |
| 스타일 탐색 | [889:7251](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-7251) | archive · 430×1894 | A / V | 스타일 탐색; 검색·기장 분류 | 스타일 상세·이미지 탐색 | 탭·검색·필터·카드 선택 | 이미지 노드 8개; 원본 텍스트·아이콘 | P0 / 06 |
| 디자이너 검색·포트폴리오 미리보기 | [889:7597](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-7597) | archive · 430×2697 | A / V | 디자이너 검색·포트폴리오 미리보기 | 디자이너 상세 | 검색·정렬·저장·선택 | 이미지 노드 32개; 원본 텍스트·아이콘 | P0 / 06 |
| 살롱 탐색 | [899:8165](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=899-8165) | archive · 430×2697 | D / V | 살롱 탐색; 잘못된 기사 링크·인원 문구 수정 필요 | 살롱 상세(제안) | 검색·정렬·저장 | 이미지 노드 5개; 원본 텍스트·아이콘 | P0 / 06 |
| ISSUE 배너 중복 후보 | [814:1511](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1511) | bannerIssue · 396×307 | D / S | ISSUE 배너 중복 후보 | Article 01 | 스와이프·닫기·오늘 하루 숨김 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 05 |
| POPUP 배너 중복 후보 | [814:1522](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1522) | bannerPopup · 396×307 | D / S | POPUP 배너 중복 후보 | Popup Detail | 스와이프·닫기·오늘 하루 숨김 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 05 |
| ISSUE 배너 중복 후보 | [876:3438](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3438) | bannerIssue · 396×307 | D / S | ISSUE 배너 중복 후보 | Article 01 | 스와이프·닫기·오늘 하루 숨김 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 05 |
| POPUP 배너 중복 후보 | [876:3449](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3449) | bannerPopup · 396×307 | D / S | POPUP 배너 중복 후보 | Popup Detail | 스와이프·닫기·오늘 하루 숨김 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 05 |
| 팝업 상세 | [814:1535](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1535) | popUp · 430×3193 | D / V | 팝업 상세; 날짜·쿠폰·응모 운영값 확인 | 쿠폰·응모 결과(미설계) | 스크롤·CTA | 이미지 노드 11개; 원본 텍스트·아이콘 | P1 / 05 |
| Article 01 중복 | [814:1615](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1615) | artice01 · 430×3435 | D / S | Article 01 중복; 홈 링크는 814:2304 | 이전 화면 | 스크롤·뒤로 | 이미지 노드 8개; 원본 텍스트·아이콘 | P0 / 05 |
| Article 01 중복 | [814:2304](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2304) | artice01 · 430×3435 | D / V | Article 01 중복; 홈 링크는 814:2304 | 이전 화면 | 스크롤·뒤로 | 이미지 노드 8개; 원본 텍스트·아이콘 | P0 / 05 |
| 기사 02/03/04 | [814:1679](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1679) | artice02 · 430×3435 | D / S | 기사 02/03/04; 제목별 본문 미완성 | 이전 화면 | 스크롤·뒤로 | 이미지 노드 8개; 원본 텍스트·아이콘 | P1 / 05 |
| 기사 02/03/04 | [814:2389](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2389) | artice03 · 430×3435 | D / S | 기사 02/03/04; 제목별 본문 미완성 | 이전 화면 | 스크롤·뒤로 | 이미지 노드 8개; 원본 텍스트·아이콘 | P1 / 05 |
| 기사 02/03/04 | [814:2476](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2476) | artice04 · 430×3435 | D / S | 기사 02/03/04; 제목별 본문 미완성 | 이전 화면 | 스크롤·뒤로 | 이미지 노드 8개; 원본 텍스트·아이콘 | P1 / 05 |
| 매거진 목록 4개 | [814:1743](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1743) | magazine · 430×1272 | A / S | 매거진 목록 4개 | 기사 01–04 | 기사 선택 | 이미지 노드 4개; 원본 텍스트·아이콘 | P1 / 05 |
| 매칭 02 활동 지역 입력 | [814:1798](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-1798) | 02 · 430×874 | A / S | 매칭 02 활동 지역 입력 | 매칭 03 | 입력·다음·뒤로 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 08 |
| 홈·상세의 독립 섹션 시안 | [814:2563](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2563) | Group 11 · 430×775 | D / S | 홈·상세의 독립 섹션 시안; 페이지와 구분 | 소속 홈/디자이너 상세 | View·가로 스크롤; 채택본 확인 | 이미지 노드 1개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 스타일 상세·For You·More Styles | [751:4689](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=751-4689) | style01 · 430×2077 | A / V | 스타일 상세·For You·More Styles | 관련 스타일·메인 탭; 디자이너 찾기 연결 제안 | 이미지 각도·가로 스크롤; 저장 진입 위치 확인 | 이미지 노드 7개; 원본 텍스트·아이콘 | P0 / 06 |
| 스타일 상세·For You·More Styles | [814:2742](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2742) | style02 · 430×2077 | A / S | 스타일 상세·For You·More Styles | 관련 스타일·메인 탭; 디자이너 찾기 연결 제안 | 이미지 각도·가로 스크롤; 저장 진입 위치 확인 | 이미지 노드 7개; 원본 텍스트·아이콘 | P0 / 06 |
| 스타일 상세·For You·More Styles | [814:2854](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2854) | style04 · 430×2077 | A / S | 스타일 상세·For You·More Styles | 관련 스타일·메인 탭; 디자이너 찾기 연결 제안 | 이미지 각도·가로 스크롤; 저장 진입 위치 확인 | 이미지 노드 7개; 원본 텍스트·아이콘 | P0 / 06 |
| 스타일 상세·For You·More Styles | [814:2966](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=814-2966) | style03 · 430×2077 | A / S | 스타일 상세·For You·More Styles | 관련 스타일·메인 탭; 디자이너 찾기 연결 제안 | 이미지 각도·가로 스크롤; 저장 진입 위치 확인 | 이미지 노드 7개; 원본 텍스트·아이콘 | P0 / 06 |
| 포트폴리오 중복 | [843:2758](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=843-2758) | portfolio · 430×1999 | D / S | 포트폴리오 중복; 디자이너는 905:11189에 연결 | 작업 이미지 확대(제안) | 카테고리·확대 | 이미지 노드 17개; 원본 텍스트·아이콘 | P1 / 06 |
| 포트폴리오 중복 | [905:11189](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-11189) | portfolio · 430×1999 | D / S | 포트폴리오 중복; 디자이너는 905:11189에 연결 | 작업 이미지 확대(제안) | 카테고리·확대 | 이미지 노드 17개; 원본 텍스트·아이콘 | P1 / 06 |
| 홈·상세의 독립 섹션 시안 | [843:2821](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=843-2821) | portfolio · 430×553 | D / S | 홈·상세의 독립 섹션 시안; 페이지와 구분 | 소속 홈/디자이너 상세 | View·가로 스크롤; 채택본 확인 | 이미지 노드 3개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 매칭 04 상담 방식 최대 3개 | [728:2264](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=728-2264) | 04 · 430×874 | A / V | 매칭 04 상담 방식 최대 3개 | 매칭 05 | 칩 선택·해제 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 08 |
| 매칭 05 불편했던 경험 | [876:3140](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3140) | 05 · 430×874 | A / V | 매칭 05 불편했던 경험 | 매칭 진행·추천 결과(초안) | 복수 선택·추천 CTA | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 08 |
| In Focus 특집·소희 인터뷰 | [876:2845](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-2845) | infocusDetail · 430×3765 | A / S | In Focus 특집·소희 인터뷰 | 소희 디자이너 상세(전용 시안 미확인) | 스크롤·프로필 CTA·저장 | 이미지 노드 5개; 원본 텍스트·아이콘 | P1 / 05–06 |
| 실제 홈 7개 구획 및 4탭 | [876:2654](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-2654) | home · 430×4561 | A / V | 실제 홈 7개 구획 및 4탭 | In Focus·스타일·매거진·디자이너·매칭 | 스크롤·가로 탐색·저장·배너 | 이미지 노드 20개; 원본 텍스트·아이콘 | P0 / 05 |
| 매칭 01 성별 선택 / 비활성 상태 | [876:3109](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3109) | 01 · 430×874 | A / V | 매칭 01 성별 선택 / 비활성 상태 | 매칭 02 | 선택·다음 활성화 | 이미지 노드 2개; 원본 텍스트·아이콘 | P0 / 08 |
| 매칭 01 성별 선택 / 비활성 상태 | [876:3404](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3404) | 01 / 비활성화 · 430×874 | A / S | 매칭 01 성별 선택 / 비활성 상태 | 매칭 02 | 선택·다음 활성화 | 이미지 노드 2개; 원본 텍스트·아이콘 | P0 / 08 |
| 매칭 03 강점 선택 / 활성 상태 | [728:2164](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=728-2164) | 03 · 430×874 | A / S | 매칭 03 강점 선택 / 활성 상태 | 매칭 04 | 선택·해제·다음 | 이미지 노드 3개; 원본 텍스트·아이콘 | P0 / 08 |
| 매칭 03 강점 선택 / 활성 상태 | [876:3345](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=876-3345) | 03 / 활성화 예시 · 430×874 | A / S | 매칭 03 강점 선택 / 활성 상태 | 매칭 04 | 선택·해제·다음 | 이미지 노드 3개; 원본 텍스트·아이콘 | P0 / 08 |
| 카카오·네이버·Apple·휴대폰 로그인 선택 | [887:3809](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=887-3809) | login · 430×875 | A / V | 카카오·네이버·Apple·휴대폰 로그인 선택 | Welcome; 세부 인증은 미설계 | 로그인 방식 선택·약관 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 03 |
| 기장→레이어→모발 형태 3단계 | [887:3876](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=887-3876) | loading01 · 430×875 | A / V | 기장→레이어→모발 형태 3단계 | 분석 결과 | 단계 전환; Mock 표시 추가 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 04 |
| 기장→레이어→모발 형태 3단계 | [887:3899](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=887-3899) | loading02 · 430×875 | A / S | 기장→레이어→모발 형태 3단계 | 분석 결과 | 단계 전환; Mock 표시 추가 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 04 |
| 기장→레이어→모발 형태 3단계 | [887:3919](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=887-3919) | loading03 · 430×875 | A / S | 기장→레이어→모발 형태 3단계 | 분석 결과 | 단계 전환; Mock 표시 추가 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 04 |
| 촬영 이미지 확인 | [887:4021](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=887-4021) | captured · 430×874 | A / V | 촬영 이미지 확인 | 재촬영 또는 Loading 01 | 다시 찍기·사용 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 04 |
| 실제 카메라 미리보기 | [736:3951](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=736-3951) | camera · 430×874 | A / V | 실제 카메라 미리보기 | Captured | 셔터·카메라 전환·사진 선택·닫기 | 이미지 노드 1개; 원본 텍스트·아이콘 | P0 / 04 |
| 촬영 구도 안내 | [889:4219](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-4219) | photoGuide · 430×874 | A / V | 촬영 구도 안내 | 카메라 권한; 건너뛰기→Home 확정 | 촬영하기·건너뛰기 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 04 |
| 카메라 설명 시트 | [889:4234](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-4234) | System permission / Representation · 430×398 | D / V | 카메라 설명 시트; 개인정보 문구 수정 필요 | 브라우저 권한→Camera | 허용 요청·거절·시트 닫기 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 04 |
| 스타일 필터 | [889:7493](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-7493) | System permission / Representation · 430×893 | A / V | 스타일 필터; 마지막 칩 가로 넘침 확인 | 스타일 탐색 | 초기화·적용·닫기 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 06 |
| 디자이너 필터 | [899:8092](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=899-8092) | System permission / Representation · 430×893 | D / V | 디자이너 필터; 지역값 오복사·경력 구간 중복 | 디자이너 탐색 | 선택·초기화·적용 | 이미지 노드 0개; 원본 텍스트·아이콘 | P0 / 06 |
| 위치/설정 헤더 조각 | [889:7698](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=889-7698) | Header actions · 63×44 | D / S | 위치/설정 헤더 조각 | 연결 미정 | 아이콘 탭 | 이미지 노드 0개; 원본 텍스트·아이콘 | P2 / 06 |
| 디자이너 상세 | [905:11000](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-11000) | designer · 430×4803 | D / V | 디자이너 상세; 구조 존재·예약 영역 임시 문구 | 포트폴리오·살롱·예약 | 섹션 이동·저장·예약 CTA 보완 | 이미지 노드 7개; 원본 텍스트·아이콘 | P0 / 06–08 |

## 초안 모바일 화면 목록

출처는 모두 `작업 진행 중 / 시연용 / 초안 / 디자인 참고 XXX (905:14215)`이다. 완성 영역에 대응 화면이 있으면 이 초안은 기능 참고만 한다. 모든 행의 자산은 “초안 이미지 사용 여부 검토, 세 가지 허용 폰트와 시연용 아이콘으로 재설계”가 기본이다.

| Screen Name | Figma Node ID | Source Frame | 상태/근거 | Required Functionality | Navigation Destination | Interaction | Required Assets | 우선순위 |
|---|---|---|---|---|---|---|---|---|
| 디자이너 상세 | [905:14225](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14225) | MORI / M07 / 디자이너 상세 | B / S | 디자이너 상세 | 예약·살롱·포트폴리오 | 저장·예약 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 로그인 | [905:14272](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14272) | MORI / E03 / 로그인 | B / S | 로그인 | Welcome | 방식 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 03 |
| 분석 안내 | [905:14289](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14289) | MORI / U01 / 헤어 분석 안내 | B / S | 분석 안내 | Photo Guide | 시작 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 카메라 권한 | [905:14312](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14312) | MORI / U02 / 카메라 권한 | B / S | 카메라 권한 | Camera | 허용/거절 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 촬영 가이드 | [905:14331](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14331) | MORI / U03 / 촬영 가이드 | B / S | 촬영 가이드 | Camera Permission | 촬영 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 카메라 | [905:14349](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14349) | MORI / U04 / 카메라 촬영 | B / S | 카메라 | Captured | 셔터 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 온보딩 | [905:14363](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14363) | MORI / E02-1 / 내 머리 이해하기 | B / S | 온보딩 | 다음 온보딩 또는 Login | 스와이프·다음 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 03 |
| 온보딩 | [905:14375](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14375) | MORI / E02-2 / 취향 발견하기 | B / S | 온보딩 | 다음 온보딩 또는 Login | 스와이프·다음 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 03 |
| 온보딩 | [905:14387](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14387) | MORI / E02-3 / 디자이너와 연결하기 | B / S | 온보딩 | 다음 온보딩 또는 Login | 스와이프·다음 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 03 |
| 사진 확인 | [905:14400](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14400) | MORI / U05 / 사진 확인 | B / S | 사진 확인 | Loading 01 또는 Camera | 재촬영/분석 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 분석 단계 상태 | [905:14416](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14416) | MORI / U06-1 / 헤어 분석 중 | B / S | 분석 단계 상태 | 다음 단계 또는 Result | 단계 진행 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 분석 단계 상태 | [905:14431](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14431) | MORI / U06-1 / 헤어 분석 중 | B / S | 분석 단계 상태 | 다음 단계 또는 Result | 단계 진행 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 분석 단계 상태 | [905:14447](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14447) | MORI / U06-1 / 헤어 분석 중 | B / S | 분석 단계 상태 | 다음 단계 또는 Result | 단계 진행 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 기본 정보 | [905:14463](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14463) | MORI / E04 / 기본 정보 | B / S | 기본 정보 | 약관 동의 | 입력 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 03 |
| 약관 동의 | [905:14489](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14489) | MORI / E05 / 약관 동의 | B / S | 약관 동의 | Welcome | 필수/선택 동의 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 03 |
| 시작 / Splash 후보 | [905:14530](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14530) | MORI / E01 / 시작 | B / S | 시작 / Splash 후보 | Onboarding 01 | 시작 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 03 |
| 이미지 특징 확인·수정 | [905:14539](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14539) | MORI / D06 / Image Understanding | B / S | 이미지 특징 확인·수정 | 유사 스타일 | 특징 수정·계속 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 이미지 유사 결과 | [905:14562](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14562) | MORI / D07 / Image Related Results | B / S | 이미지 유사 결과 | 스타일·디자이너 | 저장·선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| MY HAIR 필드 관리 | [905:14575](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14575) | MORI / Y02 / MY HAIR | B / S | MY HAIR 필드 관리 | 프로필 수정·재분석 | 필드 편집 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 07 |
| 방문 결과 피드백 | [905:14602](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14602) | MORI / Y06 / Visit Outcome | B / S | 방문 결과 피드백 | MY HAIR·MY | 선택·저장·건너뛰기 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 후속 |
| 기장 수정 5개 선택지; 상태별 프레임 | [905:14711](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14711) | MORI / U08 / MY HAIR Edit | B / S | 기장 수정 5개 선택지; 상태별 프레임 | Result 또는 MY HAIR | 선택·저장·취소 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 기장 수정 5개 선택지; 상태별 프레임 | [905:14764](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14764) | MORI / U08 / MY HAIR Edit | B / S | 기장 수정 5개 선택지; 상태별 프레임 | Result 또는 MY HAIR | 선택·저장·취소 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 기장 수정 5개 선택지; 상태별 프레임 | [905:14817](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14817) | MORI / U08 / MY HAIR Edit | B / S | 기장 수정 5개 선택지; 상태별 프레임 | Result 또는 MY HAIR | 선택·저장·취소 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 기장 수정 5개 선택지; 상태별 프레임 | [905:14870](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14870) | MORI / U08 / MY HAIR Edit | B / S | 기장 수정 5개 선택지; 상태별 프레임 | Result 또는 MY HAIR | 선택·저장·취소 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 디자이너 상세 | [905:14933](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14933) | MORI / M07 / 디자이너 상세 | B / S | 디자이너 상세 | 예약·살롱·포트폴리오 | 저장·예약 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 구형 Home; 현행 시각 참고 금지 | [905:14980](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-14980) | Home | B / S | 구형 Home; 현행 시각 참고 금지 | 메인 탭 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 보관 |
| 선택적 취향 안내 | [905:15058](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15058) | MORI / Hair Analysis Intro / 분석 다음 · 취향 안내 | B / S | 선택적 취향 안내 | 취향 질문 또는 Home | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 07 |
| 분석 결과: 형태·시술 이력·관리 상태 | [905:15091](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15091) | MORI / U07 / MY HAIR Result | B / V | 분석 결과: 형태·시술 이력·관리 상태 | 결과 수정 또는 Home | 수정/프로필 저장 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 기장 수정 5개 선택지; 상태별 프레임 | [905:15135](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15135) | MORI / U08 / MY HAIR Edit | B / S | 기장 수정 5개 선택지; 상태별 프레임 | Result 또는 MY HAIR | 선택·저장·취소 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 04 |
| 손질 습관 단일 선택 | [905:15188](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15188) | MORI / U09A / Preference / Styling Habit | B / S | 손질 습관 단일 선택 | 취향 사진 | 1개 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 07 |
| 취향 사진 선택 | [905:15232](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15232) | MORI / U09B / Preference / Visual | B / S | 취향 사진 선택 | 취향 우선순위 | 복수 선택; 2개 기준 확인 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 07 |
| 우선순위 최대 3개 | [905:15267](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15267) | MORI / U09C / Preference / Priority | B / S | 우선순위 최대 3개 | 추천 또는 Home | 선택·저장 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 07 |
| 스타일 탐색 | [905:15325](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15325) | MORI / D02 / Style Explore | B / S | 스타일 탐색 | 스타일 상세 | 탐색·검색 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 06 |
| 검색·사진 탐색 진입 | [905:15374](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15374) | MORI / 59 / Explore / Matching + Image Search Entry | B / S | 검색·사진 탐색 진입 | 이미지 업로드·매칭 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 스타일 상세 | [905:15433](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15433) | MORI / J01 / Style Detail | B / S | 스타일 상세 | 저장 이유·디자이너 찾기 | 저장·매칭 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 06 |
| 선택적 저장 이유 | [905:15464](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15464) | MORI / S02 / Save Reason / Overlay | B / S | 선택적 저장 이유 | 원 화면 또는 SAVED | 선택·닫기; 저장 유지 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 07 |
| 저장 및 컬렉션 | [905:15500](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15500) | MORI / S04 / Saved | B / V | 저장 및 컬렉션 | 저장 상세·컬렉션 | 검색·선택·해제 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 07 |
| 컬렉션 상세 | [905:15589](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15589) | MORI / S05 / Collection Detail / 다음 펌 후보 | B / S | 컬렉션 상세 | 스타일·디자이너 찾기 | 추가·선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P2 / 07 |
| 디자이너 찾기 안내 | [905:15620](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15620) | MORI / M01 / Designer Finder Entry | B / S | 디자이너 찾기 안내 | 매칭 01 | 시작 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 이미지 업로드 | [905:15654](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15654) | MORI / D05 / Image Search / Upload | B / S | 이미지 업로드 | 이미지 특징 확인 | 파일 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| MY 개인 프로필 | [905:15671](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15671) | MORI / Y01 / My | B / V | MY 개인 프로필 | MY HAIR·예약·설정 | 목록 진입 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 07 |
| 원하는 시술 | [905:15719](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15719) | MORI / 63 / Matching 1 / Desired Service | B / S | 원하는 시술 | 레퍼런스 선택 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 이번 목표 사진; 저장 없음 분기 | [905:15768](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15768) | MORI / 64 / Matching 2 / Saved Style Reference | B / S | 이번 목표 사진; 저장 없음 분기 | 디자이너 기준 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 이번 목표 사진; 저장 없음 분기 | [905:15805](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15805) | MORI / 65 / Matching 2B / No Saved Style | B / S | 이번 목표 사진; 저장 없음 분기 | 디자이너 기준 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 디자이너 강점 최대 2개 | [905:15839](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15839) | MORI / 66 / Matching 3 / Designer Criteria | B / S | 디자이너 강점 최대 2개 | 상담 방식 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 상담 선호 질문 | [905:15878](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15878) | MORI / M03 / Just-in-Time / Consultation | B / S | 상담 선호 질문 | 다음 질문 | 단일 선택/건너뛰기 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 피할 경험; 없음과 배타 선택 | [905:15903](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15903) | MORI / 68 / Matching 5 / Avoid Experience | B / S | 피할 경험; 없음과 배타 선택 | 추천 진행 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 추천 진행 상태 | [905:15938](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15938) | MORI / M04 / Matching Progress | B / S | 추천 진행 상태 | 추천 결과 | 취소·완료 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 추천 디자이너 | [905:15972](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-15972) | MORI / M05 / Designer Recommendation | B / S | 추천 디자이너 | 디자이너 상세·추천 근거 | 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 디자이너 상세 | [905:16000](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16000) | MORI / M07 / Designer Detail | B / S | 디자이너 상세 | 예약·살롱·포트폴리오 | 저장·예약 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 추천 근거 | [905:16068](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16068) | MORI / M06 / Match Reason / Overlay | B / S | 추천 근거 | 작업 비교 | 확인·이동 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 저장 사진/작업 비교 | [905:16101](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16101) | MORI / M08 / Similar Portfolio Evidence | B / S | 저장 사진/작업 비교 | 예약 | 이미지 비교 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| 살롱 상세 | [905:16132](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16132) | MORI / M09 / Salon Detail | B / S | 살롱 상세 | 디자이너·예약 | 사진·방문 안내 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 06 |
| 살롱 내 디자이너 목록 | [905:16183](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16183) | MORI / designers | B / S | 살롱 내 디자이너 목록 | 디자이너 상세·예약 | 입력·선택·뒤로 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P1 / 08 |
| Hair Note 5항목 수정 | [905:16239](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16239) | MORI / B03 / AI Hair Note | B / V | Hair Note 5항목 수정 | 날짜 시간(사용자 확정; 원 CTA는 시술) | 필드 편집 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 예약 메뉴·가격·소요시간 | [905:16273](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16273) | MORI / B01 / Select Service | B / S | 예약 메뉴·가격·소요시간 | Reference(사용자 확정; 원 CTA는 날짜) | 메뉴 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 상담 레퍼런스 확인 | [905:16301](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16301) | MORI / B02 / Reference Confirmation | B / S | 상담 레퍼런스 확인 | Hair Note | 스타일·프로필 확인 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 날짜·시간 | [905:16329](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16329) | MORI / B05 / Date and Time | B / S | 날짜·시간 | 예약 검토 | 달력·시간 선택 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 예약 최종 검토 | [905:16404](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16404) | MORI / B06 / Booking Review | B / S | 예약 최종 검토 | 모의 예약 완료 | 항목 수정·모의 저장 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |
| 예약 완료 | [905:16436](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-16436) | MORI / B07 / Booking Complete | B / S | 예약 완료 | MY 예약 또는 Home | 모의 완료 확인 | 초안 이미지/입력 예시; 시연용 토큰으로 교체 | P0 / 08 |

기장 수정 `14711 / 14764 / 14817 / 14870 / 15135`는 서로 다른 선택값 상태다. 같은 U08 이름만 보고 삭제하거나 별도 5페이지로 만들지 않는다. 로딩 U06-1 반복 3개도 단계 문구가 다르다. 디자이너 상세 `14225 / 14933 / 16000`은 중복/변형 후보다. 모두 접두 `905:`.

## 영역 외 후보 — 채택 확인 필요

| Screen Name | Node ID | Source Frame | 상태 | 기능/목적지/인터랙션 | 자산 | 우선순위 |
|---|---|---|---|---|---|---|
| Intro | [699:5618](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5618) | 수정해야할메인페이지 699:5600 | D / V | Intro→Onboarding·시작 | 이미지 1개·워드마크 | P0 / 03–06 |
| MORI / E02-1 / 내 머리 이해하기 | [699:5722](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5722) | 수정해야할메인페이지 699:5600 | D / V | Onboarding→다음/로그인·스와이프·건너뛰기 | 이미지 1개·워드마크 | P0 / 03–06 |
| MORI / E02-2 / 취향 발견하기 | [699:5732](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5732) | 수정해야할메인페이지 699:5600 | D / V | Onboarding→다음/로그인·스와이프·건너뛰기 | 이미지 2개·워드마크 | P0 / 03–06 |
| MORI / E02-3 / 디자이너와 연결하기 | [699:5743](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5743) | 수정해야할메인페이지 699:5600 | D / V | Onboarding→다음/로그인·스와이프·건너뛰기 | 이미지 1개·워드마크 | P0 / 03–06 |
| MORI / E02-3 / 디자이너와 연결하기 | [728:752](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=728-752) | 수정해야할메인페이지 699:5600 | D / S | Onboarding→다음/로그인·스와이프·건너뛰기 | 이미지 1개·워드마크 | P0 / 03–06 |
| MORI / U01 / 헤어 분석 안내 | [699:5789](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5789) | 수정해야할메인페이지 699:5600 | D / V | Welcome→Photo Guide·시작 | 이미지 0개·워드마크 | P0 / 03–06 |
| salonDetail | [699:5999](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=699-5999) | 작업 진행 중 / salonDetail | D / S | 살롱/디자이너 혼합 상세·예약 | 이미지 14개·워드마크 | P0 / 03–06 |

`Intro`는 시작 버튼과 사진이 있는 랜딩이다. 사용자 확정으로 Splash와 역할을 분리한다. 확정 첫 여정에는 Intro를 추가하지 않는다. 온보딩 3은 `699:5743`과 `728:752`의 채택본 확인 필요. `salonDetail 699:5999`는 이름과 달리 디자이너 정보가 함께 있고, 초안 살롱과 주차·반려동물·출구·디자이너 수가 다르다.

## 95% 이상 완성 영역의 중복 후보 목록

출처 `905:8420`. 아래 표는 최초 M 수준 목록 기록이다. 사용자 검토 후 속성 비교 결과는 이 문서 말미에 추가했다. 시연용은 최종 기준이며 95% 영역은 구현 기준에서 제외한다. 픽셀 동일성은 검증하지 않았다. `905:9920` 홈과 `905:10025` 홈은 텍스트도 비교했으며 후자는 POPUP 배너 텍스트가 추가되어 있다. 이를 다른 최종 홈으로 자동 교체하지 않는다. 95% 영역은 채택하지 않으며 대응 시연용 행만 구현 근거로 사용한다.

| Node ID | Source Frame / Screen Name | 크기 | 상태 |
|---|---|---|---|
| [905:8421](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8421) | magazine | 430×613 | D / M |
| [905:8445](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8445) | Frame 304 | 430×696 | D / M |
| [905:8453](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8453) | dicover | 430×649 | D / M |
| [905:8470](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8470) | archive | 430×1628 | D / M |
| [905:8514](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8514) | archive | 430×1894 | D / M |
| [905:8585](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8585) | archive | 430×2697 | D / M |
| [905:8722](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8722) | archive | 430×2697 | D / M |
| [905:8810](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8810) | bannerIssue | 396×307 | D / M |
| [905:8821](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8821) | bannerPopup | 396×307 | D / M |
| [905:8832](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8832) | bannerIssue | 396×307 | D / M |
| [905:8843](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8843) | bannerPopup | 396×307 | D / M |
| [905:8854](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8854) | popUp | 430×3193 | D / M |
| [905:8934](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8934) | artice01 | 430×3435 | D / M |
| [905:8998](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-8998) | artice01 | 430×3435 | D / M |
| [905:9062](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9062) | artice02 | 430×3435 | D / M |
| [905:9126](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9126) | artice03 | 430×3435 | D / M |
| [905:9190](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9190) | artice04 | 430×3435 | D / M |
| [905:9254](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9254) | magazine | 430×1272 | D / M |
| [905:9290](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9290) | 02 | 430×874 | D / M |
| [905:9318](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9318) | Group 12 | 430×775 | D / M |
| [905:9328](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9328) | style01 | 430×2077 | D / M |
| [905:9414](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9414) | style02 | 430×2077 | D / M |
| [905:9500](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9500) | style04 | 430×2077 | D / M |
| [905:9586](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9586) | style03 | 430×2077 | D / M |
| [905:9672](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9672) | portfolio | 430×1999 | D / M |
| [905:9725](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9725) | portfolio | 430×553 | D / M |
| [905:9738](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9738) | 04 | 430×874 | D / M |
| [905:9776](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9776) | 05 | 430×874 | D / M |
| [905:9843](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9843) | infocusDetail | 430×3765 | D / M |
| [905:9920](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-9920) | home | 430×4561 | D / M·텍스트 비교 |
| [905:10025](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10025) | home | 430×4561 | D / M·텍스트 비교 |
| [905:10141](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10141) | bannerIssue | 396×307 | D / M |
| [905:10152](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10152) | 01 | 430×874 | D / M |
| [905:10175](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10175) | 01 / 비활성화 | 430×874 | D / M |
| [905:10198](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10198) | 03 | 430×874 | D / M |
| [905:10219](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10219) | 03 / 활성화 예시 | 430×874 | D / M |
| [905:10243](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10243) | login | 430×875 | D / M |
| [905:10261](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10261) | loading01 | 430×875 | D / M |
| [905:10280](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10280) | loading02 | 430×875 | D / M |
| [905:10299](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10299) | loading03 | 430×875 | D / M |
| [905:10318](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10318) | captured | 430×874 | D / M |
| [905:10332](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10332) | camera | 430×874 | D / M |
| [905:10351](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10351) | photoGuide | 430×874 | D / M |
| [905:10366](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10366) | System permission / Representation | 430×398 | D / M |
| [905:10379](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10379) | System permission / Representation | 430×893 | D / M |
| [905:10442](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10442) | System permission / Representation | 430×893 | D / M |
| [905:10508](https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=905-10508) | Header actions | 63×44 | D / M |

## 필요한 미설계 상태

| Screen Name | Node ID / Source Frame | 상태 | 기능 | 목적지 | 인터랙션 | 자산 | 우선순위 |
|---|---|---|---|---|---|---|---|
| 전용 Splash | — / 지정 영역 내 미확인; Intro·초안 E01 후보 있음 | C | 앱 초기 진입 | Onboarding 또는 Home | 짧은 로고 등장 | 승인 워드마크 | P0 / 03 |
| 전체 분석 필드 편집 | — / U08은 기장 편집만 상세 설계 | C | 앞머리·레이어·시술 이력·관리 상태 편집 | Result / MY | 편집·저장·취소 | 기존 폼 요소 | P0 / 04 |
| 카메라 거절·기기 없음·실패 | — | C | 복구/사진 선택/재시도 | Guide / Camera | 안내·재시도 | 텍스트·기존 버튼 | P0 / 04 |
| 분석 실패·새로고침 후 사진 없음 | — | C | 취소·재촬영; 결과 허위 표시 방지 | Guide | 재시도 | 기존 버튼 | P0 / 04 |
| SAVED 4분류 최종 시각안·빈 목록·검색 결과 없음 | — / 초안 S04는 스타일·컬렉션 | C | ALL/STYLES/DESIGNERS/SALONS | 콘텐츠 상세 / Explore | 탭·검색·해제 | 시연용 목록 패턴 | P0 / 07 |
| 계정 설정·로그아웃·로컬 데이터 초기화 | — | C | 사용자 상태 관리 | MY / Login | 확인·실행 | 기존 리스트 패턴 | P1 / 07 |
| 예약 내역·예약 상세·변경/취소 | — / 초안 MY·B07에 진입 문구만 확인 | C | 모의 예약 관리 | MY / 예약 수정 | 수정·취소 확인 | 예약 요약 행 | P0 / 08 |
| Hair Note 필드 편집·저장 실패 | — / B03에 수정 버튼만 확인 | C | 5항목 편집·검토 | Hair Note | 저장·취소 | 기존 필드 패턴 | P0 / 08 |
| 소희·다른 디자이너 개별 상세 데이터 | — / 윤아 상세 템플릿만 확인 | C | 올바른 사람의 정보 표시 | 예약·살롱 | 저장·예약 | 해당 인물 자산/메뉴 | P1 / 06 |
| 8개 탐색 스타일 중 나머지 4개 상세 | — / 상세 4종만 확인 | C | 픽시·스트레이트·페이스라인·프린지 | 스타일/디자이너 | 저장·관련 탐색 | 원본 스타일 이미지 | P1 / 06 |
| 쿠폰 수령·디자이너 세션 응모·약관 본문·휴대폰 인증 | — / 진입 CTA만 확인 | C | 모의 동작 범위 또는 후속 연결 결정 | 원 화면 | 확인·입력·완료 | 문안 필요 | P2 / 확인 후 |

## 연결 근거와 오류

| 출발 | 실제 확인한 Figma 연결 | 구현 판단 |
|---|---|---|
| Home More to Discover | `876:2671→751:4689`, `876:2672→814:2742`, View all `876:2679→814:1374` | 스타일 연결 유지; 탐색 최신 Archive 후보와 매핑 확인 |
| Home Magazine | `876:2689→814:2304`, `2693→814:1679`, `2697→814:2389`, `2701→814:2476`; View all→`814:1743` | 기사 본문 교정 후 연결 |
| Home 맞춤 추천 | `876:3582→876:3109` | 시연용 5질문 우선 |
| Explore 살롱 카드 | `899:8309 / 8332 / 8350`, `901:8374 / 8389`→`814:2304` | 명백한 대상 불일치. 살롱 상세로 수정 제안 |
| Designer selected works | `905:11088→905:11189` | 포트폴리오 연결 근거 있음 |
| 로그인·카메라·배너·매칭 일부 | 하위 노드 reaction이 비어 있음 | 텍스트/요구사항에서 연결을 설계; Figma 프로토타입 완성으로 보고하지 않음 |

## 보조·보관 대상

시연용 주석 `876:3435 / 3463 / 3436`, 참고 래스터 `889:7249 / 899:8320`는 독립 화면이 아니다. 초안의 Profile Bubble, UX controls, CollectionFolderCard/CreateCollectionCard는 컴포넌트 참고이며 별도 라우트가 아니다. 기존 Figma 노드는 삭제하지 않았다.

과거/보조 페이지 목록: 디자인1 `171:69`, 풀스택 초안 `94:43`, 0923 피드백 `266:6460`, 0929 피그마 디자인 평가 `452:4840`, 0928 `289:9524`, 1001~메인수정페이지 `472:967`, glassmorphism references `579:4142`, 1006 피드백 완료 `522:6729`, 작업 진행 중 `693:4781`, assets `728:649`, 0928-미용실앱 `431:1487`, MORI `423:875`, 레퍼런스들 `0:1`.

‘70% 이상 완성’ `802:902`, V2 `890:1208`, V3 `894:1287`, 보존 원본 `706:496 / 714:522 / 717:523`는 최종안 자동 채택 대상이 아니다. V2/V3는 존재와 이름·크기만 확인했으며 이번 본문 분석의 근거로 쓰지 않았다.

## 사용자 검토 후: 95% 영역 실제 차이 비교

2026-10-12 읽기 전용 비교. 95% 영역의 최상위 FRAME/SECTION/GROUP 47개를 이름/역할별 시연용 후보와 대조했다. 복수 후보는 하위 속성 차이가 가장 적은 쌍으로 연결했다. `Frame 304→Frame 99`, `Group 12→Group 11`은 이름 대응을 명시적으로 정규화했다.

비교: 하위 구조·텍스트/폰트·색상/이미지 fill·크기·상대좌표·stroke·radius·effects·auto-layout·vectorPaths 등. 최상위 캔버스 위치, 노드 ID/자동 레이어명, prototype reaction, 변수 바인딩은 비교에서 제외했다. 따라서 전면 픽셀/동작 동일성이나 변경의 시간적 선후를 뜻하지 않는다.

| 시연용 기준 | 95% 대응 | 확인한 차이 | 처리 |
|---|---|---|---|
| Home `876:2654` | Home `905:10025` | POPUP `905:10130` 396×307 추가(x17,y317). In Focus 카드 높이 526→530, 캡션 영역 44→48, 설명 텍스트 y25→30 등 총 10개 속성/노드 차이 | 변경 후보 기록만. 시연용 홈 유지; 배너 기능은 사용자 확정 요구로 구현 |
| 매칭05 `876:3140` | `905:9776` | 아이콘 하위 크기/좌표 8개 미세 차이(예: 폭 54→53.9993) | 수치 차이로 기록; UX/시각 변경으로 단정하지 않음 |
| 그 외 45개 | 각 대응 화면/조각 | 비교한 속성에서 차이 없음. 기본 Home `905:9920` 포함 | 별도 변경 검토 대상으로 올리지 않음 |

95% 영역은 구현 기준으로 사용하지 않는다. 변경 홈의 전장 픽셀 검수는 미수행이며, 신규 디자인 승인 질문으로 모든 중복 프레임을 다시 나열하지 않는다.


> 2026-10-12 정밀 재검토 정정: 변경 Home `905:10025`는 배너·캡션 배치뿐 아니라 Hero 이미지 교체와 하단 검정 그라데이션 추가도 확인됐다. 캡션 제목은 Pretendard Medium 16→20px이다. [스크린샷과 상세 비교](FIGMA_DESIGN_COMPARISON.md)를 기준으로 검토하며 최종 선택은 사용자 결정으로 시연용 전체 채택으로 해결됐다. 비교 결과는 이력이며 구현에 혼합하지 않는다.


## 2026-10-12 PHASE 04 반영

PHASE 04 구현 상태를 추가했다. 최신 노드 Photo Guide `920:5597`, Camera `920:5578`, Captured `920:5461`, Loading `920:5404/5423/5442`, Result `920:5488`, Permission `920:5632`, 얼굴형 `920:5708`, 기장 `920:5738`를 구현 기준으로 사용했다. 기존 행과 Node 기록은 보존한다. 두 수정 시트 이외의 10개 편집 변형은 기존 문법으로 확장한 구현이며 Figma 완성 화면이라고 분류하지 않는다. 상세 근거는 [PHASE04_RESULT](PHASE04_RESULT.md).
