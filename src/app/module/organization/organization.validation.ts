import { z } from "zod";

export const createOrganizationValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2),
    description: z.string().optional(),
    parentId: z.string().optional(),
  }),
});

export const updateOrganizationValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().optional(),
  }),
});
