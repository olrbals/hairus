# HAIRUS

AI 헤어 분석·스타일 큐레이션·디자이너 연결을 위한 모바일 웹 프로토타입입니다. 현재 인증·분석·예약 서버는 연결되어 있지 않습니다. 분석은 사진의 특징을 읽지 않는 고정 데모 데이터이며 사진은 브라우저 메모리에서만 처리합니다.

## 기술 및 디자인 기준

Next.js App Router / React / TypeScript / Tailwind CSS. 세부 버전은 `package.json`과 `pnpm-lock.yaml`을 기준으로 합니다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용합니다. Pretendard 파일과 각 폰트의 OFL 라이선스는 `public/fonts/`에 있으며 Cormorant 두 종류는 설치 시 Fontsource 패키지에서 복원됩니다.

Figma 최신 `1012 코덱스 시연용`(`920:3429`)이 같은 화면의 기존 시연용보다 우선합니다. 최신 섹션에 없으면 기존 시연용, 초안은 기능/UX 참고입니다. `95% 이상 완성`을 최종안으로 자동 채택하지 않습니다.

## 현재 상태

- PHASE 01: Figma 분석·개발 계획 완료. `outputs/`에 한국어 설계 문서 보존.
- PHASE 02: 개발 기반·공통 컴포넌트·폰트·`/ui` 샘플 완료.
- PHASE 03: Splash / Onboarding 01~03 / Login / Welcome 구현.
- PHASE 04: 촬영·파일/샘플 대체 경로·3단계 Mock 분석·결과 수정 구현 중. 12개 분석 항목의 원본/수정값 분리 및 브라우저 저장을 구현했으며 UI 개선과 실기기 검증이 남아 있습니다.
- PHASE 05: 시작하지 않았습니다. Home은 기존 라우팅 기반 화면입니다.

## 설치 및 실행

권장 Node.js **24.x** (`.nvmrc`), 패키지 매니저 **pnpm 11.25.0**. 기존 package.json의 Node 하한은 22지만, 다른 컴퓨터에서는 테스트의 TypeScript 실행까지 맞추기 위해 24.x를 사용하세요. Git도 필요합니다.

