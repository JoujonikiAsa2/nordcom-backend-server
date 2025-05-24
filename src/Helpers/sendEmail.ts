import nodemailer from "nodemailer";
import config from "../config";
import {
  forgotPasswordEmailText,
  paymentVerificationEmailText,
} from "./sendMailText";

const sendMail = async (payload: any, emailType: string): Promise<boolean> => {
  console.log({
    email: config.nodemailer_email,
    password: config.nodemailer_password,
  });
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_password,
    },
  });

  const mailOptions = {
    from: "NordCom",
    to: payload.email,
    subject: payload.subject,
    html:
      emailType === "payment"
        ? paymentVerificationEmailText(payload)
        : forgotPasswordEmailText(payload),
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};

export default sendMail;
