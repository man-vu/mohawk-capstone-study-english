import { expect } from "chai";
import STRINGS from "../../../config/strings.ts";
import quizzesController from "../../controllers/quizzes.ts";

describe("QuizzesController: getQuiz", () => {
  it("Should fail with invalid quiz id", async () => {
    const actual = await quizzesController.getQuiz("abc");
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_QUIZ_ID);
  });
});

describe("QuizzesController: startQuiz", () => {
  it("Should fail with invalid ids", async () => {
    const actual = await quizzesController.startQuiz("a", "b");
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_QUIZ_ID);
  });
});

describe("QuizzesController: setRating", () => {
  it("Should fail with invalid rating", async () => {
    const actual = await quizzesController.setRating({ quizId: 1, userId: 1, ratingGiven: 6 });
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.RATING_MUST_BE_BETWEEN_1_AND_5);
  });
});
