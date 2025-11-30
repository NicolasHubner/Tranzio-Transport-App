import { z } from "zod";

export const createAttendanceLiveTaskMessageEvidenceValidationSchema = z.object(
  {
    description: z
      .string({ required_error: "A descrição é obrigatória" })
      .min(1, "A descrição é obrigatória"),
    willBeCompleted: z.boolean(),
  },
);

export type CreateAttendanceLiveTaskMessageEvidenceFormInput = z.input<
  typeof createAttendanceLiveTaskMessageEvidenceValidationSchema
>;
