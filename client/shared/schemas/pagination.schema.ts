import { z } from "zod";

export const SortObjectSchema = z.object({
  direction: z.string(),
  nullHandling: z.string(),
  ascending: z.boolean(),
  property: z.string(),
  ignoreCase: z.boolean(),
});

export const PageableObjectSchema = z.object({
  offset: z.number(),
  sort: z.array(SortObjectSchema),
  unpaged: z.boolean(),
  paged: z.boolean(),
  pageNumber: z.number(),
  pageSize: z.number(),
});

/** Generic Spring Boot `Page<T>` schema factory */
export function pageSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    totalPages: z.number(),
    totalElements: z.number(),
    size: z.number(),
    content: z.array(itemSchema),
    number: z.number(),
    sort: z.array(SortObjectSchema),
    numberOfElements: z.number(),
    pageable: PageableObjectSchema,
    last: z.boolean(),
    first: z.boolean(),
    empty: z.boolean(),
  });
}

/** Simplified PageResponse schema (used by auth) */
export function pageResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    content: z.array(itemSchema),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  });
}
