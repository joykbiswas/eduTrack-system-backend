import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

// Teacher registration schema
export const createTeacherZodSchema = z.object({
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters"),
    teacher: z.object({
        name: z.string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        email: z.string()
            .email("Invalid email address"),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        registrationNumber: z.string(),
        experience: z.number().optional().default(0),
        gender: z.nativeEnum(Gender),
        qualification: z.string(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string(),
        subject: z.string(),
    }),
});

// Update teacher schema
export const updateTeacherZodSchema = z.object({
    teacher: z.object({
        name: z.string().min(2).max(100).optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        registrationNumber: z.string().optional(),
        experience: z.number().optional(),
        gender: z.nativeEnum(Gender).optional(),
        qualification: z.string().optional(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string().optional(),
        subject: z.string().optional(),
    }).optional(),
});

// Get teachers query schema
export const getTeachersZodSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    sortBy: z.string().optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    designation: z.string().optional(),
    qualification: z.string().optional(),
    subject: z.string().optional(),
});
