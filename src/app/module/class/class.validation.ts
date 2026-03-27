import { z } from "zod";

export const createClassValidationSchema = z.object({
  name: z.string({ error: "Name is required" }).min(2),
  description: z.string().optional(),
  classNumber: z.coerce.number().optional(),
  sectionCode: z.string().optional(),
  academicYear: z.string().optional(),
  organizationId: z.string({ error: "Organization ID is required" }),
  teacherId: z.string().optional(),
});

export const updateClassValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  classNumber: z.coerce.number().optional(),
  sectionCode: z.string().optional(),
  academicYear: z.string().optional(),
  teacherId: z.string().optional(),
});
