const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const UserModel = new (require("../../models/user"))();
const MimeTypeModel = new (require("../../models/mime_type"))();

module.exports = {
  /**
   * Function that inserts an avatar into mime_type table after it has been uploaded to AWS Bucket
   */
  insertAvatar: async (data) => {
    const image_alt = `${data.userId}''s profile picture`;

    const newAvatar = await MimeTypeModel.addOne({
      image_url: data.savedFilename,
      image_alt,
    });

    if (!newAvatar.error) {
      if (newAvatar.response.affectedRows === 1) {
        return sendSuccess({
          mimeId: newAvatar.response.insertId,
          savedFilename: data.savedFilename,
        });
      } else {
        return sendFailure(STRINGS.ERROR_OCCURRED);
      }
    } else {
      console.log(newAvatar.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that updates avatar of a user
   */
  updateAvatar: async (data) => {
    const updateAvatar = await UserModel.saveProfilePicture(data);

    if (!updateAvatar.error) {
      if (updateAvatar.response.affectedRows === 1) {
        return sendSuccess(204);
      } else {
        return sendFailure(STRINGS.ERROR_OCCURRED);
      }
    } else {
      console.log(updateAvatar.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
