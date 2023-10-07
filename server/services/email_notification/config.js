const nodemailer = require("nodemailer");
const { appmail, appmail_password } = require("../../config/index");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appmail,
    pass: appmail_password,
  },
});

module.exports = {
    transporter: transporter,
    appmail
};