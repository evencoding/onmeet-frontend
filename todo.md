# OnMeet Frontend — 기술 구현 사항 & 개선 로드맵

## 목차

1. [프로젝트 아키텍처](#1-프로젝트-아키텍처)
2. [실시간 통신 전략](#2-실시간-통신-전략)
3. [API 계층 설계](#3-api-계층-설계)
4. [상태 관리 전략](#4-상태-관리-전략)
5. [성능 최적화](#5-성능-최적화)
6. [보안](#6-보안)
7. [스트림 기반 파일 처리](#7-스트림-기반-파일-처리)
8. [디자인 패턴](#8-디자인-패턴)
9. [리팩토링 이력](#9-리팩토링-이력)
10. [개선 로드맵](#10-개선-로드맵)

---

## 1. 프로젝트 아키텍처

### 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 + TypeScript (SWC) |
| 빌드 / 배포 | Vite 7 + Cloudflare Pages (Edge) |
| 스타일링 | Tailwind CSS 3 + Radix UI + shadcn/ui |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| 화상 회의 | LiveKit (WebRTC) |
| 에디터 | TipTap (ProseMirror) |
| 모니터링 | Sentry |
| 푸시 알림 | Firebase Cloud Messaging |

### Feature-Based 모듈 구조

```
client/
├── app/           # 라우팅, 프리페칭, 글로벌 설정
├── features/
│   ├── ai/        # AI 회의록 (STT, 요약, 재생성)
│   ├── auth/      # 인증 (로그인, 회원가입, 토큰 갱신)
│   ├── dashboard/ # 대시보드 (회의 목록, 회의록 뷰어)
│   ├── meeting/   # 화상 회의 (LiveKit, 대기실, 화면공유, 녹화)
│   ├── notification/ # 알림 (SSE, FCM, 설정)
│   ├── schedule/  # 일정 관리
│   ├── settings/  # 설정 (프로필, 회사 관리)
│   └── team/      # 팀 관리
├── shared/
│   ├── components/  # 공유 컴포넌트 (Sidebar, AuthLayout, PageLoader)
│   ├── hooks/       # 공유 훅 (useSSEStream, useProfileImage)
│   ├── lib/         # 외부 라이브러리 설정 (Firebase)
│   ├── ui/          # shadcn/ui 기반 디자인 시스템
│   └── utils/       # 유틸리티 (apiFetch, api, sanitize)
└── pages/           # 글로벌 페이지 (NotFound)
```

각 feature는 `api/`, `hooks/`, `components/`, `pages/`, `store/` 하위 구조로 독립적 모듈 경계를 유지한다. Feature 간 의존은 `@/features/xxx` 절대 경로로 명시적 import.

---

## 2. 실시간 통신 전략

### 2-1. LiveKit WebRTC — 화상 회의

- `@livekit/components-react` 기반 화상 회의 구현
- **입장 플로우**: Preparing → Joining → Waiting (대기실) → Connected
- **Phase 기반 상태 머신**: Zustand store에서 `phase` 관리로 각 단계별 UI 분기
- **디바이스 관리**: 카메라/마이크/스피커 열거, 프리뷰 스트림, 마이크 레벨 측정 (AudioContext + AnalyserNode)
- **호스트 퇴장 감지**: `RoomEvent.ParticipantDisconnected` 리스너로 호스트 메타데이터 확인 → 카운트다운 후 자동 종료

### 2-2. SSE (Server-Sent Events) — 실시간 알림 & 대기실

EventSource API는 커스텀 헤더(`X-User-Id`)를 지원하지 않으므로, **fetch + ReadableStream** 기반 SSE 파서를 직접 구현:

```
fetch(sseUrl, { headers: { "X-User-Id": userId } })
  → response.body.getReader()
  → TextDecoder로 청크 파싱
  → "data:" 라인 추출 → JSON.parse → 콜백 실행
```

- **알림 SSE** (`useNotificationSSE`): 실시간 알림 수신 → React Query 캐시 무효화
- **대기실 SSE** (`useWaitingRoomSSE`): 입장 승인/거절 이벤트 실시간 수신
- **자동 재연결**: 연결 끊김 시 5초 간격 재연결, AbortController로 클린업

### 2-3. 실시간 STT (Speech-to-Text)

- 회의 중 LiveKit 오디오 트랙 → AI 서비스로 실시간 전사
- SSE 스트림으로 전사 결과 수신
- **Throttling 전략**: raw 데이터는 `useRef`에 버퍼링, 문장 완성 또는 일정 주기(200~300ms)마다 상태 업데이트 → 불필요한 리렌더 방지
- 스트림 종료 시 `queryClient.invalidateQueries`로 서버 데이터와 최종 동기화

---

## 3. API 계층 설계

### 마이크로서비스 게이트웨이 구조

프론트엔드는 4개의 백엔드 마이크로서비스와 통신한다:

```
API Gateway (api.onmeet.cloud)
├── /auth/*    → Auth Service     (인증, 회원, 관리자)
├── /video/*   → Video Service    (회의실, 참여자, 녹화, 화면공유)
├── /ai/*      → AI Service       (STT, 회의록, 요약)
└── /notification/* → Notification Service (알림, FCM, 설정)
```

### Service Fetch Factory 패턴

4개 서비스의 중복 fetch 로직을 팩토리 함수로 통합:

```typescript
// shared/utils/apiFetch.ts
export function createServiceFetch(baseUrl: string) {
  return async function serviceFetch<T>(
    endpoint: string, userId: string, options?: RequestInit
  ): Promise<T> {
    // Content-Type 자동 설정 (FormData 제외)
    // X-User-Id 헤더 자동 주입
    // { success, data } 래퍼 자동 파싱
    return apiFetch<T>(`${baseUrl}${endpoint}`, { ...options, headers });
  };
}

// 각 서비스에서 한 줄로 생성
const roomFetch = createServiceFetch(VIDEO_BASE_URL);
const aiFetch   = createServiceFetch(AI_BASE_URL);
const notiFetch = createServiceFetch(NOTI_BASE_URL);
```

### Auth Service — 토큰 갱신 자동화

Auth 서비스는 쿠키 기반 인증 + 자동 토큰 갱신을 사용하므로 별도 fetch wrapper 구현:

```
요청 → 401 응답 → refreshPromise 싱글턴 생성 → /v1/refresh 호출
                                               ↓ 성공 시 원래 요청 재시도
                                               ↓ 실패 시 에러 전파
```

- **Promise 싱글턴**: 동시 다발 401 발생 시 refresh 요청 중복 방지
- **순환 방지**: `/v1/refresh`, `/v1/login` 엔드포인트는 자동 갱신 제외

### 공유 페이지네이션 타입

`Pageable`, `Page<T>`, `PageResponse<T>` 등 페이지네이션 인터페이스를 `shared/utils/api.ts`에 통합하고, 각 서비스에서 re-export하여 타입 중복 제거.

---

## 4. 상태 관리 전략

### 서버 상태 — TanStack React Query v5

| 용도 | 패턴 |
|------|------|
| 데이터 조회 | `useQuery` + 커스텀 훅 (`useRoom`, `useMinutes`) |
| 데이터 변경 | `useMutation` + `onSuccess`에서 캐시 무효화 |
| 캐시 키 관리 | 서비스별 `queryKey` 팩토리 (`roomKeys`, `aiKeys`, `notiKeys`) |
| SSE → 캐시 동기화 | SSE 이벤트 수신 시 `invalidateQueries`로 서버 재조회 |

### 클라이언트 상태 — Zustand v5

- **`useMeetingRoomStore`**: 회의 phase, 디바이스 선택, LiveKit 토큰, 대기실 거절 상태 등 회의실 전체 생명주기 관리
- **Context 주입 패턴**: 동일 페이지 내 복수 회의창이 필요한 경우, Store 인스턴스를 React Context로 주입하여 독립 상태 보장
- **`useShallow`**: 필요한 필드만 선택적 구독 → 불필요한 리렌더 최소화

### 상태 분류 원칙

```
서버 원본 데이터 → React Query (캐시, 자동 갱신, 에러 핸들링)
UI 로컬 상태    → useState (모달 열림, 폼 입력)
글로벌 공유 상태 → Zustand (회의 phase, 디바이스 상태)
고빈도 갱신 데이터 → useRef (STT 버퍼, AudioContext)
```

---

## 5. 성능 최적화

### 코드 스플리팅

```typescript
// Route-level lazy loading
const MeetingRoom = lazy(() => import("@/features/meeting/pages/MeetingRoom"));
const Schedule    = lazy(() => import("@/features/schedule/pages/Schedule"));
const Summary     = lazy(() => import("@/features/dashboard/pages/Summary"));
// ... 10+ lazy routes
```

### Manual Chunk Splitting (Vite)

대형 라이브러리를 독립 청크로 분리하여 캐시 효율 극대화:

| 청크 | 내용 | 변경 빈도 |
|------|------|-----------|
| `vendor` | react, react-dom, react-router-dom | 낮음 |
| `query` | @tanstack/react-query | 낮음 |
| `livekit` | livekit-client, @livekit/components-react | 낮음 |
| `editor` | @tiptap/* (ProseMirror 에디터) | 낮음 |
| `firebase` | firebase/app, firebase/analytics | 낮음 |
| `charts` | recharts | 낮음 |
| `motion` | framer-motion | 낮음 |

### Route Prefetching

```typescript
// routePrefetchMap.ts — 마우스 호버 시 다음 페이지 모듈 미리 로드
const prefetchMap = {
  "/schedule": () => import("@/features/schedule/pages/Schedule"),
  "/mypage":   () => import("@/features/settings/pages/MyPage"),
  // ...
};
```

### React.memo 최적화

리렌더 빈도가 높은 회의 컴포넌트에 `React.memo` 적용:

- `ParticipantTile` — 참가자 수만큼 렌더되는 타일
- `VideoGrid` — 비디오 그리드 레이아웃
- `MeetingToolbar` — 회의 도구 모음
- `ChatPanel` — 채팅 패널
- `ParticipantsPanel` — 참여자 목록
- `Sidebar` — 전역 네비게이션

### 프로덕션 빌드 최적화

```typescript
// vite.config.ts
esbuild: {
  drop: mode === "production" ? ["console", "debugger"] : [],
}
```

프로덕션 빌드에서 `console.*`과 `debugger` 문을 자동 제거하여 번들 크기 감소 및 정보 노출 방지.

### optimizeDeps

Vite의 사전 번들링 대상에 자주 사용하는 라이브러리를 명시하여 콜드 스타트 시간 단축:
`lucide-react`, `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `framer-motion`

---

## 6. 보안

### XSS 방지

- 사용자 입력 HTML (회의록 등)은 `DOMPurify.sanitize()`로 정제 후 `dangerouslySetInnerHTML`에 주입
- TipTap 에디터 출력도 동일하게 sanitize 처리

### 인증 보안

- **HttpOnly 쿠키 기반 인증**: 토큰을 JavaScript에서 접근 불가한 쿠키에 저장
- **자동 토큰 갱신**: 401 응답 시 refresh 엔드포인트 호출, Promise 싱글턴으로 중복 방지
- **GuestRoute 가드**: 인증된 사용자가 로그인/회원가입 페이지 접근 시 자동 리다이렉트
- **ProtectedRoute 가드**: 미인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트

### Vite 서버 파일 접근 제한

```typescript
server: {
  fs: {
    allow: ["./client"],
    deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
  }
}
```

### 에러 처리 통합

- `getErrorMessage(err, fallback)` 유틸로 4가지 에러 패턴을 단일 함수로 통합
- API 에러 객체, Error 인스턴스, unknown 타입 모두 안전하게 메시지 추출

### 404 에러 모니터링

- `NotFound` 페이지에서 `Sentry.captureMessage()`로 잘못된 경로 접근을 자동 추적

---

## 7. 스트림 기반 파일 처리

### 이미지 및 소형 파일

- `responseType: 'blob'`으로 데이터 수신 후 `URL.createObjectURL(blob)` 사용
- 메모리 효율적이며 브라우저 캐시와 호환

### 대용량 녹음본 및 문서

- **File System Access API** (`FileSystemWritableFileStream`): 브라우저 메모리를 거치지 않고 사용자 하드디스크에 직접 스트림 쓰기
- 수백 MB 녹음 파일도 메모리 부족 없이 다운로드 가능

### 실시간 진행률 표시

```
fetch(url)
  → response.body.getReader()
  → Content-Length 대비 수신 바이트 계산
  → Progress UI 업데이트
```

---

## 8. 디자인 패턴

### VAC 패턴 (View Asset Component)

대형 페이지 컴포넌트를 **로직(Container)**과 **UI(Presentational)**로 철저히 분리:

```
CompanyManagement.tsx (225L) — 모든 훅, 상태, 핸들러
├── CompanyInfoTab.tsx  (69L) — 회사 정보 UI
├── EmployeesTab.tsx   (126L) — 직원 목록 UI
└── TeamsTab.tsx        (317L) — 팀 관리 UI

MyPage.tsx — 모든 훅, 상태, 핸들러
├── ProfileTab.tsx         — 프로필 편집 UI
├── SettingsTab.tsx        — 설정 UI
└── DeleteAccountModal.tsx — 탈퇴 확인 모달
```

### Custom Hook 추출 패턴

복잡한 side-effect 로직을 커스텀 훅으로 추출하여 컴포넌트 경량화:

```
MeetingPreparationModal (435L → 332L)
├── useMeetingDevices — 디바이스 열거, 카메라 프리뷰, 스트림 관리
└── useMicTest        — 마이크 테스트 (AudioContext, AnalyserNode, 레벨 측정)
```

### Compound Components

- Radix UI 기반 Compound Components로 Prop Drilling 방지 및 UI 유연성 확보
- `Dialog`, `Toast`, `Tooltip`, `AlertDialog` 등 합성 컴포넌트 활용

---

## 9. 리팩토링 이력

### HIGH 우선순위 (완료)

- [x] **Fetch wrapper 통합**: 4개 서비스의 중복 fetch 로직 → `createServiceFetch` 팩토리 패턴
- [x] **auth/api.ts 분리**: 471줄 단일 파일 → `types.ts`, `auth-fetch.ts`, `auth.ts`, `member.ts`, `manager.ts` (5개 모듈)
- [x] **대형 컴포넌트 분리**: CompanyManagement(597L→225L), MyPage(596L→213L), MeetingPreparationModal(435L→332L)

### MEDIUM 우선순위 (완료)

- [x] **페이지네이션 타입 중복 제거**: 4곳에 분산된 `Pageable`, `Page<T>` 등 → `shared/utils/api.ts` 통합
- [x] **에러 타입 가드**: `getErrorMessage(err, fallback)` 유틸 추가, 4개 파일 6곳 적용

### 추가 리팩토링 (완료)

- [x] **React.StrictMode 적용**: `main.tsx`에서 개발 모드 부작용 조기 발견
- [x] **React.memo 적용**: ParticipantTile, ParticipantsPanel, Sidebar (VideoGrid, MeetingToolbar, ChatPanel은 기적용)
- [x] **프로덕션 console 제거**: `esbuild.drop: ["console", "debugger"]` 설정
- [x] **NotFound → Sentry**: `console.error` → `Sentry.captureMessage` 교체
- [x] **ESLint 강화**: `no-unused-vars: warn`, `no-console: warn` 활성화
- [x] **.env.example 생성**: 시크릿 없는 환경변수 템플릿

---

## 10. 개선 로드맵

### P0 — 즉시 적용

- [x] ~~React.StrictMode 적용~~ (완료)
- [x] ~~.env.example 파일 생성~~ (완료)
- [x] ~~React.memo 적용~~ (완료)
- [x] ~~프로덕션 console 자동 제거~~ (완료)
- [x] ~~ESLint 규칙 강화~~ (완료)
- [ ] TypeScript strict 모드 점진적 활성화 (`strictNullChecks` → `strict: true`)
- [ ] favicon.ico 최적화 (1.3MB → <100KB)

### P1 — 단기 (1~2주)

- [ ] CI 파이프라인 구축 (lint + typecheck + test on PR)
- [ ] Husky + lint-staged로 커밋 전 자동 포맷팅/린트
- [ ] Open Graph / Twitter Card 메타 태그 추가
- [ ] 컴포넌트 테스트 기반 마련 (Vitest + React Testing Library + MSW)

### P2 — 중기 (3~4주)

- [ ] 접근성(a11y) 개선: aria-label, 키보드 네비게이션, 포커스 관리
- [ ] 이미지 최적화 (WebP 변환, `loading="lazy"`, srcset 반응형)
- [ ] PWA (Service Worker) 오프라인 지원
- [ ] 번들 분석기 도입 (`rollup-plugin-visualizer`)
- [ ] SSE 데이터 → 상태 Throttling 최적화 (useRef 버퍼 + 주기적 상태 반영)

### P3 — 장기

- [ ] E2E 테스트 (Playwright)
- [ ] i18n 지원 (react-i18next)
- [ ] CSP 헤더 설정
- [ ] Structured Data (JSON-LD) SEO
