import { UserRole, paymentStatus } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDcotorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      metaData = getPatientnMetaData(user as IAuthUser);
      break;
    default:
      throw new Error("Invalid user role");
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: paymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const paiChartData = await getPaiChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
    adminCount,
    barChartData,
    paiChartData,
  };
};

// admin:
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: paymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const paiChartData = await getPaiChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
    barChartData,
    paiChartData,
  };
};

const getDcotorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: paymentStatus.PAID,
    },
    _sum: {
      amount: true,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formatedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue,
    formatedAppointmentStatusDistribution,
  };
};

const getPatientnMetaData = async (user: IAuthUser) => {
  // Check if the valid user or not
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const formatedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formatedAppointmentStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint }[] =
    await prisma.$queryRaw`
    SELECT DATE_TRUNC ('month', "createdAt") AS month,
    CAST(COUNT (*) AS INTEGER) count 
    FROM "appointments"
    GROUP BY month 
    ORDER BY month ASC
  `;

  return appointmentCountByMonth;
};

const getPaiChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const formatedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return formatedAppointmentStatusDistribution;
};

export const MetaService = {
  fetchDashboardMetaData,
};
