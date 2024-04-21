import { UserStatus } from "@prisma/client";
import { object, z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "Password is required." }),
  admin: z.object({
    name: z.string({ required_error: "Name is required." }),
    email: z.string({ required_error: "Email is required." }),
    contactNumber: z.string({ required_error: "ContactNumber is required." }),
  }),
});

const createDoctor = z.object({
  password: z.string({ required_error: "Password is required." }),
  doctor: z.object({
    name: z.string({ required_error: "Name is required." }),
    email: z.string({ required_error: "Email is required." }),
    contactNumber: z.string({ required_error: "ContactNumber is required." }),
    address: z.string().optional(),
    registrationNo: z.string({ required_error: "registrationNo is required." }),
    experience: z.number().optional(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number({ required_error: "appointmentFee is required." }),
    qualification: z.string({ required_error: "qualification  is required." }),
    currentWorkignPlace: z.string({
      required_error: "currentWorkignPlace is required.",
    }),
    designation: z.string({ required_error: "designation  is required." }),
  }),
});

const createPatient = z.object({
  password: z.string(),
  patient: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email(),
    name: z.string({
      required_error: "Name is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact number is required!",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const userValidations = {
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus,
};
