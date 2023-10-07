const { expect } = require("chai");
const STRINGS = require("../../../config/strings");
const threadsController = require("../../controllers/threads");
const discussionHelper = require("../helpers/discussion");

describe("ThreadsController: CreateThread", () => {
  it(`Should log ${STRINGS.THREAD_TITLE_MUST_BE_AT_LEAST_20_CHARACTERS}`, async () => {
    const data = {
      subject: "abc",
      description: "",
      selectedRelatedQuizId: "M",
      userId: 1,
    };

    const actual = await threadsController.createThread(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(
      STRINGS.THREAD_TITLE_MUST_BE_AT_LEAST_20_CHARACTERS
    );
    expect(actual.response).to.equal(null);
  });

  it(`Should log ${STRINGS.THREAD_DESCRIPTION_CANNOT_BE_LEFT_BLANK}`, async () => {
    const data = {
      subject:
        "Dolore mollit voluptate deserunt est enim ut aliqua esse laborum.",
      description: "",
      selectedRelatedQuizId: "M",
      userId: 1,
    };

    const actual = await threadsController.createThread(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(
      STRINGS.THREAD_DESCRIPTION_CANNOT_BE_LEFT_BLANK
    );
    expect(actual.response).to.equal(null);
  });

  it(`Should log ${STRINGS.SELECT_RELATED_QUIZ_CANNOT_BE_LEFT_BLANK}`, async () => {
    const data = {
      subject:
        "Dolore mollit voluptate deserunt est enim ut aliqua esse laborum.",
      description:
        "Magna occaecat et ex elit aliqua veniam commodo in irure reprehenderit nulla incididunt.",
      selectedRelatedQuizId: "",
      userId: 1,
    };

    const actual = await threadsController.createThread(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(
      STRINGS.SELECT_RELATED_QUIZ_CANNOT_BE_LEFT_BLANK
    );
    expect(actual.response).to.equal(null);
  });

  it(`Should create a new thread successsfully`, async () => {
    const data = {
      subject:
        "Dolore mollit voluptate deserunt est enim ut aliqua esse laborum.",
      description:
        "Magna occaecat et ex elit aliqua veniam commodo in irure reprehenderit nulla incididunt.",
      selectedRelatedQuizId: "1",
      userId: 1,
    };

    try {
      const actual = await threadsController.createThread(data);
      expect(actual.statusCode).to.equal(201);
      expect(actual.error).to.be.null;
      expect(actual.response).to.be.an("object");
      expect(actual.response.newThreadId).to.be.an("number");

      if (!actual.error) {
        data.thread_id = actual.response.newThreadId;
      }
    } finally {
      const result = await discussionHelper.deleteThreads([data]);
    }
  });
});

describe("ThreadsController: getThread", () => {
  it(`Should a thread with all its posts`, async () => {
    const threadId = 1;

    const actual = await threadsController.getThread(threadId);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("object");
  });
});
