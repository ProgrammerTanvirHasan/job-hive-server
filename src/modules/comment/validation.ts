import { z } from "zod";

export const commentSchema = z.object({
  jobId: z.number(),
  content: z.string().min(1),
  parentId: z.number().optional(),
});
