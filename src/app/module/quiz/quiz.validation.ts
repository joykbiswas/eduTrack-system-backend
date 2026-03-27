import { z } from "zod";
import { QuizType } from "../../../generated/prisma/enums";

export const createQuizValidationSchema = z.object({
  cardId: z.string().uuid(),
  type: z.nativeEnum(QuizType),
  question: z.string().min(1, "Question is required"),
  options: z.unknown().optional(),
  correctAnswer: z.unknown(),
  points: z.number().int().min(0).default(1),
});

export const updateQuizValidationSchema = z.object({
  cardId: z.string().uuid().optional(),
  type: z.nativeEnum(QuizType).optional(),
  question: z.string().min(1).optional(),
  options: z.unknown().optional(),
  correctAnswer: z.unknown().optional(),
  points: z.number().int().min(0).optional(),
});

