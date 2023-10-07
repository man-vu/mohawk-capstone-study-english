const { expect } = require("chai");
const STRINGS = require("../../../config/strings");
const discussionController = require("../../controllers/discussion");
const {
  posts,
  threads,
  addPosts,
  addThreads,
  deleteThreads,
  deletePosts,
} = require("../helpers/discussion");

// before(async function() {
//   await addThreads(threads);
//   await addPosts(posts);
// });

// after(async function() {
//   await deleteThreads(threads);
// });

describe("DiscussionController: getDataForDiscussion", () => {
  it(`Should load all threads`, async () => {
    const actual = await discussionController.getDataForDiscussion();
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("object");

    expect(actual.response.quizzes).to.be.an("array");
    expect(actual.response.skills).to.be.an("array");
    expect(actual.response.threads).to.be.an("array");
    expect(actual.response.users).to.be.an("array");

    expect(actual.response.threads.length).to.be.greaterThanOrEqual(3)
  });
});
