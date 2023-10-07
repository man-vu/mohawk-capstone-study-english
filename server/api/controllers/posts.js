const STRINGS = require("../../config/strings");
const { sendSuccess, sendFailure } = require("../../config/res");
const PostModel = new (require("../../models/post"))();
const { getAvatarUrl } = require("../../misc/helper");

module.exports = {
  /**
   * Function creates post based on provided information
   */
  createPost: async (data) => {
    const { threadId, content, userId } = data;

    if (!threadId || threadId < 1) {
      return sendFailure(STRINGS.INVALID_THREAD_ID);
    }

    if (!content || content.length < 30) {
      return sendFailure(STRINGS.CONTENT_MUST_BE_AT_LEAST_30_CHARACTERS);
    }

    let newPost = await PostModel.addOne(threadId, content, userId);

    if (!newPost.error && newPost.response.affectedRows === 1) {
      const newId = newPost.response.insertId;

      let posts = await PostModel.findDetailed(newId);

      if (!posts.error) {
        for (const post of posts.response) {
          if (post.avatarUrl === "default-profile-picture.png") {
            post.avatarUrl = getAvatarUrl(post.full_name)
          }
        }

        return sendSuccess(201, { ...posts.response[0], post_id: newPost.response.insertId});
      } else {
        console.log(posts.error)
        return sendFailure(STRINGS.CANNOT_LOAD_POST);
      }
    } else {
      console.log(newPost.error)
      return sendFailure(STRINGS.CANNOT_CREATE_POST);
    }
  },
  /**
   * Function that loads a post by id
   */
  getPost: async (id) => {
    if (!id || id < 1) {
      return sendFailure(STRINGS.INVALID_POST_ID)
    }

    let post = await PostModel.findDetailed(id);

    if (!post.error) {
      return sendSuccess(post.response);
    } else {
      console.log(post.error)
      return sendFailure(STRINGS.CANNOT_LOAD_POST);
    }
  },
  /**
   * Function that deletes a post by id
   */
  deletePost: async (id) => {
    if (!id || id < 1) {
      return sendFailure(STRINGS.INVALID_POST_ID)
    }

    const post = await PostModel.deleteOne(id);

    if (!post.error) {
      return sendSuccess(post.response);
    } else {
      console.log(post.error)
      return sendFailure(STRINGS.CANNOT_LOAD_POST);
    }
  },
};
