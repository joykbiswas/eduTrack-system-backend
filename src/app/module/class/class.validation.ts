import { z } from "zod";

export const createClassValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2),
  description: z.string().optional(),
  organizationId: z.string({ required_error: "Organization ID is required" }),
  teacherId: z.string().optional(),
});

export const updateClassValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  teacherId: z.string().optional(),
});
