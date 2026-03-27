/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IAssignTaskPayload } from "./task.interface";

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

const assignCardToStudent = async (cardId: string, payload: IAssignTaskPayload) => {
  return await prisma.$transaction(async (tx) => {
    // Check card exists
    const card = await tx.wordStoryCard.findUnique({
      where: { id: cardId, isDeleted: false },
    });
    if (!card) {
      throw new AppError(status.NOT_FOUND, 'WordStoryCard not found');
    }

    // Find or create Task for this card
    let task = await tx.task.findFirst({
      where: { cardId: cardId, isDeleted: false },
    });
    if (!task) {
      task = await tx.task.create({
        data: {
          title: card.title,
          description: card.description,
          cardId: cardId,
          status: 'PENDING',
        },
      });
    }

    // Check student exists
    const student = await tx.student.findUnique({
      where: { id: payload.studentId, isDeleted: false },
    });
    if (!student) {
      throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    // Check if already assigned
    const existingAssignment = await tx.studentTask.findFirst({
      where: {
        studentId: payload.studentId,
        taskId: task.id,
      },
    });
    if (existingAssignment) {
      throw new AppError(status.BAD_REQUEST, 'Card task is already assigned to this student');
    }

    // Create assignment
    await tx.studentTask.create({
      data: {
        studentId: payload.studentId,
        taskId: task.id,
      },
    });

    // Return updated task
    return await tx.task.findUnique({
      where: { id: task.id },
      include: { class: true, assignedTo: { include: { student: true } } },
    });
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
  
  assignCardToStudent,
  deleteTask,
};


