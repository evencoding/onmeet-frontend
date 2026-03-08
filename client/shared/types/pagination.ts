// ── Request ──

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

// ── Spring Boot Page response internals ──

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

// ── Full Spring Boot Page<T> ──

export interface Page<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  pageable: PageableObject;
  last: boolean;
  first: boolean;
  empty: boolean;
}

// ── Simplified PageResponse (used by auth) ──

export interface PageResponse<T = unknown> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ── Utility ──

export function pageableToParams(pageable?: Pageable): string {
  if (!pageable) return "";
  const qs = new URLSearchParams();
  if (pageable.page !== undefined) qs.set("page", String(pageable.page));
  if (pageable.size !== undefined) qs.set("size", String(pageable.size));
  if (pageable.sort) pageable.sort.forEach((s) => qs.append("sort", s));
  const str = qs.toString();
  return str ? `?${str}` : "";
}
