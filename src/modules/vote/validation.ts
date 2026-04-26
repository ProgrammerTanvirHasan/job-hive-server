import { z } from "zod";

export const voteSchema = z.object({
  jobId: z.number(),
  type: z.enum(["UP", "DOWN"]),
});
