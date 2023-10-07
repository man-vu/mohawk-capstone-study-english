const { sendSuccess, sendFailure } = require("../../config/res");
const { getAvatarUrl } = require("../../misc/helper");
const STRINGS = require("../../config/strings");
const ThreadModel = new(require("../../models/thread"))();
const PostModel = new(require("../../models/post"))();

module.exports = {
  /**
   * Function creates a thread from discussion area
   */
  createThread: async (data) => {
    const { subject, description, selectedRelatedQuizId } = data;

    if (!subject || subject.length < 20) {
      return sendFailure(STRINGS.THREAD_TITLE_MUST_BE_AT_LEAST_20_CHARACTERS);
    }

    if (!description || description.length === 0) {
      return sendFailure(STRINGS.THREAD_DESCRIPTION_CANNOT_BE_LEFT_BLANK);
    }

    if (!selectedRelatedQuizId || selectedRelatedQuizId < 0) {
      return sendFailure(STRINGS.SELECT_RELATED_QUIZ_CANNOT_BE_LEFT_BLANK);
    }

    const newThread = await ThreadModel.addOne(data);

    if (!newThread.error && newThread.response.affectedRows === 1) {
      const newThreadId = newThread.response.insertId;

      return sendSuccess(201, { newThreadId });
    } else {
      console.log(newThread)
      return sendFailure(STRINGS.CANNOT_CREATE_THREAD);
    }
  },
  /**
   * Function that gets a thread and all related posts by id
   */
  getThread: async (id) => {
    let thread = await ThreadModel.findOne(id);
    let posts = await PostModel.findMany(id);

    if (!thread.error && !posts.error) {
      if (thread.response.length > 0 && thread.response[0].avatarUrl === "default-profile-picture.png") {
        thread.response[0].avatarUrl = getAvatarUrl(thread.response[0].full_name)
      }

      for (const post of posts.response) {
        if (post.avatarUrl === "default-profile-picture.png") {
          post.avatarUrl = getAvatarUrl(post.full_name)
        }
      }

      return sendSuccess({ ...thread.response[0], posts: posts.response });
    } else {
      console.log(thread.error )
      console.log(posts.error )
      return sendFailure(STRINGS.CANNOT_LOAD_THREAD)
    }
  }
};
