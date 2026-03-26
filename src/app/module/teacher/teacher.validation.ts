import { z } from "zod";

export const createTeacherValidationSchema = z.object({
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
    registrationNumber: z.string({
      required_error: "Registration number is required",
    }),
    experience: z.number().optional().default(0),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      required_error: "Gender is required",
    }),
    qualification: z.string({
      required_error: "Qualification is required",
    }),
    currentWorkingPlace: z.string().optional(),
    designation: z.string({
      required_error: "Designation is required",
    }),
  }),
});

export const updateTeacherValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    experience: z.number().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
  }),
});
