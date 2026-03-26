import { z } from "zod";
import { Gender } from "../../../generated/prisma/enums";

// Student Registration Schema
const studentRegistrationSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
});

// Teacher Registration Schema
const teacherRegistrationSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string({ required_error: "Registration number is required" }),
    experience: z.number().optional().default(0),
    gender: z.nativeEnum(Gender, { required_error: "Gender is required" }),
    qualification: z.string({ required_error: "Qualification is required" }),
    currentWorkingPlace: z.string().optional(),
    designation: z.string({ required_error: "Designation is required" }),
});

// Login Schema
const loginSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }),
});

// Change Password Schema
const changePasswordSchema = z.object({
    currentPassword: z.string({ required_error: "Current password is required" }),
    newPassword: z.string({ required_error: "New password is required" }).min(6, "New password must be at least 6 characters"),
});

// Verify Email Schema
const verifyEmailSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    otp: z.string({ required_error: "OTP is required" }),
});

// Forget Password Schema
const forgetPasswordSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
});

// Reset Password Schema
const resetPasswordSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    otp: z.string({ required_error: "OTP is required" }),
    newPassword: z.string({ required_error: "New password is required" }).min(6, "New password must be at least 6 characters"),
});

export const AuthValidation = {
    studentRegistration: studentRegistrationSchema,
    teacherRegistration: teacherRegistrationSchema,
    login: loginSchema,
    changePassword: changePasswordSchema,
    verifyEmail: verifyEmailSchema,
    forgetPassword: forgetPasswordSchema,
    resetPassword: resetPasswordSchema,
};
