import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.coerce.number(),

  coverLetter: z
    .string()
    .transform((val) => val?.trim() || "") // ✅ prevent null
    .optional(),
});
