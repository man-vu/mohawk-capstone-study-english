const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const AppUserModel = require("../../models/auth/AppUserModel.ts").default;
const MimeTypeModel = require("../../models/media/MimeTypeModel.ts").default;

module.exports = {
  /**
   * Function that inserts an avatar into mime_type table after it has been uploaded to AWS Bucket
   */
  insertAvatar: async (data) => {
    const image_alt = `${data.userId}''s profile picture`;

    try {
      const newAvatar = await MimeTypeModel.create({
        ImageUrl: data.savedFilename,
        ImageAlt: image_alt,
      });

      return sendSuccess({
        mimeId: newAvatar.MimeId,
        savedFilename: data.savedFilename,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that updates avatar of a user
   */
  updateAvatar: async (data) => {
    try {
      await AppUserModel.update(data.userId, { ProfilePictureId: data.mimeId });
      return sendSuccess(204);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
