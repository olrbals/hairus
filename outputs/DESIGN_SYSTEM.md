# HAIRUS — DESIGN SYSTEM

> 최신 변경(2026-10-12): `1012 코덱스 시연용 920:3429`에 있는 화면은 기존 시연용보다 우선한다. 없는 화면만 기존 시연용 기록을 따른다. 초안은 기능/UX 참고, 95% 영역은 채택하지 않는다. 아래 이전 결정은 역사적 기록이며 이 우선순위가 최신이다. 전체 변경 목록은 [FIGMA_1012_UPDATE.md](FIGMA_1012_UPDATE.md)를 참조한다. PHASE 03 시작 승인, PHASE 04 미착수. 온보딩은 사용자 선택에 따라 시연용 시스템으로 새로 구성한다.

> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.


2026-10-12 · 시연용 노드에서 읽은 측정값과 신규 화면을 위한 제안을 분리했다. 원본 Figma는 수정하지 않았다.

## 디자인 우선순위

시연용 완성 화면 → 해당 영역의 공통 패턴 → 초안의 UX → 신규 화면 설계. “Premium Editorial Hair Magazine”의 중심은 이미지 비율, 세리프 영문 제목, 간결한 한국어, 넉넉한 여백이다. 모든 콘텐츠를 둥근 카드에 넣지 않는다.

**사용자 후속 지시:** 구현 폰트는 **Cormorant Garamond, Cormorant, Pretendard**만 허용한다. 이는 Figma의 Noto Sans KR·Inter보다 우선한다. 다른 폰트로 통일하거나 새로운 세리프를 도입하지 않는다.

## 폰트와 타이포그래피

| 역할 / 관찰 노드 | 원본 측정 | 구현 정책 |
|---|---|---|
| Home Hero `876:2751` | Cormorant Garamond SemiBold 50px / line-height 100% / tracking -2% | 그대로; -2%=−0.02em |
| Home In Focus `I876:2659;628:852` | Cormorant Garamond Bold 44px / 48px / 0% | 그대로 |
| More to Discover `I876:2666;628:852` | Cormorant Garamond Bold 40px / 40px / 0% | 독립 크기 유지; 모든 제목 44로 강제 금지 |
| A Seat for You `876:2707` | Cormorant Garamond Bold 48px / 130% / -2% | 그대로 |
| Popular Designers `I876:2712;628:852` | Cormorant Garamond SemiBold 28px / 130% / **-2px** | 퍼센트와 혼동 금지 |
| Login HAIRUS `887:3807` | Cormorant Garamond Bold 48px / 130% / -2% | 텍스트 워드마크 |
| Home HAIRUS `876:2747` | Cormorant Garamond Bold 32px / 130% / -2% | 크기별 워드마크 |
| 에디토리얼 보조 제목 | Cormorant Medium 32px / 130% / -2% 사용 확인 | Garamond와 별개 family로 보존 |
| Home 설명 `876:2660` | Pretendard Medium 16px / 130% / -2% | 그대로 |
| 본문/메타 | Pretendard Regular 14, 16, 18px 등 / 주로 130% / -2% | 노드별 값을 적용 |
| 카드 제목 `876:2691` | Pretendard SemiBold 20px / 130% / -2% | 그대로 |
| 작은 카드 설명 `876:2696` | Pretendard Regular 8px / 18px / 0% | 원본 기록. 가독성 개선은 별도 승인 대상으로 표시 |
| Hero 한국어 `876:2749` | Noto Sans KR Medium 15px / 24px / 0% | **Pretendard Medium**으로 교체, 크기·행간 유지 후 검수 |
| 하단 탭 라벨 | Inter Medium 10~10.4px / 14px / 0% | **Pretendard Medium**으로 교체, 한국어 glyph/중앙 정렬 검수 |

Figma에는 MORI/Title1(28), Title2(22), Body1(16), Body2(14), caption(12), caption2(8) 및 여러 구형 스타일이 공존한다. 라이브러리 전체를 새 토큰으로 가져오지 않고 최종 채택 노드의 computed style을 기준으로 추출한다. CSS에서 tracking 단위(px, %)를 보존하고 글꼴 실제 로딩 후 줄바꿈을 비교한다.

폰트 전환 승인 자체는 이미 받았다. Noto Sans KR/Inter 유지 여부를 다시 묻지 않는다. 파일 확보 후 필요한 굵기만 포함하고 이름이 비슷한 Cormorant 계열을 혼동하지 않는다.

## 색상

| 관찰값 | 역할 후보 | 판단 |
|---|---|---|
| `#FFFFFF` | paper/background | 시연용 사용 및 `627:813` primitive/paper |
| `#20201E` | ink/브랜드 텍스트 | `627:815` primitive/ink |
| `#666460` | muted | `627:817` primitive/muted |
| `#000000`, `#111111`, `#0E0E0E` | 검정 구획/제목/버튼 | 서로 다른 실제 값; 임의 단일화 금지 |
| `#777777`, `#E8E8E8` | 기사 보조/구분선 | Home care variables `810:809 / 810:810` |
| `#222B3A`, `#747E8E` 및 opacity 0.8 | 기존 UI 문자 | 관찰값. 새 파란색 브랜드 팔레트의 근거로 사용하지 않음 |
| `#FFE228`, `#03C75A` | 카카오·네이버 아이콘 | 원본의 기능적 브랜드 색 예외 유지 |

