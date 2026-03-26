import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

export const createAdminValidationSchema = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  admin: z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters"),
    email: z.string()
      .email("Email must be valid"),
    role: z.nativeEnum(Role).optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const updateAdminValidationSchema = z.object({
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const updateAdminZodSchema = updateAdminValidationSchema;