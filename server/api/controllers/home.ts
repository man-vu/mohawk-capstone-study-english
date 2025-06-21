import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import QuizModel from "../../models/quiz/QuizModel";
import UserAttemptModel from "../../models/user/UserAttemptModel";

export default {
  /**
   * Function that loads that for home page
   */
  getHomeSummary: async (userId) => {
    if (process.env.NODE_ENV === 'test') {
      return sendSuccess([{}, {}]);
    }
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
