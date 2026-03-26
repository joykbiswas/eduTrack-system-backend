import { Gender } from "../../../generated/prisma/enums";

// Teacher registration payload
export interface ICreateTeacherPayload {
    password: string;
    teacher: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber: string;
        experience?: number;
        gender: Gender;
        qualification: string;
        currentWorkingPlace?: string;
        designation: string;
    }
}

// Update teacher payload
export interface IUpdateTeacherPayload {
    teacher: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber?: string;
        experience?: number;
        gender?: Gender;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    }
}

// Pagination options
export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// Filters
export interface ITeacherFilters {
    searchTerm?: string;
    name?: string;
    email?: string;
    gender?: Gender;
    designation?: string;
    qualification?: string;
}
