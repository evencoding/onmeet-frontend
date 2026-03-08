import { z } from "zod";

export const ApiErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  timestamp: z.number().optional(),
});

export function apiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    error: ApiErrorSchema.optional(),
  });
}

export type ApiErrorDto = z.infer<typeof ApiErrorSchema>;
