import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { SslService } from "../ssl/ssl.service";

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

export const PaymentService = {
  initPayment,
};
