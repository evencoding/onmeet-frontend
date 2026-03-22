# OnMeet — AI 기반 실시간 화상 회의 플랫폼

## 프로젝트 소개

OnMeet은 팀을 위한 화상 회의 플랫폼으로, **실시간 WebRTC 화상 회의**, **AI 회의록 자동 생성**, **팀/일정 관리**를 하나의 서비스에서 제공합니다.

> 배포 URL: https://onmeet.cloud

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18, TypeScript (strict), Vite 7, Tailwind CSS |
| 상태 관리 | TanStack React Query v5, Zustand v5 |
| 실시간 통신 | LiveKit (WebRTC), SSE (fetch + ReadableStream) |
| AI | 실시간 STT, 회의록 요약/재생성 |
| 인프라 | Cloudflare Pages, PWA (VitePWA), Sentry, Firebase Cloud Messaging |

---

## 핵심 기술 구현

### 1. 마이크로서비스 API 통합 — Service Fetch Factory

4개의 백엔드 마이크로서비스(Auth, Video, AI, Notification)의 중복 fetch 로직을 **팩토리 패턴**으로 통합합니다.

```typescript
const roomFetch = createServiceFetch("/video/v1");
const aiFetch   = createServiceFetch("/ai");
const notiFetch = createServiceFetch("/notification");
```

- Content-Type 자동 설정, `X-User-Id` 헤더 주입, 응답 래퍼 파싱
- Auth 서비스: 401 자동 토큰 갱신 (Promise 싱글턴으로 중복 방지)

### 2. 커스텀 SSE 파서 — fetch + ReadableStream

표준 `EventSource`는 커스텀 헤더를 지원하지 않으므로, `X-User-Id` 인증을 위해 **fetch 기반 SSE 파서**를 직접 구현했습니다.

- **실시간 알림** — React Query 캐시 자동 무효화
- **대기실 승인/거절** — Phase 상태 전이
- **실시간 STT** — `useRef` 버퍼 + 주기적 flush로 리렌더 최적화
- 연결 끊김 시 5초 자동 재연결 (AbortController 클린업)

### 3. 화상 회의 Phase 상태 머신

LiveKit WebRTC 화상 회의의 전체 생명주기를 Zustand 상태 머신으로 관리합니다.

```
Preparing -> Joining -> Waiting (대기실 SSE) -> Connected -> Disconnected
    |                     |
    |                     +-> Rejected (거절)
    +-> Error (연결 실패)
```

- 카메라/마이크/스피커 열거, 실시간 프리뷰, 마이크 레벨 측정
- 호스트 퇴장 감지 → 카운트다운 자동 종료

---

## 성능 최적화

- **Route-level lazy loading**: 10+ 페이지 `React.lazy` 동적 로딩
- **Manual chunk splitting**: LiveKit, TipTap, Firebase, Recharts, Framer Motion을 독립 청크로 분리
- **Route prefetching**: 사이드바 hover 시 다음 페이지 모듈 미리 로드
- **React.memo / useShallow**: 회의 컴포넌트 리렌더 최소화
- **프로덕션 빌드**: `esbuild.drop`으로 console/debugger 자동 제거
- **번들 분석**: `pnpm analyze`로 `rollup-plugin-visualizer` 리포트 생성

---

## 보안

- **CSP (Content-Security-Policy)**: Cloudflare Pages(`_headers`) / Netlify(`netlify.toml`) 모두 적용 — `default-src 'self'` 기반 화이트리스트 정책
- **HttpOnly 쿠키 인증**: 토큰을 JavaScript에서 접근 불가한 쿠키에 저장
- **자동 토큰 갱신**: 401 응답 시 Promise 싱글턴으로 refresh 1회만 실행
- **XSS 방지**: DOMPurify로 사용자 입력 HTML 정제 후 렌더링
- **라우트 가드**: ProtectedRoute / GuestRoute / ManagerRoute
- **Vite fs 제한**: `.env`, `.git`, 인증서 파일 접근 차단
- **Sentry 통합**: ErrorBoundary + 404 추적

---

## PWA

VitePWA 기반 Progressive Web App을 지원합니다.

- **정적 에셋 Precaching**: JS, CSS, HTML, 폰트, 아이콘 자동 캐싱
- **API 런타임 캐싱**: NetworkFirst 전략으로 API 응답 캐싱
- **오프라인 내비게이션 폴백**: 오프라인 시 캐시된 `index.html`로 폴백 (API/SSE 경로 제외)
- **자동 업데이트**: 새 버전 배포 시 Service Worker 자동 갱신

---

## 프로젝트 구조

```
client/
├── app/               # 라우팅, ErrorBoundary, 글로벌 설정
├── features/
│   ├── ai/            # AI 회의록 (STT, 요약, 재생성)
│   ├── auth/          # 인증 (로그인, 회원가입, 토큰 갱신)
│   ├── meeting/       # 화상 회의 (LiveKit, 대기실, 녹화)
│   ├── notification/  # 실시간 알림 (SSE, FCM)
│   ├── dashboard/     # 대시보드 + 회의록 뷰어
│   ├── schedule/      # 캘린더 일정 관리
│   ├── settings/      # 프로필, 회사 관리
│   └── team/          # 팀 관리
├── shared/
│   ├── utils/         # createServiceFetch, getErrorMessage, 페이지네이션
│   ├── hooks/         # useSSEStream, useProfileImage
│   ├── components/    # Sidebar, Layout, AuthLayout
│   └── ui/            # shadcn/ui 디자인 시스템
└── pages/             # NotFound
```

각 feature는 `api/`, `hooks/`, `components/`, `pages/`, `store/` 하위 구조로 독립적 모듈 경계를 유지합니다.

---

## 디자인 패턴

- **VAC 패턴**: 대형 페이지(600줄+)를 로직 컨테이너와 순수 UI로 분리 — `CompanyManagement`(597→225L), `MyPage`(596→213L)
- **Custom Hook 추출**: 디바이스 관리(`useMeetingDevices`), 마이크 테스트(`useMicTest`), SSE 구독(`useWaitingRoomSSE`)
- **Compound Components**: Radix UI 기반 합성 컴포넌트로 Prop Drilling 방지

---

## 실행 방법

```bash
pnpm install              # 의존성 설치
cp .env.example .env      # 환경변수 설정

pnpm dev                  # 개발 서버 (http://localhost:8080)
pnpm typecheck            # 타입 체크
pnpm build                # 프로덕션 빌드
pnpm analyze              # 번들 분석 리포트
pnpm deploy               # 배포 (Cloudflare Pages)
```
