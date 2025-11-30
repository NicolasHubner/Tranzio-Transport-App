import { z } from "zod";

export const chatFiltersValidationSchema = z.object({
  leaderIds: z.array(z.string()),
  groupIds: z.array(z.string()),
});

export type ChatFiltersFormInput = z.input<typeof chatFiltersValidationSchema>;
