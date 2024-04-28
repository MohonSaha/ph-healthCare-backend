import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (!(patientData.id === appointmentData.patientId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  const result = await prisma.$transaction(async (tx) => {
    // create review and rating
    const createdReviewData = await prisma.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: appointmentData.doctorId,
      },
      _avg: {
        rating: true,
      },
    });

    await prisma.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRation: averageRating._avg.rating as number,
      },
    });

    return createdReviewData;
  });

  return result;
};

export const ReviewService = {
  insertIntoDB,
};

// id: 64da84fd-e281-47c0-bd9d-eb919033f22c  mio
// id: 687ce7c2-2d49-4c08-ab3c-a7686a3b0c2c   mio
// id: 5ec1762c-57d9-4020-a23b-af41b193c192   pop
// id: 310712b7-31ea-4178-99bb-d0f23923b0a7    pop
