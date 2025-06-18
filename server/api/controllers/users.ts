const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const AppUserModel = require("../../models/AppUserModel.ts").default;
const { validateEmail, validateGender, validateName, validateNewPassword,
} = require("../validators/validator");
const { hashPasswordAsync } = require("../../misc/helper");

module.exports = {
  /**
   * Function loads all users regardless of students or teachers
   */
  getUsers: async () => {
    try {
      const users = await AppUserModel.findAll();
      return sendSuccess(users);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },

  /**
   * Function loads only all students 
   */
  getAllStudents: async () => {
    try {
      const students = await AppUserModel.findAllStudents();
      return sendSuccess(students);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },

  /**
   * Function loads a user's information
   */
  getUser: async (id) => {
    try {
      const user = await AppUserModel.findById(id);
      if (!user) {
        return sendFailure(STRINGS.NO_SUCH_USER_EXISTS);
      }
      return sendSuccess(user);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that updates user's information except password
   */
  updateUser: async (data) => {
    const { id, email, firstName, lastName, gender } = data;

    if (!validateName(firstName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_FIRST_NAME);
    }

    if (!validateName(lastName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_LAST_NAME);
    }

    if (!validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }
    if (!validateGender(gender)) {
      return sendFailure(STRINGS.INVALID_GENDER);
    }

    try {
      await AppUserModel.update(id, {
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
      });
      return sendSuccess(200);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_SAVE_USER_INFO);
    }
  },
  /**
   * Function updates user password
   */
  updatePassword: async (data) => {
    const { id, currentPassword, newPassword } = data;

    const validated = validateNewPassword(currentPassword, newPassword);

    if (validated === true) {
      const passwordInfo = await hashPasswordAsync(newPassword);

      try {
        await AppUserModel.update(id, {
          PasswordHash: passwordInfo.passwordHash,
          PasswordSalt: passwordInfo.passwordSalt,
        });
        return sendSuccess(200);
      } catch (error) {
        console.log(error);
        return sendFailure(STRINGS.CANNOT_SAVE_NEW_PASSWORD);
      }
    } else {
      return sendFailure(
        STRINGS.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD_AND_AT_LEAST_8_CHARACTERS
      );
    }
  },
};
