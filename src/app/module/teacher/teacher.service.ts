import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTeacherPayload, IUpdateTeacherPayload } from "./teacher.interface";

const getAllTeachers = async () => {
  const teachers = await prisma.teacher.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      assignedClasses: true,
    },
  });
  return teachers;
};

const getTeacherById = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      assignedClasses: {
        include: {
          organization: true,
          students: true,
          tasks: true,
          messages: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  return teacher;
};

const createTeacher = async (userId: string, payload: ICreateTeacherPayload) => {
  const isTeacherExist = await prisma.teacher.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isTeacherExist) {
    throw new AppError(status.CONFLICT, "Teacher with this email already exists");
  }

  const isRegistrationExists = await prisma.teacher.findUnique({
    where: {
      registrationNumber: payload.registrationNumber,
    },
  });

  if (isRegistrationExists) {
    throw new AppError(status.CONFLICT, "Registration number already exists");
  }

  const newTeacher = await prisma.teacher.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: true,
    },
  });

  return newTeacher;
};

const updateTeacher = async (id: string, payload: IUpdateTeacherPayload) => {
  const isTeacherExist = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isTeacherExist) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  const updatedTeacher = await prisma.teacher.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
    include: {
      user: true,
      assignedClasses: true,
    },
  });

  return updatedTeacher;
};

const deleteTeacher = async (id: string) => {
  const isTeacherExist = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!isTeacherExist) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  const deletedTeacher = await prisma.teacher.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedTeacher;
};

export const TeacherService = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
