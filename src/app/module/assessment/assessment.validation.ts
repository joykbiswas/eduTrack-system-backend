import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.boolean("Answer must be true or false"),
});

export const createAssessmentValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cardId: z.string().uuid().optional(),
  questions: z.array(questionSchema).min(1, "At least one question required"),
  passingScore: z.number().int().min(0).max(100).default(60),
});

export const updateAssessmentValidationSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  cardId: z.string().uuid().optional(),
  questions: z.array(questionSchema).optional(),
  passingScore: z.number().int().min(0).max(100).optional(),
});

