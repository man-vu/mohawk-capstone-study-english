const {transporter, appmail} = require("./config")

module.exports = {
  sendPasswordReset: async function(sendTo, password) {
    const mailOptions = {
      from: appmail,
      to: sendTo,
      subject: "Password reset on Learning English App",
      text: `
      Hello 

      You're receiving this e-mail because you requested a password reset for your user account at Learning English App.

      Please use the following information to log in the site: 
      Email: ${sendTo}
      Password: ${password}
      
      If you didn't request this change, you can disregard this email - we have not yet reset your password.
      
      Thanks for using our site!`,
    };

    return await transporter.sendMail(mailOptions);
  },
};
