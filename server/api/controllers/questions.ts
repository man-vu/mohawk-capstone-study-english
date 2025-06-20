import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import UserAnswerModel from "../../models/user/UserAnswerModel";
import QuizQuestionModel from "../../models/quiz/QuizQuestionModel";
import QuestionModel from "../../models/question/QuestionModel";
import QuizPartModel from "../../models/quiz/QuizPartModel";
import MCModel from "../../models/question/QuestionMultipleChoiceModel";
import GModel from "../../models/question/QuestionGapFillingModel";
import PromptModel from "../../models/question/MatchingPromptModel";
import ChoiceModel from "../../models/question/MatchingChoiceModel";
import AttemptModel from "../../models/user/UserAttemptModel";
import InstructionModel from "../../models/question/QuestionInstructionModel";
import * as validator from "../validators/validator";

/**
 * Helper function that creates question content by question type id
 * @param {*} questionId 
 * @param {*} typeId 
 * @param {*} items 
 * @param {*} correctAnswers 
 * @param {*} shuffleAnswers 
 */
async function createQuestionContent(
  questionId,
  typeId,
  items,
  correctAnswers,
  shuffleAnswers
) {
  try {
    if (typeId === 1) {
      const data = items.map((i) => ({
        QuestionId: questionId,
        ChoiceText: i.choice_text,
        ChoiceOrder: i.choice_id,
        IsCorrect: !!i.is_correct_choice,
      }));
      await MCModel.createMany(data);
      return sendSuccess(201);
    } else if (typeId === 2) {
      const data = items.map((i) => ({
        QuestionId: questionId,
        SequenceId: i.sequence_id,
        CorrectAnswer: i.correct_answer,
      }));
      await GModel.createMany(data);
      return sendSuccess(201);
    } else if (typeId === 3) {
      const left = items.leftItems || [];
      const right = items.rightItems || [];
      const prompts = left.map((l, idx) => ({
        QuestionId: questionId,
        LeftText: l.item,
        PromptOrder: idx + 1,
      }));
      const choices = right.map((r, idx) => ({
        QuestionId: questionId,
        RightText: r.item,
        ChoiceOrder: idx + 1,
      }));
      if (prompts.length > 0) await PromptModel.createMany(prompts);
      if (choices.length > 0) await ChoiceModel.createMany(choices);
      return sendSuccess(201);
    }
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.CANNOT_CREATE_QUESTION_CONTENT);
  }
}

/**
 * Function that creates a link between a quiz and a question
 * @param {*} quizId 
 * @param {*} questionId 
 */
async function createBridgingQuizAndQuestion(quizId, questionId) {
  try {
    const parts = await QuizPartModel.findAllByQuiz(quizId);
    const partId = parts[0]?.PartId ?? 1;
    await QuizQuestionModel.create({
      Quiz: { connect: { QuizId: quizId } },
      Question: { connect: { QuestionId: questionId } },
      QuizPart: { connect: { PartId: partId } },
    });
    return sendSuccess(201);
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.CANNOT_CREATE_LINKING_BETWEEN_QUIZ_AND_QUESTION);
  }
}

/**
 * A helpler function that creates instruction
 * @param {*} instruction 
 */
async function createInstruction(instruction) {
  try {
    const exist = await InstructionModel.findByInstruction(instruction);
    if (exist) {
      return sendSuccess(201, { InstructionId: exist.InstructionId });
    }
    const newInst = await InstructionModel.create({ Instruction: instruction });
    return sendSuccess(201, { InstructionId: newInst.InstructionId });
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
  }
}

/**
 * Function that loads instruction info
 * @param {*} instruction 
 */
async function getInstruction(instruction) {
  try {
    const result = await InstructionModel.findByInstruction(instruction);
    if (result) {
      return sendSuccess(result);
    }
    return sendFailure(STRINGS.CANNOT_LOAD_INSTRUCTION);
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.CANNOT_LOAD_INSTRUCTION);
  }
}

/**
 * Function that finds and updates incomplete attempts
 * @param {*} quizId 
 * @param {*} questionId 
 */
async function updateIncompleteAttempts(quizId, questionId) {
  try {
    const attempts = await AttemptModel.findIncompleteAttemptsByQuizId(quizId);
    for (const attempt of attempts) {
      await UserAnswerModel.create({
        AnswerText: '',
        UserAttempt: { connect: { AttemptId: attempt.AttemptId } },
        Question: { connect: { QuestionId: questionId } },
      });
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {
  /**
   * Function that creates a new question
   */
  createQuestion: async (data) => {
    const { typeId, items, question, instruction, quizId } = data;

    if (!instruction) {
      return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
    }
    if (!validator.validateQuizId(quizId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    if (!validator.validateQuestionTypeId(typeId)) {
      return sendFailure(STRINGS.INVALID_QUESTION_TYPE_ID);
    }
    if (!validator.validateQuestion(question)) {
      return sendFailure(STRINGS.CANNOT_CREATE_BLANK_QUESTION);
    }
    if (!validator.validateQuestionItems(typeId, items)) {
      return sendFailure(STRINGS.QUESTION_ITEMS_VALIDATION_ERROR(typeId));
    }
    if (!validator.validateIsActiveQuestion(data.isActive)) {
      return sendFailure(STRINGS.INVALID_IS_ACTIVE_VALUE);
    }

    const isActive = data.isActive === true ? 1 : 0;

    let paragraphTitle = !!data.paragraphTitle ? null : data.paragraphTitle;
    let correctAnswers = data.correctAnswers;
    let shuffleAnswers = data.shuffleAnswers ? data.shuffleAnswers : 1;

    // Create or reuse instruction
    const create = await createInstruction(instruction);

    if (!create.error) {
      const instructionId = create.response.InstructionId;

      try {
        const q = await QuestionModel.create({
          IsActive: !!isActive,
          ParagraphTitle: paragraphTitle,
          QuestionText: question,
          QuestionType: { connect: { TypeId: typeId } },
          QuestionInstruction: { connect: { InstructionId: instructionId } },
        });

        const questionId = q.QuestionId;

        const bridge = await createBridgingQuizAndQuestion(quizId, questionId);
        const content = await createQuestionContent(
          questionId,
          typeId,
          items,
          correctAnswers,
          shuffleAnswers
        );

        await updateIncompleteAttempts(quizId, questionId);

        if (!bridge.error && !content.error) {
          return sendSuccess(201, { question_id: questionId });
        }
        console.log(bridge.error);
        console.log(content.error);
        return sendFailure(STRINGS.CANNOT_CREATE_QUESTION);
      } catch (err) {
        console.log(err);
        return sendFailure(STRINGS.CANNOT_CREATE_QUESTION);
      }
    } else {
      console.log(create.error);
      return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
    }
  },
  /**
   * Function that updates a user answer
   */
  updateAnswer: async (data) => {
    const { questionId, attemptId, answerText } = data;
    const qId = Number(questionId);
    const aId = Number(attemptId);
    if (Number.isNaN(qId) || Number.isNaN(aId)) {
      return sendFailure(STRINGS.INVALID_QUESTION_ID);
    }
    try {
      await UserAnswerModel.updateByAttemptAndQuestion(aId, qId, { AnswerText: answerText });
      return sendSuccess(200, null);
    } catch (error) {
      console.log(error);
      return sendFailure(200, STRINGS.CANNOT_UPDATE_ANSWER);
    }
  },
};
