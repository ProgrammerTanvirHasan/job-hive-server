import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.coerce.number(),

  resume: z.string().min(1, "Resume URL is required"),

  coverLetter: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ""),
});
