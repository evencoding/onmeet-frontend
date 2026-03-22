# OnMeet 테스트 문서

## 테스트 환경

| 항목 | 기술 |
|------|------|
| 테스트 러너 | Vitest 3.2.4 |
| DOM 환경 | jsdom 25 |
| 컴포넌트 테스트 | @testing-library/react 16 |
| DOM 매처 | @testing-library/jest-dom 6 |
| 사용자 이벤트 | @testing-library/user-event 14 |
| E2E | Playwright 1.58 |

### 설정 파일

- **`vitest.config.ts`** — 전역 설정 (jsdom, globals, path alias)
- **`client/__tests__/setup.ts`** — jest-dom 매처 초기화
- **`playwright.config.ts`** — E2E 설정 (Chromium, localhost:8080)

---

## 실행 명령어

```bash
pnpm test              # 전체 테스트 1회 실행
pnpm test:watch        # 감시 모드 (파일 변경 시 자동 실행)
pnpm test:e2e          # Playwright E2E 테스트
```

---

## 테스트 현황 요약

**17개 파일, 147개 테스트 케이스** — 전체 통과

---

## 테스트 파일 상세

### 1. Shared Utils

#### `client/shared/utils/api.test.ts` — 10 tests
`pageQs()` 쿼리 스트링 헬퍼 함수 테스트

- `undefined`/빈 객체 → 빈 문자열 반환
- `page`, `size`, `sort` 개별/조합 파라미터 생성
- 복수 sort 파라미터 (`append`)
- edge case: `page=0` (falsy이지만 유효), 빈 sort 배열

#### `client/shared/utils/apiFetch.test.ts` — 13 tests (기존)
API 통신 레이어 테스트

- **`getErrorMessage()`** — Error 인스턴스, 객체, fallback 추출
- **`parseResponseBody()`** — `{ success, data }` 래퍼 언래핑, 에러 throw, 빈 문자열
- **`apiFetch()`** — 성공 응답, 비정상 응답, JSON 파싱 실패
- **`createServiceFetch()`** — baseUrl 프리펜드, X-User-Id 주입, FormData Content-Type 스킵

### 2. Shared Hooks

#### `client/shared/hooks/useDocumentTitle.test.ts` — 3 tests
`useDocumentTitle()` 훅 테스트

- `document.title` 설정 확인
- 값 변경 시 title 업데이트
- 빈 문자열 처리

#### `client/shared/hooks/use-mobile.test.ts` — 5 tests
`useIsMobile()` 반응형 훅 테스트

- 데스크톱(≥768px) → `false`, 모바일(<768px) → `true`
- viewport 변경 감지 (matchMedia 이벤트 시뮬레이션)
- 올바른 breakpoint 쿼리 (`max-width: 767px`)
- unmount 시 이벤트 리스너 클린업

#### `client/shared/hooks/useThrottledValue.test.ts` — 7 tests
`useThrottledValue()` 훅 테스트 (fake timer 사용)

- 초기값 즉시 반환
- 빠른 변경 시 throttle (interval ms 내 무시)
- `flushOn` 문자열 감지 시 즉시 flush
- 비문자열 값에서 flushOn 무시
- 기본 interval 200ms 확인
- unmount 시 타이머 클린업
- interval 경과 후 즉시 flush

#### `client/shared/hooks/useSSEStream.test.ts` — 10 tests
`useSSEStream()` SSE 실시간 데이터 스트림 훅 테스트

- `url=null` 시 미연결
- 연결/해제 상태 관리 (`connected`)
- 메시지 버퍼링 + throttleMs 후 flush
- `flushBoundary` 문자열 감지 시 즉시 flush
- `end` 이벤트 → `ended=true`, 연결 해제
- `reset()` → 전체 상태 초기화
- `close()` → 연결 종료
- 잘못된 JSON 스킵 (에러 무시)
- 에러 발생 시 `reconnectMs` 후 재연결
- 커스텀 `parse` 함수 지원

#### `client/shared/hooks/use-toast.test.ts` — 11 tests
Toast 리듀서 순수 함수 테스트

- **ADD_TOAST** — 빈 상태에 추가, 최신 toast 선두 배치, TOAST_LIMIT(1) 준수
- **UPDATE_TOAST** — ID 매칭 toast 업데이트, 미매칭 toast 미변경
- **DISMISS_TOAST** — 특정/전체 toast `open=false`, 미매칭 toast 미변경
- **REMOVE_TOAST** — 특정 toast 제거, 전체 제거, 미매칭 시 미변경

#### `client/shared/hooks/query-factory.test.ts` — 6 tests
React Query 훅 팩토리 테스트 (QueryClient 래퍼)

- **`createQueryHook()`** — 기본 쿼리 훅 생성, 파라미터 전달, defaultOptions 적용
- **`createMutationHook()`** — 뮤테이션 훅 생성, onSuccess 콜백, invalidateKeys 자동 무효화

### 3. Auth

#### `client/features/auth/context.test.tsx` — 7 tests (기존)
`useAuth()` 컨텍스트 훅 테스트

- Provider 외부 사용 시 에러 throw
- `isAuthenticated` 파생 (user 존재 여부)
- `isManager` 파생 (MANAGER/ADMIN 역할)
- `isPasswordReset` 파생

#### `client/features/auth/api/auth-fetch.test.ts` — 8 tests
인증 API 레이어 테스트

