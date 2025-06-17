const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
require('ts-node/register/transpile-only');
const QuizModel = require("../../new_models/QuizModel.ts").default;
const UserAttemptModel = require("../../new_models/UserAttemptModel.ts").default;

module.exports = {
  /**
   * Function that loads that for home page
   */
  getHomeSummary: async (userId) => {
    try {
      const response = await QuizModel.getHomeSummary(userId);

      if (userId) {
        const latestAttempts = await UserAttemptModel.findManyIncompleteAttempts(userId);

        for (const quiz of response) {
          const existLatestAttempt = latestAttempts.find((i) => i.quiz_id === quiz.quiz_id);
          if (existLatestAttempt) {
            quiz.latestAttempt = { ...existLatestAttempt };
          }
        }
      }

      return sendSuccess(response);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_LOAD_QUIZ);
    }
  },
};
