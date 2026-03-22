/**
 * Meeting Phase State Machine
 *
 * 회의실의 Phase 전이를 선언적으로 정의하고,
 * 불가능한 전이를 원천 차단한다.
 *
 * 예: "disconnected" → "connected" 전이는 불가능.
 *      반드시 preparing → joining → waiting/connected 순서를 거쳐야 한다.
 *
 * XState 없이 경량으로 구현한 Finite State Machine.
 */

import type { Phase } from "./types";

/**
 * 각 Phase에서 전이 가능한 다음 Phase 목록.
 *
 * ```
 * preparing ──→ joining
 *     ↑            │
 *     │            ├──→ waiting ──→ connected ──→ disconnected
 *     │            │       │
 *     │            │       └──→ preparing (거절/취소)
 *     │            │
 *     │            └──→ connected ──→ disconnected
 *     │            │
 *     │            └──→ preparing (에러)
 *     │
 *     └──────────────────────── (reset)
 * ```
 */
const PHASE_TRANSITIONS: Record<Phase, Phase[]> = {
  preparing:     ["joining"],
  joining:       ["waiting", "connected", "preparing"],  // preparing = 에러 시 복귀
  waiting:       ["connected", "preparing"],              // preparing = 거절/취소 시 복귀
  connected:     ["disconnected"],
  disconnected:  ["preparing"],                           // preparing = 재입장
};

/**
 * 현재 Phase에서 다음 Phase로 전이할 수 있는지 검사한다.
 */
export function canTransition(from: Phase, to: Phase): boolean {
  return PHASE_TRANSITIONS[from].includes(to);
}

/**
 * Phase 전이를 수행한다. 불가능한 전이면 경고를 남기고 현재 Phase를 반환한다.
 */
export function transition(from: Phase, to: Phase): Phase {
  if (canTransition(from, to)) {
    return to;
  }

  console.warn(
    `[PhaseMachine] 불가능한 전이: "${from}" → "${to}". ` +
    `허용된 전이: [${PHASE_TRANSITIONS[from].join(", ")}]`,
  );
  return from;
}

/**
 * 전이 로그를 남기는 디버그 유틸.
 * 개발 모드에서 Phase 변화를 추적할 때 사용한다.
 */
export function logTransition(from: Phase, to: Phase, success: boolean): void {
  if (import.meta.env.DEV) {
    const arrow = success ? "→" : "✗";
    console.debug(`[Phase] ${from} ${arrow} ${to}`);
  }
}
