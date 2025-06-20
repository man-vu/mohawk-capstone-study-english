import cron from "node-cron";
import moment from "moment";
import UserAttemptModel from "../../models/user/UserAttemptModel";
import quizzesController from "../../api/controllers/quizzes";

cron.schedule("*/15 * * * * *", async () => {
  try {
    const attempts = await UserAttemptModel.findAllIncompleteAttempts();
    const currentMoment = moment.utc();

    for (const { start_time, time_allowed, quiz_id, attempt_id, user_id } of attempts) {
      const expiredTime = moment.utc(start_time).add(time_allowed, "minutes");
      const difference = currentMoment.diff(expiredTime, "seconds");

      if (difference > 0) {
        await quizzesController.submitAndMark({
          quizId: quiz_id,
          attemptId: attempt_id,
          userId: user_id,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
