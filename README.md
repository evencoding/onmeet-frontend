# OnMeet — AI 기반 실시간 화상 회의 플랫폼

## 프로젝트 소개

OnMeet은 팀을 위한 화상 회의 플랫폼으로, **실시간 WebRTC 화상 회의**, **AI 회의록 자동 생성**, **팀/일정 관리**를 하나의 서비스에서 제공합니다.

> 배포 URL: https://onmeet.cloud

---

## 기술 스택

**Frontend**: React 18, TypeScript, Vite 7, Tailwind CSS, Zustand, TanStack React Query v5

**실시간 통신**: LiveKit (WebRTC), SSE (fetch + ReadableStream)

**AI**: 실시간 STT, AI 회의록 요약/재생성

**인프라**: Cloudflare Pages (Edge), Sentry, Firebase Cloud Messaging

---

## 핵심 기술 구현

### 1. 마이크로서비스 API 통합 — Service Fetch Factory

프론트엔드는 4개의 백엔드 마이크로서비스(Auth, Video, AI, Notification)와 통신합니다. 각 서비스의 중복 fetch 로직을 **팩토리 패턴**으로 통합하여 단일 함수로 API 클라이언트를 생성합니다.

```typescript
// 팩토리 함수 한 줄로 서비스별 fetch 생성
const roomFetch = createServiceFetch("/video/v1");
const aiFetch   = createServiceFetch("/ai");
const notiFetch = createServiceFetch("/notification");
```

- Content-Type 자동 설정 (FormData 감지 시 제외)
- `X-User-Id` 헤더 자동 주입
- `{ success, data }` 응답 래퍼 자동 파싱
- Auth 서비스는 **401 자동 토큰 갱신** (Promise 싱글턴으로 동시 요청 중복 방지)

### 2. 커스텀 SSE 파서 — fetch + ReadableStream

표준 `EventSource` API는 커스텀 헤더를 지원하지 않습니다. 인증에 `X-User-Id` 헤더가 필요하므로 **fetch 기반 SSE 파서**를 직접 구현했습니다.

```
fetch(url, { headers: { "X-User-Id": userId } })
  -> response.body.getReader()
  -> TextDecoder 스트림 파싱
  -> "data:" 라인 추출 -> JSON.parse -> 이벤트 콜백
  -> 연결 끊김 시 5초 자동 재연결 (AbortController 클린업)
```

적용 영역:
- **실시간 알림** (`useNotificationSSE`) — React Query 캐시 자동 무효화
- **대기실 승인/거절** (`useWaitingRoomSSE`) — Phase 상태 전이
- **실시간 STT** (`useMeetingSTT`) — 전사 결과 스트리밍

### 3. 화상 회의 Phase 상태 머신

LiveKit WebRTC 기반 화상 회의의 전체 생명주기를 Zustand 상태 머신으로 관리합니다.

```
Preparing -> Joining -> Waiting (대기실 SSE) -> Connected -> Disconnected
    |                     |
    |                     +-> Rejected (거절)
    +-> Error (연결 실패)
```

- **디바이스 관리**: 카메라/마이크/스피커 열거, 실시간 프리뷰, 마이크 레벨 측정 (AudioContext + AnalyserNode)
- **호스트 퇴장 감지**: `RoomEvent.ParticipantDisconnected` -> 메타데이터 확인 -> 카운트다운 자동 종료
- **비밀번호 잠금 방**: 방 정보 조회 후 `locked` 상태에 따라 비밀번호 입력 UI 동적 표시

### 4. STT 데이터 Throttling 전략

AI가 실시간으로 생성하는 STT 데이터의 고빈도 업데이트로 인한 리렌더링을 최적화합니다.

```
SSE 수신 데이터 -> useRef 버퍼 (리렌더 없음)
               -> 문장 완성 또는 200~300ms 주기 -> useState 반영 (리렌더)
               -> 스트림 종료 -> queryClient.invalidateQueries (서버 동기화)
```

### 5. 상태 관리 분류 원칙

데이터 특성에 따라 4가지 상태 관리 전략을 구분합니다.

| 데이터 특성 | 도구 | 예시 |
|-------------|------|------|
| 서버 원본 데이터 | React Query | 회의 목록, 사용자 정보, 회의록 |
| UI 로컬 상태 | useState | 모달 열림, 폼 입력, 탭 선택 |
| 글로벌 공유 상태 | Zustand | 회의 phase, 디바이스 설정 |
| 고빈도 갱신 데이터 | useRef | STT 버퍼, AudioContext, 타이머 |

---

## 성능 최적화

### 코드 스플리팅 전략

