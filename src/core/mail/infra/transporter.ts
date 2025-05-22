import { config } from "dotenv";
import { createTransport } from "nodemailer";

config();

export const mail = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
  // tls: {
  //   rejectUnauthorized: false,
  // },
});
