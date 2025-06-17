const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const QuizSkillModel = require("../../new_models/QuizSkillModel.ts").default;
const UserRatingModel = require("../../new_models/UserRatingModel.ts").default;
const QuestionTypeModel = require("../../new_models/QuestionTypeModel.ts").default;
const QuizModel = require("../../new_models/QuizModel.ts").default;
const QuestionModel = require("../../new_models/QuestionModel.ts").default;
const MCModel = require("../../new_models/QuestionMultipleChoiceModel.ts").default;
const GModel = require("../../new_models/QuestionGapFillingModel.ts").default;
const MModel = require("../../new_models/QuestionMatchingPairModel.ts").default;
const InstructionModel = require("../../new_models/QuestionInstructionModel.ts").default;
const validator = require("../validators/validator");

/**
 * A helper function that creates instruction
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
 * A helper function that loads instruction
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
 * Function that updates the content of a question
 * @param {*} questionId 
 * @param {*} typeId 
 * @param {*} items 
 * @param {*} correctAnswers 
 * @param {*} shuffleAnswers 
 */
async function updateQuestionContent(
  questionId,
  typeId,
  items,
) {
  try {
    if (typeId === 1) {
      await MCModel.updateMany(questionId, items);
    } else if (typeId === 2) {
      await GModel.updateMany(questionId, items);
    } else if (typeId === 3) {
      await MModel.updateMany(questionId, [...items.leftItems, ...items.rightItems]);
    }
    return sendSuccess(201);
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.ERROR_OCCURRED);
  }
}

/**
 * Function that loads question content
 * @param {*} id 
 * @param {*} typeId 
 * @param {*} questionData 
 */
async function getQuestionContent(id, typeId, questionData) {
  try {
    if (typeId === 1) {
      const content = await MCModel.findManyByQuestion(id);
      return sendSuccess({ ...questionData, items: content });
    } else if (typeId === 2) {
      const content = await GModel.findManyByQuestion(id);
      return sendSuccess({ ...questionData, items: content });
    } else {
      const pairs = await MModel.findManyByQuestion(id);
      const leftItems = pairs.filter((p) => p.PairOrder % 2 === 1).map((p) => ({
        letter: String.fromCharCode(64 + p.PairOrder),
        item: p.LeftText,
      }));
      const rightItems = pairs.filter((p) => p.PairOrder % 2 === 0).map((p) => ({
        letter: String.fromCharCode(64 + p.PairOrder),
        item: p.RightText,
      }));
      return sendSuccess({ items: { leftItems, rightItems }, ...questionData });
    }
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
  }
}

module.exports = {
  /**
   * Function that reset all ratings given by student for a quiz
   */
  resetRatings: async (quizId) => {
    try {
      await UserRatingModel.deleteManyByQuiz(quizId);
      return sendSuccess(200, null);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that loads a quiz for edit
   */
  getQuizForEdit: async (quizId) => {
    if (!validator.validateQuizId(quizId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    try {
      const questions = await QuestionModel.findManyByQuizIdForEdit(quizId);
      return sendSuccess(questions);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that loads a question for editing 
   */
  getQuestionForEdit: async (id) => {
    if (!id || id < 1) {
      return sendFailure(STRINGS.INVALID_QUESTION_ID);
    }
    try {
      const questionData = await QuestionModel.findOneForEdit(id);
      if (!questionData) return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
      const typeId = questionData.type_id;
      return await getQuestionContent(id, typeId, {
        ...questionData,
        isActive: questionData.is_active ? true : false,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
    }
  },
  /**
   * Function that loads information for teacher page
   */
  getTeacherHome: async () => {
    try {
      const quizzes = await QuizModel.findAllForTeacher();
      const allSkills = await QuizSkillModel.findAll();
      const questionTypes = await QuestionTypeModel.findAll();
      return sendSuccess({
        quizzes,
        allSkills,
        allQuestionTypes: questionTypes,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_LOADING_TEACHER_PAGE);
    }
  },
  /**
   * Function that deletes a quiz
   */
  deleteQuiz: async (quizId) => {
    if (!validator.validateQuizId(quizId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    try {
      await QuizModel.delete(quizId);
      return sendSuccess(202);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function that updates a question
   */
  updateQuestion: async (data) => {
    const { questionId, instruction, isActive, typeId, items, correctAnswers } = data;

    if (!validator.validateQuestionId(questionId)) {
      return sendFailure(STRINGS.INVALID_QUESTION_ID);
    }

    const create = await createInstruction(instruction);

    if (!create.error) {
      let instructionId = create.response.InstructionId;

      if (!instructionId) {
        const findInstruction = await getInstruction(instruction);
        if (!findInstruction.error) {
          instructionId = findInstruction.response.InstructionId;
        } else {
          return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
        }
      }

      if (instructionId) {
        const isActiveFlag = isActive === true ? 1 : 0;
        try {
          await QuestionModel.saveOne({
            ...data,
            instructionId,
            isActive: isActiveFlag,
          });
          await updateQuestionContent(questionId, typeId, items);
          return sendSuccess(202);
        } catch (error) {
          console.log(error);
          return sendFailure(STRINGS.ERROR_OCCURRED);
        }
      }
    }
    return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
  },
  deleteQuestion: async (questionId) => {
    if (!validator.validateQuestionId(questionId)) {
      return sendFailure(STRINGS.INVALID_QUESTION_ID);
    }
    try {
      await QuestionModel.delete(questionId);
      return sendSuccess(202);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
