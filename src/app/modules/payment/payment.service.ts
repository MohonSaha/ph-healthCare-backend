import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { SslService } from "../ssl/ssl.service";
import { paymentStatus } from "@prisma/client";
import { IPaymentData } from "../ssl/ssl.interface";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    amount: paymentData?.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    phone: paymentData.appointment.patient.contactNumber,
  };

  const result = await SslService.initPayment(initPaymentData);
  return { paymentUrl: result.GatewayPageURL };
};

const validatePayment = async (payload: any) => {
  // TODO: Production code
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid payment!",
  //   };
  // }

  // const response = await SslService.validatePayment(payload);

  // if (response.status !== "VALID") {
  //   return {
  //     message: "Payment failed!",
  //   };
  // }

  // TODO: Development code
  const response = payload;

  // update payment status data after transaction
  const result = await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: paymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: paymentStatus.PAID,
      },
    });
  });

  return {
    message: "Payment success",
  };
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
