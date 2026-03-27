import { z } from "zod";

export const createMaterialValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string().optional(),
  cardId: z.string().uuid().optional(),
});

export const updateMaterialValidationSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  type: z.string().optional(),
  cardId: z.string().uuid().optional(),
});

