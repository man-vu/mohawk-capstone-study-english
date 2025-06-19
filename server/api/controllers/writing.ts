const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const WritingAssessmentModel = require("../../models/WritingAssessmentModel.ts").default;

module.exports = {
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
