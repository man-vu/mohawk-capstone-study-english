const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const UserModel = new (require("../../models/user"))();
const { validateEmail, validateGender, validateName, validateNewPassword,
} = require("../validators/validator");
const { hashPasswordAsync } = require("../../misc/helper");

module.exports = {
  /**
   * Function loads all users regardless of students or teachers
   */
  getUsers: async () => {
    const users = await UserModel.findAll();

    if (!users.error) {
      return sendSuccess(users.response);
    } else {
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },

  /**
   * Function loads only all students 
   */
  getAllStudents: async () => {
    const students = await UserModel.findAllStudents();

    if (!students.error) {
      return sendSuccess(students.response);
    } else {
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },

  /**
   * Function loads a user's information
   */
  getUser: async (id) => {
    const user = await UserModel.findOneById(id);

    if (!user.error) {
      if (user.response.length === 0) {
        return sendFailure(STRINGS.NO_SUCH_USER_EXISTS);
      } else {
        return sendSuccess(user.response[0]);
      }
    } else {
      console.log(user.error)
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

    const userInfo = await UserModel.saveOne(
      id,
      email,
      firstName,
      lastName,
      gender
    );

    if (!userInfo.error) {
      if (userInfo.response.affectedRows === 1) {
        return sendSuccess(200);
      } else {
        console.log(userInfo.error)
        return sendFailure(STRINGS.CANNOT_SAVE_USER_INFO);
      }
    } else {
      console.log(userInfo.error)
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

      const userInfo = await UserModel.savePassword({
        userId: id,
        ...passwordInfo,
      });

      if (userInfo.response.affectedRows === 1) {
        return sendSuccess(200);
      } else {
        console.log(userInfo.error)
        return sendFailure(STRINGS.CANNOT_SAVE_NEW_PASSWORD);
      }
    } else {
      return sendFailure(
        STRINGS.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD_AND_AT_LEAST_8_CHARACTERS
      );
    }
  },
};