```sh
# nvm을 사용하는 경우
nvm install
nvm use
# Node/npm 설치 후 pnpm 준비
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

환경변수는 현재 필요하지 않습니다. `.env.example`은 설명용이며 복사하지 않아도 실행됩니다. 실제 비밀값이 생기면 무시되는 `.env.local` 등에만 보관하고 Git/ZIP에 포함하지 마세요.

- 첫 진입: http://localhost:3000/
- Welcome: http://localhost:3000/welcome
- 촬영 및 샘플: http://localhost:3000/analysis/guide
- 저장된 결과 수정: http://localhost:3000/analysis/result
- 기존 UI 샘플: http://localhost:3000/ui

```sh
# 처음 복제한 폴더는 Next 생성 타입이 없으므로 먼저 생성
pnpm exec next typegen
pnpm typecheck
pnpm test
pnpm build
# 프로덕션 실행 (dev 서버와 동시 실행하지 않기)
pnpm start
```

`next-env.d.ts`, `.next` 타입, `node_modules`는 설치/Next 실행으로 생성됩니다. 소스 백업에 빌드 캐시를 포함하지 않습니다. macOS 제한 환경에서 Turbopack FSEvent 오류가 나면 다음 대체 개발 명령을 사용합니다.

```sh
WATCHPACK_POLLING=true pnpm exec next dev --webpack
```

카메라는 HTTPS 또는 localhost가 필요합니다. 다른 컴퓨터/휴대폰에서 일반 HTTP LAN 주소로 접속할 때는 파일 선택·샘플 사진을 이용하세요. 사용자 사진/프로필의 브라우저 저장 상태는 GitHub로 동기화되지 않습니다.

## 다른 컴퓨터에서 복원

대상 저장소: https://github.com/olrbals/hairus
이번 최초 백업의 대상 브랜치는 **main**입니다. 원격 저장소가 비어 있어 기존 기록이나 파일을 교체하지 않습니다. 실제 Push 결과와 SHA는 별도 백업 보고서를 확인하세요.

```sh
git clone --branch main https://github.com/olrbals/hairus.git
cd hairus
git status --short --branch
git remote -v
git fetch origin
git pull --ff-only origin main
# 위 설치 및 검사 명령 실행
```

ZIP 복원 시 새 빈 폴더에 압축을 풀고 설치 명령을 실행하세요. ZIP에는 `.git`이 없으므로 Git 동기화를 이어가려면 ZIP 위에 덮어쓰지 말고 GitHub를 별도 폴더에 clone하는 방법을 권장합니다.

## Codex에서 이어서 작업

먼저 GitHub 저장소를 로컬에 clone하고, Codex 앱에서 복제한 **hairus 폴더를 프로젝트 폴더로 추가/선택**합니다. 원격 URL만 채팅에 붙이는 것과 로컬 폴더를 여는 것은 다릅니다. CLI를 사용하는 경우 `cd hairus` 후 `codex`를 실행합니다. 기존 채팅 기록은 저장소 clone으로 복원되지 않으므로 README와 `outputs/`를 작업 맥락으로 사용하세요.

공식 안내: https://developers.openai.com/fr-FR/docs/projects

시작 프롬프트 예시:

> 기존 HAIRUS 저장소를 이어서 작업합니다. README와 outputs 문서를 읽고 현재 브랜치와 origin/main 최신 상태부터 확인하세요. PHASE 04의 12개 분석 항목과 상태 관리 코드를 보존하면서 남은 바텀시트 디자인 일관성을 개선하세요. PHASE 05는 시작하지 마세요.

## GitHub 개발 절차

한 컴퓨터에서 작업을 마친 뒤 Push/원격 SHA 확인까지 완료하고 다른 컴퓨터로 이동하세요. 동시에 같은 브랜치의 같은 파일을 수정하지 않는 것이 가장 안전합니다.

```sh
# 작업 시작: 변경이 있으면 pull 전에 커밋하거나 별도 백업
git status --short --branch
git fetch origin
git log --oneline HEAD..origin/main
git pull --ff-only origin main
# PHASE 작업은 고유 브랜치로 분리 가능
git switch -c work/phase04-ui-YYYYMMDD
# 개발 후
pnpm exec next typegen
pnpm typecheck
pnpm test
pnpm build
git diff --check
git diff
# 비밀 파일이 없는지 확인 후 필요한 파일을 명시적으로 추가
git add <검토한-파일경로>
git diff --cached --stat
git diff --cached
git commit -m "fix: refine phase 04 analysis editors"
git push -u origin HEAD
git rev-parse HEAD
git ls-remote origin "refs/heads/$(git branch --show-current)"
```

새 작업 브랜치를 썼다면 다음 컴퓨터에서도 그 브랜치를 checkout해야 합니다. `main`에 자동으로 반영되지 않습니다. 공유 브랜치가 갈라졌거나 충돌이 나면 Force Push/reset으로 덮지 말고 각 컴퓨터의 작업을 보존한 뒤 병합을 검토하세요. 각 PHASE 완료 시 검사→차이 검토→커밋→Push→원격 SHA 확인을 반복합니다. GitHub Actions나 자동 배포는 구성하지 않았습니다.

## 알려진 문제 / 다음 작업

1. 분석 결과 수정 UI의 **얼굴형·기장 시트는 Figma 기준**이지만, **나머지 10개 항목의 바텀시트는 디자인 일관성 개선이 필요**합니다. 이번 백업에서는 수정하지 않습니다.
2. 실제 iOS Safari / Android Chrome 카메라 허용·거절·촬영·재촬영·전후면 전환과 모바일 키보드/스크린리더 검증이 남아 있습니다. 내장 브라우저에서는 카메라 요청이 대기 상태였습니다.
3. 파일 입력은 JPG/PNG/WebP, 10MB 이하. HEIC 미지원.
4. 인증/AI/예약은 실제 서비스가 아닙니다. 결과는 데모임을 안내하며 사용자 수정값을 별도 관리합니다.
5. `outputs/PHASE04_RESULT.md`의 구현 완료 표현은 당시 기능 연결 상태를 뜻합니다. 현재 사용자 확정 상태는 **PHASE 04 진행 중·UI 개선 필요**이며 본 README가 최신 인계 기준입니다.

## 보존 범위

`src/`, `public/`, `tests/`, `outputs/`, `work/`(Figma 조사 원본과 작업 기록), 설정·lockfile·라이선스를 보존합니다. 캐시·의존성 설치 결과·환경변수 비밀값·로그는 제외합니다. Figma 추출 URL은 만료될 수 있지만 현재 사용하는 원본 자산은 `public/`의 로컬 파일입니다. 사진 사용권은 원래 권리 관계를 따르며 이 저장소가 제3자 이미지의 별도 라이선스를 부여하지 않습니다.
