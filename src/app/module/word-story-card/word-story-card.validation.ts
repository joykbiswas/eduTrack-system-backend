import { z } from "zod";

export const createWordStoryCardValidationSchema = z.object({
  title: z.string({ error: "Title is required" }).min(1),
  keywords: z.string().optional(),
  description: z.string().optional(),
  descriptionSound: z.string().url().optional().or(z.literal("")),
  dialogTitle: z.string().optional(),
  dialogContent: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export const updateWordStoryCardValidationSchema = z.object({
  title: z.string().min(1).optional(),
  keywords: z.string().optional(),
  description: z.string().optional(),
  descriptionSound: z.string().url().optional().or(z.literal("")),
  dialogTitle: z.string().optional(),
  dialogContent: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});
