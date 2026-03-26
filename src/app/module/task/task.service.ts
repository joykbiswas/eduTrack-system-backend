import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllTasks = async () => {
  return await prisma.task.findMany({
    where: { isDeleted: false },
    include: { class: true, assignedTo: { include: { student: true } } },
  });
};

const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id, isDeleted: false },
    include: { class: true, assignedTo: { include: { student: true } } },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");
  return task;
};

const createTask = async (payload: any) => {
  return await prisma.task.create({
    data: payload,
    include: { class: true, assignedTo: true },
  });
};

const updateTask = async (id: string, payload: any) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");

  return await prisma.task.update({
    where: { id },
    data: payload,
    include: { class: true, assignedTo: true },
  });
};

const deleteTask = async (id: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");

  return await prisma.task.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const TaskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
