interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export function pageQs(pageable?: Pageable): string {
  if (!pageable) return "";
  const qs = new URLSearchParams();
  if (pageable.page !== undefined) qs.set("page", String(pageable.page));
  if (pageable.size !== undefined) qs.set("size", String(pageable.size));
  if (pageable.sort) pageable.sort.forEach((s) => qs.append("sort", s));
  const str = qs.toString();
  return str ? `?${str}` : "";
}
