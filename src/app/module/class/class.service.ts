import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateClassPayload, IUpdateClassPayload } from "./class.interface";

const getAllClasses = async () => {
  return await prisma.class.findMany({ 
    where: { isDeleted: false },
    include: { organization: true, teacher: true, students: true, tasks: true, messages: true },
  });
};

const getClassById = async (id: string) => {
  const cls = await prisma.class.findUnique({
    where: { id, isDeleted: false },
    include: { organization: true, teacher: true, students: { include: { student: true } }, tasks: true, messages: true },
  });
  if (!cls) throw new AppError(status.NOT_FOUND, "Class not found");
  return cls;
};

const createClass = async (payload: ICreateClassPayload) => {
  const org = await prisma.organization.findUnique({ where: { id: payload.organizationId } });
  if (!org) throw new AppError(status.NOT_FOUND, "Organization not found");

  if (payload.teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: payload.teacherId } });
    if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  return await prisma.class.create({
    data: payload,
    include: { organization: true, teacher: true },
  });
};

const updateClass = async (id: string, payload: IUpdateClassPayload) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError(status.NOT_FOUND, "Class not found");

  if (payload.teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: payload.teacherId } });
    if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  return await prisma.class.update({
    where: { id },
    data: payload,
    include: { organization: true, teacher: true, students: true },
  });
};

const deleteClass = async (id: string) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError(status.NOT_FOUND, "Class not found");

  // Hard delete - Prisma cascade rules handle related records:
  // StudentClass: onDelete: Cascade (auto-deleted)
  // Task: onDelete: SetNull (classId set to null)
  // Message: onDelete: SetNull (classId set to null)
  return await prisma.class.delete({
    where: { id },
  });
};

export const ClassService = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
