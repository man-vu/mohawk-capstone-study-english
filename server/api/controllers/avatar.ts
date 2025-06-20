import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import AppUserModel from "../../models/auth/AppUserModel";
import MimeTypeModel from "../../models/media/MimeTypeModel";

export default {
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
