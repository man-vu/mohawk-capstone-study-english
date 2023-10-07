const { expect } = require("chai");
const STRINGS = require("../../../config/strings");
const { deletePost } = require("../../controllers/posts");
const postsController = require("../../controllers/posts");
const discussionHelper = require("../helpers/discussion");

const { posts, threads, addPosts, addThreads, deleteThreads, deletePosts } = require("../helpers/discussion");

before(async function() {
  await addThreads(threads);
  await addPosts(posts);
});

after(async function() {
  await deleteThreads(threads);
});

describe("PostsController: CreatePost", () => {
  it(`Should log invalid thread id error`, async () => {
    const data = {
      threadId: -1,
      content:
        "Tempor proident culpa pariatur cupidatat consectetur duis proident esse officia.",
      userId: 1,
    };

    const actual = await postsController.createPost(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_THREAD_ID);
    expect(actual.response).to.equal(null);
  });

  it(`Should log content length issue`, async () => {
    const data = {
      threadId: 1,
      content: "ewrewr",
      userId: 1,
    };

    const actual = await postsController.createPost(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(
      STRINGS.CONTENT_MUST_BE_AT_LEAST_30_CHARACTERS
    );
    expect(actual.response).to.equal(null);
  });

  it(`Should create a new post successfully`, async () => {
    const data = {
      threadId: threads[0].thread_id,
      content:
        "Sint commodo ex elit id nulla sit ipsum proident est minim elit voluptate non occaecat.",
      userId: 1,
    };

    try {
      const actual = await postsController.createPost(data);
      expect(actual.statusCode).to.equal(201);
      expect(actual.error).to.equal(null);
      expect(typeof actual.response).to.equal("object");

      if (!actual.error) {
        data.post_id = actual.response.post_id;
      }
    } finally {
      await discussionHelper.deletePosts([data]);
    }
  });
});

describe("PostsController: GetPost", () => {
  it(`Should log invalid post id error`, async () => {
    const id = -1;

    const actual = await postsController.getPost(id);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_POST_ID);
    expect(actual.response).to.equal(null);
  });

  it(`Should get a new post successfully`, async () => {
    const id = 1;

    const actual = await postsController.getPost(id);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(typeof actual.response).to.equal("object");
  });
});

describe("PostsController: deletePost", () => {
  it(`Should log invalid post id error`, async () => {
    const id = -1;

    const actual = await postsController.deletePost(id);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_POST_ID);
    expect(actual.response).to.equal(null);
  });

  it(`Should delete a new post successfully`, async () => {
    const actual = await postsController.deletePost(posts[0].post_id);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(typeof actual.response).to.equal("object");
  });
});
