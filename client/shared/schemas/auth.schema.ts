import { z } from "zod";

// ── Response Schemas ──

export const LoginResponseSchema = z.object({
  message: z.string(),
  tokenType: z.string(),
});
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  tokenType: z.string(),
});
export type TokenResponseDto = z.infer<typeof TokenResponseSchema>;

export const InvitationValidationResponseSchema = z.object({
  email: z.string(),
  companyName: z.string(),
  role: z.enum(["USER", "ADMIN", "MANAGER"]),
});
export type InvitationValidationResponseDto = z.infer<typeof InvitationValidationResponseSchema>;

export const CompanyInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type CompanyInfoDto = z.infer<typeof CompanyInfoSchema>;

export const TeamInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string().optional(),
});
export type TeamInfoDto = z.infer<typeof TeamInfoSchema>;

export const JobTitleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  isDefault: z.boolean(),
});
export type JobTitleResponseDto = z.infer<typeof JobTitleResponseSchema>;

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  employeeId: z.string().optional(),
  roles: z.array(z.string()),
  status: z.string(),
  company: CompanyInfoSchema.optional(),
  jobTitle: JobTitleResponseSchema.optional(),
  teams: z.array(TeamInfoSchema),
  profileImageId: z.number().optional(),
});
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
