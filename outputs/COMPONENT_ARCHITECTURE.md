# HAIRUS — COMPONENT ARCHITECTURE

> 최신 변경(2026-10-12): `1012 코덱스 시연용 920:3429`에 있는 화면은 기존 시연용보다 우선한다. 없는 화면만 기존 시연용 기록을 따른다. 초안은 기능/UX 참고, 95% 영역은 채택하지 않는다. 아래 이전 결정은 역사적 기록이며 이 우선순위가 최신이다. 전체 변경 목록은 [FIGMA_1012_UPDATE.md](FIGMA_1012_UPDATE.md)를 참조한다. PHASE 03 시작 승인, PHASE 04 미착수. 온보딩은 사용자 선택에 따라 시연용 시스템으로 새로 구성한다.

> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.


PHASE 01 설계를 PHASE 02 기반 코드로 구체화했다. Next.js App Router + TypeScript + React + Tailwind CSS를 기본으로 하고 구체적 버전은 PHASE 02에서 호환성을 확인해 고정한다.

## 구조와 책임

```text
src/
  app/                     경로·layout·오류/빈 상태 경계
    (entry)/               온보딩·로그인·분석
    (main)/                HOME·EXPLORE·SAVED·MY
    styles/ designers/ salons/ articles/ popups/
    reservation/ reservations/ hair-notes/ matching/
  components/
    primitives/            버튼·입력·아이콘·시트·토스트
    layout/                MobileShell·Header·BottomNav·StickyAction
    editorial/             제목·이미지·가로 레일·기사 구획
  features/
    entry/ analysis/ explore/ saved/ profile/
    matching/ reservation/ hair-note/ banner/
  domain/                  엔티티·규칙·상태 전이·유효성 검사
  services/
    contracts/             인터페이스 및 공통 결과/오류 형식
    mock/                  명시적 fixture·모의 지연·모의 오류
    api/                   실제 백엔드 adapter의 향후 위치
  repositories/            memory·browser storage·향후 remote
  data/                    정규화 fixture·content manifest
  styles/                  semantic tokens·허용 폰트 3종
public/assets/             승인된 Figma export만
```

