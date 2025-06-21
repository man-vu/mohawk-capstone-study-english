import { expect } from "chai";
import STRINGS from "../../../config/strings.ts";
import questionsController from "../../controllers/questions.ts";

describe("QuestionsController: createQuestion", () => {
  it("Should fail when instruction is missing", async () => {
    const data = { quizId: 1, typeId: 1, question: "", items: [], isActive: true };
    const actual = await questionsController.createQuestion(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.CANNOT_CREATE_INSTRUCTION);
  });

  it("Should fail with invalid quiz id", async () => {
    const data = { instruction: "text", quizId: "abc", typeId: 1, question: "Q", items: [{ choice_text: "a", choice_id: 1, is_correct_choice: 1 }], isActive: true };
    const actual = await questionsController.createQuestion(data);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_QUIZ_ID);
  });
});

describe("QuestionsController: updateAnswer", () => {
  it("Should fail with invalid ids", async () => {
    const actual = await questionsController.updateAnswer({ questionId: "a", attemptId: "b", answerText: "" });
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.INVALID_QUESTION_ID);
  });
});