MORI / V2 / Editorial 컬렉션에는 wine, soft, radius/control=8도 있지만 새 전역 브랜드 강조색/반경으로 채택하지 않는다. 검정·흰색 중심을 유지하며 원본의 제한적 예외만 재현한다. `#FF6F6F` 사용도 전체 강조색으로 확대하지 않는다.

## 레이아웃과 이미지

| 관찰 | 측정/노드 | 구현 방향 |
|---|---|---|
| 기준 모바일 폭 | 시연용 대부분 430px; 초안 402px | 시연용 430을 시각 비교 기준으로 사용 |
| 기본 좌우 여백 | Home In Focus `876:2656` padding 24 | 430−48=382px 콘텐츠 폭 |
| Home 내부 간격 | `876:2655` vertical gap 52, bottom padding 52 | 모든 섹션 전역 간격으로 일반화하지 않음 |
| 기본 진행 버튼 | `814:1799` 382×56, 내부 좌우 24 | 실제 width/height와 폰트 유지 |
| 하단 내비게이션 | `876:2762` 398×64 | 430 기준 좌우 16; 바깥 safe area 고려 |
| Entry Banner | 396×307 | 원본 가로/세로 비율 유지 |
| 긴 상세 | 스타일 2077px, Home 4561px, Designer 4803px 등 | 문서 스크롤 길이; 화면 높이를 이 값으로 고정하지 않음 |

**[제안]** 360/390/430px에서 콘텐츠 유동 폭을 검수하고 큰 화면은 모바일 콘텐츠를 중앙 배치한다. 아직 데스크톱 리디자인을 만들지 않는다. 텍스트를 포함한 페이지 전체를 `transform: scale`로 축소하지 않는다. 가로 이미지 레일은 다음 이미지 일부가 보이는 원본 구성을 유지한다. viewport/safe-area/키보드로 고정 CTA가 가려지지 않도록 여유 공간을 둔다.

## 컴포넌트 시각 규칙

- 원본 스타일 이미지의 투명 배경·crop·여백을 그대로 쓴다. 흰 배경과 컷아웃 인물의 관계를 카드 배경으로 덮지 않는다.
- `Next — Minimal Glass`는 실제 GLASS 효과가 있다. refraction 약 .18, depth 12, light angle 125°, radius 5; inner shadow 3px black .06 및 2px white .65, drop shadow 4px black .045 관찰. CSS의 blur와 동일 효과라고 단정하지 않는다. 웹에서 근사 가능한 범위를 작은 시각 샘플로 비교한다.
- 유리 효과는 기존 Next/소셜/내비게이션 위치에 제한한다. 모든 카드에 그림자나 그라데이션을 추가하지 않는다.
- 스타일 MOOD 블랙 구획, 디자이너 SELECTED WORKS 블랙 구획, 팝업 흑백 전환을 유지한다.
- Bottom Sheet는 원본 round top, handle, footer action을 참고한다. 필터 마지막 칩이 잘리는 문제는 래핑/가로 스크롤의 검토 대상으로 남긴다.
- 상태는 default/pressed/selected/disabled/focus/loading/error/empty를 정의한다. Figma에 없는 상태는 동일 폰트·구분선·흑백 대비로 보완한다.

## 신규 화면 방향 — 아직 구현/시안 제작하지 않음

| 화면 | 설계 제안 |
|---|---|
| Analysis Result / Edit | 세리프 타이틀 + 번호 있는 형태/시술/관리 구획; 수정 링크와 하단 CTA. 블루 카드 제거. 원본 결과/사용자 입력 구분 |
| SAVED | Archive의 이미지 중심 그리드를 재사용하되 제목 Saved와 4분류를 명시. 디자인 통일과 탐색 역할 분리 |
| MY | My Hair Profile, 추천 입력 정보, 예약, 계정의 간결한 행 구성. 저장 그리드 복제 금지 |
| Hair Note | 에디토리얼 제목 + 5개 텍스트 구획/수정 버튼 + 검토 CTA. 자동 초안/수정 표시 |
| Reservation | 진행 번호 + 메뉴/참고사진/Note/일정/검토. 과도한 패널 중첩 없이 구분선 활용 |

## 모션·접근성 제안

원본 prototype transition은 조사한 연결에서 대부분 null이다. 관찰된 hover 주석은 원형 이미지의 saturation/느린 확대이며 터치 필수 기능을 hover에 의존시키지 않는다.

제안 기본: 버튼 피드백 100–150ms, 화면/시트 180–260ms, opacity/작은 translate 중심. 전체 이미지 일괄 등장·parallax·긴 대기 금지. `prefers-reduced-motion`에서는 이동/반복 효과를 없애고 상태 변화는 즉시 전달한다. 키보드 focus, 대화상자 포커스 복원, 스크린리더 라벨, 확대 글자, 작은 원본 캡션 가독성을 QA 항목으로 둔다. 시각 크기를 유지하면서 hit area는 44px 수준으로 확장하는 안을 검토한다.


## 2026-10-12 PHASE 04 반영

기존 3종 폰트 정책 유지. 분석 시트는 최신 `920:5708/5738`: 흰 배경, 상단 radius16, handle52×4, 좌우20, 기본 gap28, 제목28/600/1.3/-2px. 얼굴형 3열·gap11/20·이미지320:400 crop, 기장 chip48높이/radius20. 단일 선택·이미지 선택·텍스트 입력으로 확장했다. 기본 시트와 편집/권한 변형을 분리한다. 시각적 입력 상자34px를 유지하면서 터치영역44px로 확장한다. 작은 화면에서는 칩 줄바꿈·시트 내부 스크롤을 허용하고 reduced-motion에서 전환을 제거한다.
