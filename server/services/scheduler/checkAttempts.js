const cron = require("node-cron");
const moment = require("moment");
require('ts-node/register/transpile-only');
const UserAttemptModel = require("../../models/UserAttemptModel.ts").default;
const quizzesController = require("../../api/controllers/quizzes.ts");

cron.schedule("*/15 * * * * *", async () => {
  try {
  const attempts = await UserAttemptModel.findAllIncompleteAttempts();
  const currentMoment = moment.utc();

    for (const { start_time, time_allowed, quiz_id, attempt_id, user_id, } of attempts) {
      const expiredTime = moment.utc(start_time).add(time_allowed, "minutes");
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
  } catch (error) {
    console.log(error);
  }
});
