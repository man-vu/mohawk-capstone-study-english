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
const UserModel = new (require("../../models/user"))();
const MimeTypeModel = new (require("../../models/mime_type"))();
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

    // Add a user
    const user = await UserModel.addOne(
      email,
      passwordHash,
      passwordSalt,
      gender,
      roleId,
      profilePictureId,
      firstName,
      lastName
    );
    

    if (!user.error) {
      if (user.response.affectedRows === 1) {
        const userId = user.response.insertId
        const isTeacher = roleId === 1 ? true : false
        const avatarUrl = getAvatarUrl(firstName)

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
          avatarUrl
        });
      } else {
        console.log(user.error)
        return sendFailure(400, STRINGS.REGISTERING_USER_FAILED);
      }
    } else {
      // console.log(user.error)
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

    // Get user_id and password
    const validatedUser = await UserModel.findOneByEmail(email);

    if (!validatedUser.error) {
      if (validatedUser.response.length === 0) {
        return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_EMAIL);
      } else {
        const passwordHash = validatedUser.response[0].password_hash;
        const firstName = validatedUser.response[0].first_name;
        const lastName = validatedUser.response[0].last_name;
        const userId = validatedUser.response[0].user_id;
        const isTeacher = validatedUser.response[0].role_id === 1 ? true : false;
        const avatarId = validatedUser.response[0].profile_picture_id;
        const passwordResetHash = validatedUser.response[0].password_reset_hash
        const passwordResetSalt = validatedUser.response[0].password_reset_salt
        const passwordExpiry = validatedUser.response[0].password_reset_expiry

        const mime = await MimeTypeModel.findOne(avatarId)
        let success = await checkPassword(password, passwordHash);

        if (passwordResetHash) {
          const currentMoment = moment();
          const difference = currentMoment.diff(moment(passwordExpiry), "seconds");

          if (difference > 0) {
            return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_PASSWORD);
          } else {
            success = await checkPassword(password, passwordResetHash)
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


          let avatarUrl
          if (!mime.error && mime.response.length === 1 && mime.response[0].image_url !== "default-profile-picture.png") {
            avatarUrl = mime.response[0].image_url
          } else {
            avatarUrl = getAvatarUrl(firstName)
          }

          return sendSuccess({ firstName, lastName, isTeacher, email, token, avatarUrl });
        } else {
          return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_PASSWORD);
        }
      }
    } else {
      console.log(validatedUser.error)
      return sendFailure(401, STRINGS.AUTHENTICATION_FAILED);
    }
  },
  passwordReset: async (data) => {
    const { email } = data;

    if (!validateEmail(email)) {
      return sendFailure(STRINGS.EMAIL_IS_NOT_IN_CORRECT_FORMAT);
    }

    if (email) {
      const validatedUser = await UserModel.findOneByEmail(email);

      if (!validatedUser.error) {
        if (validatedUser.response.length === 0) {
          return sendFailure(401, STRINGS.PLEASE_CHECK_YOUR_EMAIL);
        } else {
          const password = passwordGenerator.generate({
            length: 12,
            numbers: true,
            uppercase: true,
          });

          const userId = validatedUser.response[0].user_id

          const { passwordHash, passwordSalt } = await hashPasswordAsync(password);

          const expiredTime = moment().add(password_reset_expiry_time, "seconds").format(datetime_format)

          const addPasswordReset = await UserModel.saveResetPassword({userId, passwordHash, passwordSalt, passwordExpiry: expiredTime})

          if (!addPasswordReset.error) {
            const sendResult = await sendPasswordReset(email, password);

            const statusCode = sendResult.response.substring(0, 3);
  
            if (statusCode === "250") {
              return sendSuccess(200, null);
            } else {
              console.log(sendResult.response)
              return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
            }
          } else {
            return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
          }

        }
      }
    } else {
      return sendFailure(STRINGS.PLEASE_CHECK_YOUR_EMAIL);
    }
  },
};
