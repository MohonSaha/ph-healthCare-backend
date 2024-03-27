import { z } from "zod";

const updateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const adminValidations = {
  updateValidationSchema,
};
