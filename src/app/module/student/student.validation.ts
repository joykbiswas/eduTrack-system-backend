import { z } from "zod";

export const createStudentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(2, "Name must be at least 2 characters"),
    email: z.string({
      required_error: "Email is required",
    }).email("Email must be valid"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const enrollStudentValidationSchema = z.object({
  body: z.object({
    classId: z.string({
      required_error: "Class ID is required",
    }),
  }),
});
