import { z } from "zod";
export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  company: z.string().min(2),
  location: z.string().min(2),
  category: z
    .string()
    .min(2, "Category is required")
    .transform((val) => val.trim().toLowerCase()),

  salary: z.number().optional().nullable(),

  isPaid: z.boolean(),

  price: z.number().optional().nullable(),

  requirements: z.array(z.string()).default([]),
  qualifications: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  applyDeadline: z.string().optional().nullable(),
});