- **`buildFormData()`** — JSON Blob 첨부, profileImage 첨부/미첨부, 복합 데이터 직렬화
- **`authFetch()`** — credentials + Content-Type 설정, FormData Content-Type 스킵, 비정상 응답 에러 throw, 401 자동 토큰 갱신 + 재시도

### 4. Meeting

#### `client/features/meeting/store/useMeetingRoomStore.test.ts` — 12 tests (기존)
Zustand 회의 상태 관리 테스트

- 초기 상태 검증 (phase, token, isHost, isMuted, isVideoOn 등)
- setter 함수 (setPhase, setToken, setIsHost, setViewMode)
- toggle 함수 (toggleMuted, toggleVideoOn, toggleChat, toggleParticipants)
- 채팅 메시지 큐 (addChatMessage)
- AI 요청 큐 (addPendingAIRequest, removePendingAIRequest — FIFO)
- reset → 초기 상태 복원

#### `client/features/meeting/query-keys.test.ts` — 26 tests
React Query 키 팩토리 테스트

- 기본 키: `all`, `lists`, `scheduled`, `history`, `favorites`
- 파라미터화 키: `list(params)`, `searchByTag(tag)`, `detail(roomId)`, `byCode(code)`
- 중첩 리소스: `settings`, `stats`, `timeline`, `participants`, `participantHistory`
- 대기실/녹화/초대/화면공유/STT: `waiting`, `recordings`, `recordingStatus`, `invitations`, `activeScreenShares`, `stt`, `sttTranscript`
- 월별 통계: `monthlyStats`
- 키 계층 구조: detail 키가 all 키를 prefix로 포함, sub-resource가 detail을 prefix로 포함

### 5. Notification

#### `client/features/notification/api.test.ts` — 5 tests
`getUnreadTotal()` 순수 함수 테스트

- 빈 객체 → 0
- 단일/다중 카테고리 합산
- 모든 값 0 → 0
- 큰 숫자 합산

#### `client/features/notification/hooks.test.ts` — 8 tests
`notiKeys` 쿼리 키 팩토리 테스트

- `all`, `user`, `lists`, `list(pageable)`, `unreadCount`, `settings` 키 생성
- 다른 userId → 다른 키 생성 확인

### 6. AI

#### `client/features/ai/hooks.test.ts` — 5 tests
`aiKeys` 쿼리 키 팩토리 테스트

- `minutes(roomId)`, `transcript(roomId)` 키 생성
- 다른 roomId → 다른 키
- minutes ≠ transcript (동일 roomId)
- 공통 `"ai"` prefix

### 7. App

#### `client/app/App.test.tsx` — 6 tests (기존)
라우트 가드 테스트

- **GuestRoute** — 미인증 시 렌더, 인증 시 리다이렉트
- **ProtectedRoute** — 인증 시 렌더, 미인증 시 `/login` 리다이렉트
- **ManagerRoute** — 매니저 역할 시 렌더, 비매니저 시 `/` 리다이렉트

### 8. UI Utils

#### `client/shared/lib/utils.spec.ts` — 5 tests (기존)
`cn()` 클래스명 병합 유틸리티 테스트

- 기본 병합, 조건부 클래스, falsy 처리, Tailwind 충돌 해소, 객체 표기법

---

## 테스트 패턴

### Mock 전략

| 대상 | 방법 |
|------|------|
| 모듈 | `vi.mock()` |
| 함수 | `vi.fn()` |
| 전역 API (fetch) | `vi.stubGlobal()` |
| 타이머 | `vi.useFakeTimers()` + `vi.advanceTimersByTime()` |
| 브라우저 API (matchMedia) | `vi.spyOn(window, ...)` |
| EventSource | 커스텀 MockEventSource 클래스 |

### 훅 테스트 래퍼

```typescript
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Zustand 스토어 테스트

```typescript
const { getState } = useMeetingRoomStore;

beforeEach(() => {
  getState().reset(); // 테스트 격리
});

it("toggleMuted flips isMuted", () => {
  getState().toggleMuted();
  expect(getState().isMuted).toBe(true);
});
```

---

## 디렉토리 구조

```
client/
├── __tests__/setup.ts                          # jest-dom 초기화
├── app/App.test.tsx                            # 라우트 가드
├── features/
│   ├── auth/
│   │   ├── context.test.tsx                    # useAuth 훅
│   │   └── api/auth-fetch.test.ts              # authFetch, buildFormData
│   ├── meeting/
│   │   ├── query-keys.test.ts                  # roomKeys 팩토리
│   │   └── store/useMeetingRoomStore.test.ts    # Zustand 스토어
│   ├── notification/
│   │   ├── api.test.ts                         # getUnreadTotal
│   │   └── hooks.test.ts                       # notiKeys 팩토리
│   └── ai/
│       └── hooks.test.ts                       # aiKeys 팩토리
└── shared/
    ├── hooks/
    │   ├── useDocumentTitle.test.ts             # 문서 제목
    │   ├── use-mobile.test.ts                  # 반응형 감지
    │   ├── useThrottledValue.test.ts           # 값 throttle
    │   ├── useSSEStream.test.ts                # SSE 스트림
    │   ├── use-toast.test.ts                   # Toast 리듀서
    │   └── query-factory.test.ts               # 쿼리/뮤테이션 훅 팩토리
    ├── utils/
    │   ├── api.test.ts                         # pageQs
    │   └── apiFetch.test.ts                    # apiFetch, createServiceFetch
    └── lib/utils.spec.ts                       # cn()
```
