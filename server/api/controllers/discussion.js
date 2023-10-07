const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const { getAvatarUrl } = require("../../misc/helper");
const ThreadModel = new (require("../../models/thread"))();
const SkillModel = new (require("../../models/skill"))();
const QuizModel = new (require("../../models/quiz"))();
const UserModel = new (require("../../models/user"))();

function assignAvatars(threads) {
  for (const thread of threads) {
    if (thread.thread_starter_avatar_url === "default-profile-picture.png") {
      thread.thread_starter_avatar_url = getAvatarUrl(thread.first_name)
    }
  }
}

module.exports = {
  /**
   * Function loads data for discussion forum, including all threads, all skills, all quizzes and all users.
   */
  getDataForDiscussion: async () => {
    const threads = await ThreadModel.findAll();
    const allSkills = await SkillModel.findAll();
    const quizzes = await QuizModel.findAll();
    const users = await UserModel.findAll();

    if (!threads.error && !allSkills.error && !quizzes.error && !users.error) {  
      assignAvatars(threads.response)

      return sendSuccess({
        threads: threads.response,
        skills: allSkills.response,
        quizzes: quizzes.response,
        users: users.response,
      });
    } else {
      console.log(threads.error)
      console.log(allSkills.error)
      console.log(quizzes.error)
      console.log(users.error)

      return sendFailure(STRINGS.CANNOT_LOAD_THREADS);
    }
  },
  /**
   * Function finds threads based on provided predicates from user
   */
  findThreads: async (data) => {
    const { subject, quizId, userId, dateCreated } = data;

    const threads = await ThreadModel.findMany(data);

    if (!threads.error) {
      assignAvatars(threads.response)
      return sendSuccess(threads.response);
    } else {
      console.log(threads.error)
      return sendFailure(STRINGS.CANNOT_LOAD_THREADS);
    }
  },
};
