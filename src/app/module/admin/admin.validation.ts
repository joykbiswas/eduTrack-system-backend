import { z } from "zod";

export const createAdminValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }).min(2, "Name must be at least 2 characters"),
  email: z.string({
    required_error: "Email is required",
  }).email("Email must be valid"),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const updateAdminValidationSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const updateAdminZodSchema = updateAdminValidationSchema;