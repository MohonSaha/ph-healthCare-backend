import { resourceUsage } from "process";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAuthUser } from "../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { boolean, tuple } from "zod";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (user: any, payload: { schedulesIds: string[] }) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedulesData = payload.schedulesIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId: scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedulesData,
  });

  return result;
};

const getMySchedules = async (
  filters: any,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const whereConditions: Prisma.doctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
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

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked."
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const DoctorSchesulesService = {
  insertIntoDB,
  getMySchedules,
  deleteFromDB,
};
