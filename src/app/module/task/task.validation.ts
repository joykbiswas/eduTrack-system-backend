import { z } from 'zod';

const taskStatusEnum = z.enum(['PENDING', 'COMPLETED', 'IN_PROGRESS']);

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required and cannot be empty' }),
    description: z.string().optional(),
    cardId: z.string().optional(),
    classId: z.string().optional(),
    dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    status: taskStatusEnum.optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    cardId: z.string().optional(),
    classId: z.string().optional(),
    dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    status: taskStatusEnum.optional(),
  }),
});

const assignTaskSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, { message: 'Student ID is required' }),
  }),
});

const assignCardSchema = z.object({
  studentId: z.string().min(1, { message: 'Student ID is required' }),
});


export const TaskValidation = {
  createTask: createTaskSchema,
  updateTask: updateTaskSchema,
  assignTask: assignTaskSchema,
  assignCard: assignCardSchema,
};



