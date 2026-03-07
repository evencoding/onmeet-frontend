// ── API Error ──

export interface ApiError {
  status: number;
  message: string;
  timestamp?: number;
}

// ── API Response envelope (Video API) ──

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
}

// ── Type Guard ──

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err &&
    typeof (err as ApiError).status === "number" &&
    typeof (err as ApiError).message === "string"
  );
}
