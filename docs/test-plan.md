# 테스트 계획

## 현재 상태
- 프레임워크: Vitest 3.2.4
- 기존 테스트: 1개 (`utils.spec.ts` — `cn` 유틸리티)
- vitest 설정 필요: `jsdom` 환경, `@` alias, coverage 설정

## Phase 1: 순수 함수/스토어 (HIGH, ~2.5h)

### 1. `pageQs` — 페이지네이션 쿼리 빌더 (15min)
- **파일:** `client/shared/utils/api.ts`
- **타입:** 순수 함수
- **테스트:**
  - pageable 없음 → 빈 문자열
  - page만 → `?page=0`
  - sort 배열 처리
  - undefined 값 필터링

### 2. Toast `reducer` (30min)
- **파일:** `client/shared/hooks/use-toast.ts`
- **타입:** 순수 리듀서
- **테스트:**
  - ADD_TOAST: 생성 + TOAST_LIMIT 제한
  - UPDATE_TOAST: 올바른 toast 찾아서 patch
  - DISMISS_TOAST: closed 상태로 변경
  - REMOVE_TOAST: 배열에서 삭제 (id 없으면 전체 삭제)

### 3. `parseResponseBody` — API 응답 파싱 (20min)
- **파일:** `client/features/auth/api.ts`
- **타입:** 순수 함수
- **테스트:**
  - 정상 JSON → 파싱
  - success: false + error → throw
  - 빈 텍스트 처리

### 4. `useMeetingRoomStore` — Zustand 스토어 (60min)
- **파일:** `client/features/meeting/store/useMeetingRoomStore.ts`
- **타입:** Zustand 스토어 (직접 테스트 가능)
- **테스트:**
  - 초기 상태 검증
  - setter 함수들 (setPhase, setToken 등)
  - toggle 함수들 (toggleMuted, toggleChat 등)
  - 채팅 메시지 추가/입력
  - AI 요청 큐 (add/remove)
  - reset → 초기 상태 복원

### 5. Query Key 팩토리 (20min)
- **파일:** `client/features/meeting/query-keys.ts`
- **타입:** 순수 객체/함수
- **테스트:**
  - 키 구조 일관성
  - 다른 파라미터 → 다른 키
  - 동일 파라미터 → 동일 키

### 6. `getUnreadTotal` — 알림 카운트 합산 (15min)
- **파일:** `client/features/notification/api.ts`
- **타입:** 순수 함수
- **테스트:**
  - 여러 카테고리 합산
  - 빈 데이터 → 0
  - 단일 카테고리

## Phase 2: 훅 테스트 (MEDIUM, ~2.5h)

### 7. `useThrottledValue` (40min)
- **파일:** `client/shared/hooks/useThrottledValue.ts`
- vi.useFakeTimers() 사용
- flush boundary 트리거 테스트

### 8. `toQueryString` — 방 목록 필터 쿼리 (20min)
- **파일:** `client/features/meeting/api/room.ts`
- 순수 함수, pageQs와 유사

### 9. `useIsMobile` (30min)
- **파일:** `client/shared/hooks/use-mobile.tsx`
- window.matchMedia 모킹 필요

## Phase 3: 고급 (선택, ~3h)

### 10. `useSSEStream` (90min)
- EventSource 모킹 복잡
- 재연결, 버퍼링, 쓰로틀링 로직

### 11. `useNotificationSSE` (60min)
- fetch 스트리밍 모킹

## vitest 설정 (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['client/**/*.ts', 'client/**/*.tsx'],
      exclude: ['node_modules', 'dist', '**/*.spec.*', '**/*.test.*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
});
```
