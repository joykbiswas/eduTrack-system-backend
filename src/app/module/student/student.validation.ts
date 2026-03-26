import { z } from "zod";

export const createStudentValidationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters"),
  email: z.string()
    .email("Email must be valid"),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const updateStudentValidationSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const enrollStudentValidationSchema = z.object({
  classId: z.string()
    .min(1, "Class ID is required"),
});
