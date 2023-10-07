const cron = require("node-cron");
const moment = require("moment");
const AttemptModel = new (require("../../models/attempt"))();
const quizzesController = require("../../api/controllers/quizzes");

cron.schedule("*/15 * * * * *", async () => {
  const attemptsResponse = await AttemptModel.findAllIncompleteAttempts();
  if (!attemptsResponse.error && attemptsResponse.response.length > 0) {
    const attempts = attemptsResponse.response;
    const currentMoment = moment();

    for (const { start_time, time_allowed, quiz_id, attempt_id, user_id, } of attempts) {
      const expiredTime = moment(start_time).add(time_allowed, "minutes");
      const difference = currentMoment.diff(expiredTime, "seconds");

      console.log(difference)
      if (difference > 0) {
          
        const data = {
          quizId: quiz_id,
          attemptId: attempt_id,
          userId: user_id,
        };

        const a = 0;
        const mark = await quizzesController.submitAndMark(data);
      }
    }
  }
});