- **Route-level lazy loading**: 10+ 페이지를 `React.lazy`로 동적 로딩
- **Manual chunk splitting**: 대형 라이브러리(LiveKit, TipTap, Firebase, Recharts, Framer Motion)를 독립 청크로 분리하여 브라우저 캐시 효율 극대화
- **Route prefetching**: 사이드바 메뉴 hover 시 다음 페이지 모듈 미리 로드

### 리렌더 최적화

- **React.memo**: ParticipantTile, VideoGrid, MeetingToolbar, ChatPanel, ParticipantsPanel, Sidebar
- **useShallow**: Zustand store에서 필요한 필드만 선택적 구독
- **프로덕션 빌드**: `esbuild.drop`으로 console/debugger 자동 제거

### 빌드 결과

```
vendor.js    163 kB (gzip: 53 kB)   -- React 코어
livekit.js   478 kB (gzip: 126 kB)  -- WebRTC 엔진
editor.js    375 kB (gzip: 118 kB)  -- 리치텍스트 에디터
index.js     298 kB (gzip: 83 kB)   -- 앱 코드
빌드 시간: ~6초
```

---

## 보안

- **HttpOnly 쿠키 인증**: 토큰을 JavaScript에서 접근 불가한 쿠키에 저장
- **자동 토큰 갱신**: 401 응답 시 Promise 싱글턴으로 refresh 1회만 실행, 재시도
- **XSS 방지**: DOMPurify로 사용자 입력 HTML 정제 후 렌더링
- **라우트 가드**: ProtectedRoute(인증 필수), GuestRoute(비인증만), ManagerRoute(관리자만)
- **Vite fs 제한**: `.env`, `.git`, 인증서 파일 접근 차단
- **Sentry 통합**: ErrorBoundary + 404 추적 + 에러 리포팅

---

## 프로젝트 구조

```
client/
├── app/                    # 라우팅, ErrorBoundary, 글로벌 설정
├── features/
│   ├── ai/                 # AI 회의록 (STT, 요약, 재생성)
│   │   ├── api.ts          # API 함수 + 타입
│   │   └── hooks.ts        # React Query 훅
│   ├── auth/               # 인증 (로그인, 회원가입, 토큰 갱신)
│   │   ├── api/            # auth-fetch, types, auth, member, manager
│   │   ├── context.tsx     # AuthProvider + useAuth
│   │   ├── hooks.ts        # React Query 훅
│   │   └── pages/          # Login, Signup, PasswordReset
│   ├── meeting/            # 화상 회의
│   │   ├── api/            # room, participant, recording, chat 등
│   │   ├── hooks/          # useRoom, useWaitingRoomSSE, useMeetingSTT 등
│   │   ├── components/     # VideoGrid, ParticipantTile, ChatPanel 등
│   │   ├── store/          # useMeetingRoomStore (Zustand)
│   │   └── pages/          # MeetingRoom
│   ├── notification/       # 실시간 알림
│   │   ├── api.ts          # 알림 CRUD + 설정
│   │   └── hooks.ts        # useNotificationSSE, FCM 연동
│   ├── dashboard/          # 대시보드 + 회의록 뷰어
│   ├── schedule/           # 캘린더 일정 관리
│   ├── settings/           # 프로필, 회사 관리
│   └── team/               # 팀 관리
├── shared/
│   ├── utils/
│   │   ├── apiFetch.ts     # createServiceFetch, getErrorMessage
│   │   └── api.ts          # Pageable, Page<T>, pageQs
│   ├── hooks/              # useSSEStream, useProfileImage
│   ├── components/         # Sidebar, Layout, AuthLayout
│   └── ui/                 # shadcn/ui 디자인 시스템
└── pages/                  # NotFound
```

---

## 디자인 패턴

### VAC 패턴 (Container/Presentational 분리)

대형 페이지 컴포넌트(600줄 이상)를 로직 컨테이너와 순수 UI 컴포넌트로 분리:

- `CompanyManagement.tsx` (597L -> 225L) -> CompanyInfoTab, EmployeesTab, TeamsTab
- `MyPage.tsx` (596L -> 213L) -> ProfileTab, SettingsTab, DeleteAccountModal

### Custom Hook 추출

복잡한 side-effect 로직을 재사용 가능한 훅으로 추출:

- `useMeetingDevices` -- 디바이스 열거, 카메라 프리뷰 스트림 관리
- `useMicTest` -- 마이크 테스트 (AudioContext, AnalyserNode, 레벨 측정)
- `useWaitingRoomSSE` -- 대기실 SSE 구독, 자동 재연결

### Compound Components

Radix UI 기반으로 Dialog, Toast, Tooltip, AlertDialog 등을 합성 컴포넌트로 구성하여 Prop Drilling 방지.

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력

# 개발 서버
pnpm dev          # http://localhost:8080

# 타입 체크
pnpm typecheck

# 빌드
pnpm build

# 배포 (Cloudflare Pages)
pnpm deploy
```
