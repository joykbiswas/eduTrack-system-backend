import { z } from "zod";

export const createCardContentValidationSchema = z.object({
  cardId: z.string().uuid("Invalid card ID"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  soundUrl: z.string().url().optional().or(z.literal("")),
  xPosition: z.number().int().min(0).default(0),
  yPosition: z.number().int().min(0).default(0),
  width: z.number().int().min(1).default(100),
  height: z.number().int().min(1).default(100),
  seq: z.number().int().default(0),
});

export const updateCardContentValidationSchema = z.object({
  cardId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  soundUrl: z.string().url().optional().or(z.literal("")),
  xPosition: z.number().int().min(0).optional(),
  yPosition: z.number().int().min(0).optional(),
  width: z.number().int().min(1).optional(),
  height: z.number().int().min(1).optional(),
  seq: z.number().int().optional(),
});

