import { z } from "zod";

// Student Registration Schema - role is auto-assigned as STUDENT
const studentRegistrationSchema = z.object({
    name: z.string({ error: "Name is required" }).min(1, "Name cannot be empty"),
    email: z.string({ error: "Email is required" }).email("Invalid email format"),
    password: z.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
});

// Login Schema
const loginSchema = z.object({
    email: z.string({ error: "Email is required" }).email("Invalid email format"),
    password: z.string({ error: "Password is required" }),
});

// Change Password Schema
const changePasswordSchema = z.object({
    currentPassword: z.string({ error: "Current password is required" }),
    newPassword: z.string({ error: "New password is required" }).min(6, "New password must be at least 6 characters"),
});

// Forget Password Schema
const forgetPasswordSchema = z.object({
    email: z.string({ error: "Email is required" }).email("Invalid email format"),
});

// Reset Password Schema
const resetPasswordSchema = z.object({
    email: z.string({ error: "Email is required" }).email("Invalid email format"),
    otp: z.string({ error: "OTP is required" }),
    newPassword: z.string({ error: "New password is required" }).min(6, "New password must be at least 6 characters"),
});

export const AuthValidation = {
    registration: studentRegistrationSchema,
    login: loginSchema,
    changePassword: changePasswordSchema,
    forgetPassword: forgetPasswordSchema,
    resetPassword: resetPasswordSchema,
};
