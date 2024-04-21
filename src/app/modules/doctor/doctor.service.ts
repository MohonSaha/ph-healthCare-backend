import { Request } from "express";
import prisma from "../../../shared/prisma";

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialities, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updateDoctorData = await transactionClient.doctor.update({
      where: {
        id: id,
      },
      include: {
        DoctorSpecialities: true,
      },
      data: doctorData,
    });

    // seperate two types of specialities (add and delete)
    if (specialities && specialities.length > 0) {
      // filtering for delete specialities
      const deleteSpecialitiesIds = specialities.filter(
        (speciality: { isDeleted: boolean }) => speciality.isDeleted
      );
      //   console.log("d", deleteSpecialitiesIds);
      for (const speciality of deleteSpecialitiesIds) {
        const createDoctorSpecilities =
          await transactionClient.doctorSpecialities.deleteMany({
            where: {
              doctorId: doctorInfo.id,
              specialitiesId: speciality.specialitiesId,
            },
          });
      }

      // filtering for create specialities
      const createSpecialitiesIds = specialities.filter(
        (speciality: { isDeleted: boolean }) => !speciality.isDeleted
      );
      //   console.log("41", createSpecialitiesIds);
      for (const speciality of createSpecialitiesIds) {
        const createDoctorSpecilities =
          await transactionClient.doctorSpecialities.create({
            data: {
              doctorId: doctorInfo.id,
              specialitiesId: speciality.specialitiesId,
            },
          });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      DoctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

export const DoctorServices = {
  updateDoctorIntoDB,
};
