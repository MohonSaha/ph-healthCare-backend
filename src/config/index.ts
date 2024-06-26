import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  ENV: process.env.node_env,
  PORT: process.env.PORT,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  JWT_RESET_PASSWORD_TOKEN: process.env.JWT_RESET_PASSWORD_TOKEN,
  JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN:
    process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
  RESET_PASSWORD_LINK: process.env.RESET_PASSWORD_LINK,

  emailSender: {
    EMAIL: process.env.EMAIL,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  },

  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,
    successUrl: process.env.SUCCESS_URL,
    cancleUrl: process.env.CANCEL_URL,
    failUrl: process.env.FAIL_URL,
    sslPaymentUrl: process.env.SSL_PAYMENT_API,
    sslValidationUrl: process.env.SSL_VALIDATION_API,
  },
};