본문·정적 에디토리얼은 Server Component 중심, camera/gesture/localStorage/form 등 브라우저 기능은 작은 Client Component 경계로 분리한다. 앱 전체에 무조건 `use client`를 붙이지 않는다. 이는 [Next.js 공식 Server/Client Components 지침](https://nextjs.org/docs/app/getting-started/server-and-client-components)에 맞춘 제안이다.

## 컴포넌트 계약

| 컴포넌트 | 책임/주요 입력 | 재사용 위치·주의 |
|---|---|---|
| MobileShell / EntryShell | 안전 영역·콘텐츠 폭·배경·고정 영역 여유 | 실제 frame 폭 430 기준; 고정 높이 복제 금지 |
| BottomNavigation | 4개 목적지·active tab·접근성 라벨 | HOME/EXPLORE/SAVED/MY; 원본 유리 효과 제한 |
| EditorialHeading / SectionIntro | title·description·action·원본 typography variant | 서로 다른 title 크기를 유지 |
| AssetImage | assetId·cropId·alt·우선 로딩 여부 | hash/transform/ratio를 manifest에서 조회 |
| ImageRail / AngleGallery | items·selectedIndex·onChange | 터치 스크롤·버튼 대체; 자동 스크롤 기본 OFF |
| StylePreview / DesignerRow / SalonPreview | 각 엔티티·saved 상태·선택 handler | 서로 다른 원본 레이아웃을 단일 카드로 강제하지 않음 |
| SaveToggle / SaveReasonSheet | entityRef·saved·optional reasons | 저장은 repository; Sheet는 선택적 메타 입력 |
| GlassButton / SolidButton / TextAction | label·disabled·busy·onPress | 폰트 Pretendard; 원본 형태별 variant |
| BottomSheet / Dialog | open·title·onClose·returnFocus | 스크롤 잠금·포커스·뒤로가기 |
| EntryBanner | campaignGroup·slides·visibilityPolicy | 컨텐츠와 노출 조건 분리 |
| SearchField / CategoryTabs / FilterSheet | draftFilter·appliedFilter·onApply | 취소 시 적용 필터 유지 |
| CameraView / PhotoReview | MediaStream·PhotoRef·capture | stream을 전역 영속 store에 넣지 않음 |
| AnalysisProgress / ResultSections | jobState·sourceMode·result | Mock와 실제 상태를 명시적으로 구분 |
| HairFieldEditor | schema·currentValue·onCommit | Result/My 공용; pending 값과 확정값 분리 |
| DesignerSections / SectionNav | profile/work/menu/reviews/salon | 앵커 이동·현재 구획·고정 CTA |
| MatchingStep | questionSchema·answer·onNext | 시연 5질문 확정 후 schema 구성 |
| HairNoteEditor | 5필드·draftSource·editedFields | 제안문과 사용자 문장을 분리 |
| ReservationStepper / ReviewSummary | draft·step·validation | 메뉴/참고/Note/일정/검토 공통 규칙 |
| EmptyState / ErrorState / MockNotice | 목적·복구 action | 새 화면과 정상 화면에 일관된 톤 |

폰트 family는 `Cormorant Garamond | Cormorant | Pretendard`만 사용한다. Noto Sans KR/Inter는 원본 audit 메타에만 남기고 렌더 토큰에 등록하지 않는다.

## 도메인 데이터 모델

| 엔티티 | 핵심 필드 | 불변 규칙 |
|---|---|---|
| UserSession | id, mode: demo/real, displayName, status | demo를 인증 완료 세션으로 오인시키지 않음 |
| OnboardingProgress | schemaVersion, lastStep, completedAt | step 이동과 완료 구분 |
| AnalysisRun | id, mode: mock/api, status, inputPhotoRef, originalResult, modelVersion?, createdAt | originalResult는 수정하지 않음; 실패도 결과로 저장하지 않음 |
| HairProfile | id, revision, analysisRunId?, edits, userHistory, confirmedAt | 각 필드의 출처/수정 시각 보존 |
| HairAttribute | value 또는 unknown, source: mock/ai/user, confidence?, updatedAt | Mock confidence 생성 금지; unknown과 없음 구분 |
| Style | id, nameKo, nameEn, attributes, imageIds, detailContentId?, designerIds | 상세가 없는 항목도 식별; 임의 다른 상세로 대체 금지 |
| Designer | id, salonId, name, specialtyTags, workIds, menuIds, evidence | 실제 포트폴리오와 레퍼런스 사진 구분 |
| Salon | id, name, address?, geo?, visitingInfo, designerIds, imageIds | 시안 주소를 실제 위치로 표시하지 않음 |
| SavedItem | id, entityType: style/designer/salon, entityId, savedAt, reasons[], note? | `(owner, type, id)` 중복 없음; 이유는 선택 |
| Collection(선택) | id, name, savedItemIds | 기본 SAVED 4분류와 별개 |
| Article / Popup | id, slug, sections[], assetRefs, sourceNodeId, status | CMS 도입 가능; 홈 노출 순서는 별도 manifest |
| BannerPreference | campaignGroupId, sessionDismissed, hiddenUntil, timeZone, schemaVersion | 닫기와 하루 숨김 분리 |
| MatchingDraft | id, profileRevision, referenceIds, answers, resultIds, mode | 시연/초안 질문 schema 혼합 금지 |
| HairNote | id, mode: template/mock-ai/api/user, sourceProfileRevision, referenceIds, generatedFields, userEdits, revision | 편집한 필드를 재생성으로 무단 덮어쓰기 금지 |
| ReservationDraft | id, designerId, salonId, serviceId, referenceIds, noteId, noteRevision, date, timeZone, slotId, status, updatedAt | 상위 선택 변경 시 종속값만 무효화 |
| Reservation | id, mode: mock/real, status, profileSnapshot, noteSnapshot, serviceSnapshot, scheduledAt, createdAt | 제출 순간 snapshot. 프로토타입은 `mock_confirmed`; 실예약 전송 없음 |
| AssetManifest | id, figmaNodeId, hash, localPath, intrinsicSize, placements[], alt | placement별 crop·transform·filters 유지 |

분석 필드는 우선 기장, 앞머리, 레이어, 모발 형태, 시술 이력(염색/펌), 관리 상태다. 초안 Y02의 얼굴형·목 길이는 화면에는 존재하지만 첫 버전 채택 미확정이다. 시술 이력과 손상 정도를 사진만으로 확정하지 않는다. 실제 AI가 제공하지 않은 값은 unknown 또는 사용자 입력이다.

### 원본과 수정값의 합성

`effectiveProfile[field] = userEdits에 해당 필드가 있으면 그 값, 아니면 originalResult[field]`.

수정 여부는 truthy 검사 대신 필드 존재 여부로 판단한다. `false`, `없음`, 빈 문자열, null/unknown의 의미를 schema로 구분한다. 저장 시 revision 증가. 취소는 draft만 폐기. 원본 복원은 해당 override 제거. 재분석 완료는 새 AnalysisRun이며 이전 run/수정을 덮어쓰지 않는다. 추천 재계산과 Hair Note 갱신 제안은 새 revision을 보고 수행한다.

## 상태 소유권과 저장

| 데이터 | 기본 위치 제안 | 수명/복구 |
|---|---|---|
| 검색/필터/선택 탭 | URL query + UI local state | 공유/뒤로가기 재현; 사진/본문은 query 금지 |
| 카메라 stream·사용자 photo Blob | feature memory | 이탈 시 stream stop, object URL revoke; 새로고침 후 재촬영 |
| 온보딩·배너 하루 숨김 | localStorage versioned JSON | 사용자 초기화까지; 하루 숨김은 만료 판정 |
| 배너 닫기 | sessionStorage | 같은 탭 세션에서 유지 |
| 프로필·저장·Hair Note·모의 예약 | repository → localStorage | 브라우저 내 유지임을 안내; 삭제/초기화 제공 |
| 편집 중 폼 | local state/reducer | 확정 전 도메인 값 미변경 |
| 예약 초안 | repository → localStorage | 복원 후 날짜·디자이너·메뉴 유효성 재검사 |

브라우저 저장소는 origin별이며 저장 차단/예외가 발생할 수 있다. 읽기/쓰기 try/catch, schema migration, 잘못된 JSON 복구, 저장 실패 표시를 adapter에서 처리한다. 서버 렌더 시 직접 참조하지 않고 hydration 이후 초기 상태를 복원한다. [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

초기에는 feature별 reducer + 얇은 Context/repository로 충분한지 검증한다. 공유 상태 범위가 늘어날 때만 별도 store 라이브러리를 추가한다. 같은 사용자 상태를 여러 Context에서 복제하지 않는다. 사진의 장기 저장이 필요해지면 별도 동의/보관 정책 후 IndexedDB 또는 서버로 확장한다.

## 외부 연결 계약

| 계약 | 프로토타입 | 실제 연동 교체 지점 |
|---|---|---|
| AuthService | enterDemo / signOut | OAuth/session 서버 |
| AnalysisService | analyze → 명시적 mock result; abort 지원 | 업로드·job polling/API adapter |
| ImageSearchService | fixture 특징/유사 스타일 | 이미지 embedding/search |
| RecommendationService | 근거 있는 fixture 선택 | 모델/랭킹 API; source/evidence 포함 |
| HairNoteService | 사용자 데이터로 템플릿 초안 | AI 생성 API; 사용자 검토 유지 |
| AvailabilityService | 모의 메뉴/시간 목록 | 실시간 예약 재고 |
| ReservationService | 로컬 모의 저장, idempotency key | 서버 트랜잭션·충돌 처리 |
| ContentRepository | 정규화 JSON/asset manifest | CMS/콘텐츠 API |

공통 결과: success/data/sourceMode 또는 error/code/retryable. UI는 mock adapter의 지연 시간을 가정하지 않는다. 요청 취소, 중복 submit 방지, stale result 무시를 공통으로 처리한다. 실제 API key는 client bundle에 넣지 않는다.

## 의존성 판단

배너/스타일 레일은 CSS scroll-snap과 Pointer Events부터 검토한다. 복잡한 접근성/gesture 요구를 자체 코드로 안정적으로 처리하기 어렵다면 Swiper를 비교한다. 기본 모션은 CSS로 시작하고 Motion은 route/shared transitions가 실제로 필요할 때 추가한다. 폼·query·store 패키지를 미래 가능성만으로 도입하지 않는다.


## 2026-10-12 PHASE 04 반영

PHASE 04 추가: AnalysisHeader / PhotoAlternatives / FieldEditor. 기존 BottomSheet를 native dialog 기반으로 확장하고 고유 제목 ID·초점 복귀·배경/닫기/Escape/드래그 종료를 공통화했다. `src/lib/analysis/profile.ts`는 12개 필드 정의·original/edits·저장소, `service.ts`는 취소 가능한 MockAnalysisService, `photo.ts`는 로컬 사진과 카메라 수명 관리다. 실제 API 연동은 서비스 경계에서 교체하고 UI에서 사진 특징을 추론하지 않는다.
