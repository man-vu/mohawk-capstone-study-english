import nodemailer from "nodemailer";
import { appmail, appmail_password } from "../../config/index";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appmail,
    pass: appmail_password,
  },
});

export { appmail };
export default { transporter, appmail };
