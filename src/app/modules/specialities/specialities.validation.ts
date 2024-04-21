import { z } from "zod";

const createSpecialities = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
});

export const SpecialitiesValidations = {
  createSpecialities,
};
