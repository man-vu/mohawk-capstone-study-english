const jwt = require("jsonwebtoken");
const { jwt_secret_key, jwt_expiry_time, password_reset_expiry_time, datetime_format } = require("../../config/index");
const { hashPasswordAsync, checkPassword, getAvatarUrl } = require("../../misc/helper");
const STRINGS = require("../../config/strings");
const { sendSuccess, sendFailure } = require("../../config/res");
const {
  validateEmail,
  validatePassword,
  validateProfilePictureId,
  validateGender,
  validateRoleId,
  validateName,
} = require("../validators/validator");
require('ts-node/register/transpile-only');
const AppUserModel = require("../../new_models/AppUserModel.ts").default;
const MimeTypeModel = require("../../new_models/MimeTypeModel.ts").default;
const {
  sendPasswordReset,
} = require("../../services/email_notification/passwordReset");
const passwordGenerator = require("generate-password");
const moment = require("moment");

module.exports = {
  /**
   * Function that registers a user
   */
  register: async (data) => {
    const {
      email,
      gender,
      profilePictureId,
      password,
      roleId,
      firstName,
      lastName,
    } = data;

    if (!validateName(firstName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_FIRST_NAME);
    }

    if (!validateName(lastName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_LAST_NAME);
    }

    if (!validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }
    if (!validatePassword(password)) {
      return sendFailure(STRINGS.PASSWORD_MUST_BE_AT_LEAST());
    }
    if (!validateProfilePictureId(profilePictureId)) {
      return sendFailure(STRINGS.INVALID_PROFILE_PICTURE_ID);
    }
    if (!validateGender(gender)) {
      return sendFailure(STRINGS.INVALID_GENDER);
    }
    if (!validateRoleId(roleId)) {
      return sendFailure(STRINGS.INVALID_ROLE_ID);
    }

    // Generate hash and salt out of password
    const { passwordHash, passwordSalt } = await hashPasswordAsync(password);

    try {
      const user = await AppUserModel.create({
        Email: email,
        PasswordHash: passwordHash,
        PasswordSalt: passwordSalt,
        Gender: gender,
        RoleId: roleId,
        ProfilePictureId: profilePictureId,
        FirstName: firstName,
        LastName: lastName,
      });

      const userId = user.UserId;
      const isTeacher = roleId === 1 ? true : false;
      const avatarUrl = getAvatarUrl(firstName);

      const token = jwt.sign(
        { id: userId, isTeacher: isTeacher },
        jwt_secret_key,
        {
          expiresIn: jwt_expiry_time,
        }
      );

      return sendSuccess(201, {
        email,
        roleId,
        profilePictureId,
        gender,
        firstName,
        lastName,
        token,
        isTeacher,
        avatarUrl,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_REGISTER_USER_WITH_EMAIL(email));
    }
  },
  /**
   * Function that authenticates a user 
   */
  login: async (data) => {
    const { email, password } = data;

    if (!email || !password) {
      return sendFailure(STRINGS.EMAIL_AND_PASSWORD_CANNOT_BE_BLANK);
    }
    if (!validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }

    try {
      const validatedUser = await AppUserModel.findByEmail(email);

      if (!validatedUser) {
        return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_EMAIL);
      }

      const passwordHash = validatedUser.PasswordHash;
      const firstName = validatedUser.FirstName;
      const lastName = validatedUser.LastName;
      const userId = validatedUser.UserId;
      const isTeacher = validatedUser.RoleId === 1 ? true : false;
      const avatarId = validatedUser.ProfilePictureId;
      const passwordResetHash = validatedUser.PasswordResetHash;
      const passwordResetSalt = validatedUser.PasswordResetSalt;
      const passwordExpiry = validatedUser.PasswordResetExpiry;

      const mime = avatarId ? await MimeTypeModel.findOne(avatarId) : null;
      let success = await checkPassword(password, passwordHash);

      if (passwordResetHash) {
        const currentMoment = moment();
        const difference = currentMoment.diff(moment(passwordExpiry), "seconds");

        if (difference > 0) {
          return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_PASSWORD);
        } else {
          success = await checkPassword(password, passwordResetHash);
        }
      }
        

      if (success) {
        let token = jwt.sign(
          { id: userId, isTeacher: isTeacher },
          jwt_secret_key,
          {
            expiresIn: jwt_expiry_time,
          }
        );

        let avatarUrl;
        if (mime && mime.ImageUrl !== "default-profile-picture.png") {
          avatarUrl = mime.ImageUrl;
        } else {
          avatarUrl = getAvatarUrl(firstName);
        }

        return sendSuccess({ firstName, lastName, isTeacher, email, token, avatarUrl });
      } else {
        return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_PASSWORD);
      }
    } catch (error) {
      console.log(error);
      return sendFailure(401, STRINGS.AUTHENTICATION_FAILED);
    }
  },
  passwordReset: async (data) => {
    const { email } = data;

    if (!validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }

    if (email) {
      try {
        const validatedUser = await AppUserModel.findByEmail(email);

        if (!validatedUser) {
          return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_EMAIL);
        }

        const password = passwordGenerator.generate({
          length: 12,
          numbers: true,
          uppercase: true,
        });

        const userId = validatedUser.UserId;

        const { passwordHash, passwordSalt } = await hashPasswordAsync(password);

        const expiredTime = moment()
          .add(password_reset_expiry_time, "seconds")
          .toDate();

        await AppUserModel.update(userId, {
          PasswordResetHash: passwordHash,
          PasswordResetSalt: passwordSalt,
          PasswordResetExpiry: expiredTime,
        });

        const sendResult = await sendPasswordReset(email, password);

        const statusCode = sendResult.response.substring(0, 3);

        if (statusCode === "250") {
          return sendSuccess(200, null);
        } else {
          console.log(sendResult.response);
          return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
        }
      } catch (error) {
        console.log(error);
        return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
      }
    } else {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
    }
  },
};
