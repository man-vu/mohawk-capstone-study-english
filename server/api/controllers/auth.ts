import jwt from "jsonwebtoken";
import {
  jwt_secret_key,
  jwt_expiry_time,
  password_reset_expiry_time,
  datetime_format,
} from "../../config/index";
import { hashPasswordAsync, checkPassword, getAvatarUrl } from "../../misc/helper";
import STRINGS from "../../config/strings";
import { sendSuccess, sendFailure } from "../../config/res";
import validator from "../validators/validator";
import AppUserModel from "../../models/auth/AppUserModel";
import MimeTypeModel from "../../models/media/MimeTypeModel";
import { sendPasswordReset } from "../../services/email_notification/passwordReset";
import passwordGenerator from "generate-password";
import moment from "moment";

export default {
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

    if (!validator.validateName(firstName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_FIRST_NAME);
    }

    if (!validator.validateName(lastName)) {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_LAST_NAME);
    }

    if (!validator.validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }
    if (!validator.validatePassword(password)) {
      return sendFailure(STRINGS.PASSWORD_MUST_BE_AT_LEAST());
    }
    if (profilePictureId !== undefined && !validator.validateProfilePictureId(profilePictureId)) {
      return sendFailure(STRINGS.INVALID_PROFILE_PICTURE_ID);
    }
    if (!validator.validateGender(gender)) {
      return sendFailure(STRINGS.INVALID_GENDER);
    }
    if (!validator.validateRoleId(roleId)) {
      return sendFailure(STRINGS.INVALID_ROLE_ID);
    }

    // Generate hash and salt out of password
    const { passwordHash, passwordSalt } = await hashPasswordAsync(password);

    try {
      const createData: any = {
        Email: email,
        PasswordHash: passwordHash,
        PasswordSalt: passwordSalt,
        Gender: gender,
        RoleId: parseInt(roleId, 10),
        FirstName: firstName,
        LastName: lastName,
      };
      if (profilePictureId !== undefined) {
        createData.ProfilePictureId = Number(profilePictureId);
      }

      const user = await AppUserModel.create(createData);

      const userId = user.UserId;
      const isTeacher = Number(roleId) === 1;
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
        profilePictureId: profilePictureId,
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
    if (!validator.validateEmail(email)) {
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

    if (!validator.validateEmail(email)) {
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

  verify: async (userId) => {
    try {
      const user = await AppUserModel.findById(userId);
      if (!user) return sendFailure(404, STRINGS.NO_SUCH_USER_EXISTS);
      const avatarId = user.ProfilePictureId;
      const mime = avatarId ? await MimeTypeModel.findOne(avatarId) : null;
      const avatarUrl = mime && mime.ImageUrl !== 'default-profile-picture.png'
        ? mime.ImageUrl
        : getAvatarUrl(user.FirstName);
      return sendSuccess({
        firstName: user.FirstName,
        lastName: user.LastName,
        email: user.Email,
        isTeacher: user.RoleId === 1,
        avatarUrl,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
