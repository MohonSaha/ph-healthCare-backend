import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.EMAIL,
      pass: config.emailSender.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"PH HEALTH CARE DB" <mskmohon1707@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Password Link", // Subject line
    // text: "Hello world?", // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSender;
