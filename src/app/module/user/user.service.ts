import status from "http-status";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateTeacherPayload, IUpdateTeacherPayload, IPaginationOptions, ITeacherFilters } from "./user.interface";
import { Prisma, Gender } from "../../../generated/prisma/client";

// ==================== CREATE TEACHER ====================
const createTeacher = async (payload: ICreateTeacherPayload) => {
    // Check if user with email already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.teacher.email
        }
    });

    if (userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    // Create user with Better Auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.teacher.email,
            password: payload.password,
            role: Role.TEACHER,
            name: payload.teacher.name,
            needPasswordChange: true,
        }
    });

    try {
        const teacher = await prisma.$transaction(async (tx) => {
            // Create teacher profile
            const teacherData = await tx.teacher.create({
                data: {
                    userId: userData.user.id,
                    name: payload.teacher.name,
                    email: payload.teacher.email,
                    profilePhoto: payload.teacher.profilePhoto,
                    contactNumber: payload.teacher.contactNumber,
                    address: payload.teacher.address,
                    registrationNumber: payload.teacher.registrationNumber,
                    experience: payload.teacher.experience || 0,
                    gender: payload.teacher.gender,
                    qualification: payload.teacher.qualification,
                    currentWorkingPlace: payload.teacher.currentWorkingPlace,
                    designation: payload.teacher.designation,
                }
            });

            return teacherData;
        });

        return teacher;
    } catch (error) {
        console.log("Transaction error : ", error);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        });
        throw error;
    }
};

// ==================== GET ALL TEACHERS ====================
const getAllTeachers = async (filters: ITeacherFilters, options: IPaginationOptions) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;
    const { searchTerm, name, email, gender, designation, qualification } = filters;

    const skip = (page - 1) * limit;
    const take = limit;

    // Build where clause
    const whereConditions: Prisma.TeacherWhereInput[] = [];

    if (searchTerm) {
        whereConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
                { qualification: { contains: searchTerm, mode: "insensitive" } },
                { designation: { contains: searchTerm, mode: "insensitive" } },
            ]
        });
    }

    if (name) {
        whereConditions.push({ name: { contains: name, mode: "insensitive" } });
    }

    if (email) {
        whereConditions.push({ email: { contains: email, mode: "insensitive" } });
    }

    if (gender) {
        whereConditions.push({ gender: gender as Gender });
    }

    if (designation) {
        whereConditions.push({ designation: { contains: designation, mode: "insensitive" } });
    }

    if (qualification) {
        whereConditions.push({ qualification: { contains: qualification, mode: "insensitive" } });
    }

    const where: Prisma.TeacherWhereInput = {
        isDeleted: false,
        AND: whereConditions.length > 0 ? whereConditions : undefined,
    };

    const orderBy: Prisma.TeacherOrderByWithRelationInput = {
        [sortBy]: sortOrder,
    };

    const teachers = await prisma.teacher.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    image: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
            assignedClasses: true,
        }
    });

    const total = await prisma.teacher.count({ where });

    return {
        teachers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// ==================== GET SINGLE TEACHER ====================
const getSingleTeacher = async (id: string) => {
    const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    image: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
            assignedClasses: {
                include: {
                    organization: true,
                }
            },
        }
    });

    if (!teacher) {
        throw new AppError(status.NOT_FOUND, "Teacher not found");
    }

    return teacher;
};

// ==================== UPDATE TEACHER ====================
const updateTeacher = async (id: string, payload: IUpdateTeacherPayload) => {
    const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!teacher) {
        throw new AppError(status.NOT_FOUND, "Teacher not found");
    }

    if (teacher.isDeleted) {
        throw new AppError(status.NOT_FOUND, "Teacher not found");
    }

    const updatedTeacher = await prisma.$transaction(async (tx) => {
        // Update teacher profile
        const teacherData = await tx.teacher.update({
            where: { id },
            data: payload.teacher,
        });

        // If name is updated, also update user name
        if (payload.teacher?.name) {
            await tx.user.update({
                where: { id: teacher.userId },
                data: { name: payload.teacher.name },
            });
        }

        return teacherData;
    });

    return updatedTeacher;
};

// ==================== DELETE TEACHER (SOFT DELETE) ====================
const deleteTeacher = async (id: string) => {
    const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!teacher) {
        throw new AppError(status.NOT_FOUND, "Teacher not found");
    }

    if (teacher.isDeleted) {
        throw new AppError(status.NOT_FOUND, "Teacher already deleted");
    }

    await prisma.$transaction(async (tx) => {
        // Soft delete teacher
        await tx.teacher.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            }
        });

        // Soft delete user
        await tx.user.update({
            where: { id: teacher.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: "DELETED",
            }
        });
    });

    return { message: "Teacher deleted successfully" };
};

// ==================== EXPORT ====================
export const UserService = {
    createTeacher,
    getAllTeachers,
    getSingleTeacher,
    updateTeacher,
    deleteTeacher,
};
