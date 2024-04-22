import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { doctorSearchableFields } from "./doctor.cosntant";
import { IDoctorFilterRequest } from "./doctor.interface";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialities, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // filtering on specialities
  // doctor ---> doctorSpecialties ----> specialties ---> title

  if (specialities && specialities.length > 0) {
    andConditions.push({
      DoctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      DoctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

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

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
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

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorServices = {
  updateDoctorIntoDB,
  getByIdFromDB,
  deleteFromDB,
  getAllFromDB,
  softDelete,
};
