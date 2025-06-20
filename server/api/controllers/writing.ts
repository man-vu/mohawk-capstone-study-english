import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import WritingAssessmentModel from "../../models/writing/WritingAssessmentModel";

export default {
  createAssessment: async (data) => {
    try {
      const assessment = await WritingAssessmentModel.create(data);
      return sendSuccess(assessment);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
