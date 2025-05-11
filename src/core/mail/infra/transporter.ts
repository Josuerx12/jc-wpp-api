import { config } from "dotenv";
import { createTransport } from "nodemailer";

config();

export const mail = createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
