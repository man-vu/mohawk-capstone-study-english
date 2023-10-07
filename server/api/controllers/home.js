const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const HomeModel = new (require("../../models/home"))();
const AttemptModel = new (require("../../models/attempt"))();

module.exports = {
  /**
   * Function that loads that for home page
   */
  getHomeSummary: async (userId) => {
    let homeSummary;
    let incompleteAttempts;
    if (userId) {
      homeSummary = await HomeModel.getHomeSummary(userId);
      incompleteAttempts = await AttemptModel.findManyIncompleteAttempts( userId );
    } else {
      homeSummary = await HomeModel.getHomeSummaryForGuest();
      incompleteAttempts = { error: null, response: null };
    }

    if (!homeSummary.error && !incompleteAttempts.error) {
      const response = homeSummary.response

      if (userId) {
        const latestAttempts = incompleteAttempts.response

        for (const quiz of response) {
          const existLatestAttempt = latestAttempts.find(i => i.quiz_id === quiz.quiz_id)
          if (existLatestAttempt) {
            quiz.latestAttempt = {...existLatestAttempt}
          }
        }
      }
      
      return sendSuccess(response);
    } else {
      console.log(homeSummary.error)
      console.log(incompleteAttempts.error)

      return sendFailure(STRINGS.CANNOT_LOAD_QUIZ);
    }
  },
};
