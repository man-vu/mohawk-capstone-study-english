const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const HomeModel = new (require("../../models/home"))();
const SkillModel = new (require("../../models/skill"))();
const RatingModel = new (require("../../models/rating"))();
const QuestionTypeModel = new (require("../../models/question_type"))();
const QuizModel = new (require("../../models/quiz"))();
const QuestionModel = new (require("../../models/question"))();
const MCModel = new (require("../../models/multiple_choice_option"))();
const GModel = new (require("../../models/gap_filling_option"))();
const MModel = new (require("../../models/matching_option"))();
const InstructionModel = new (require("../../models/instruction"))();
const validator = require("../validators/validator");

/**
 * A helper function that creates instruction
 * @param {*} instruction 
 */
async function createInstruction(instruction) {
  let createInstruction = await InstructionModel.addOne(instruction);

  if (!createInstruction.error) {
    return sendSuccess(201, createInstruction.response);
  } else {
    console.log(createInstruction.error)
    return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
  }
}

/**
 * A helper function that loads instruction
 * @param {*} instruction 
 */
async function getInstruction(instruction) {
  const findInstruction = await InstructionModel.findOne(instruction);

  if (!findInstruction.error && findInstruction.response.length === 1) {
    return sendSuccess(findInstruction.response[0]);
  } else {
    console.log(findInstruction.error)
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
  correctAnswers,
  shuffleAnswers
) {
  if (typeId === 1) {
    let content = await MCModel.saveMany(items, questionId);

    if (!content.error) {
      return sendSuccess(201);
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  } else if (typeId === 2) {
    let content = await GModel.saveMany(items, questionId);

    if (!content.error) {
      return sendSuccess(201);
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  } else if (typeId === 3) {
    let content = await MModel.saveMatchingQuestion(correctAnswers, questionId);

    if (!content.error) {
      let insertItems = await MModel.saveMany(
        [...items.leftItems, ...items.rightItems],
        questionId
      );

      if (!insertItems.error) {
        return sendSuccess(201);
      } else {
        console.log(insertItems.error)
        return sendFailure(STRINGS.ERROR_OCCURRED);
      }
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  }
}

/**
 * Function that loads question content
 * @param {*} id 
 * @param {*} typeId 
 * @param {*} questionData 
 */
async function getQuestionContent(id, typeId, questionData) {
  if (typeId === 1) {
    let content = await MCModel.findMany(id);

    if (!content.error) {
      return sendSuccess({ ...questionData, items: content.response });
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
    }
  } else if (typeId === 2) {
    let content = await GModel.findMany(id);

    if (!content.error) {
      return sendSuccess({ ...questionData, items: content.response });
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
    }
  } else {
    let content = await MModel.findMany(id);
    let splits = null;

    if (!content.error) {
      let leftItems = content.response.filter(
        (item) => item.column_assigned === 1
      );
      let rightItems = content.response.filter(
        (item) => item.column_assigned === 2
      );

      splits = questionData.matching_question_correct_answers
        .split(" ")
        .map((s) => s.split("."));

      splits.forEach((answer) => {
        let item = leftItems.find((i) => i.letter === answer[0]);
        item.correct_answer = answer[1];
      });

      return sendSuccess({ items: { leftItems, rightItems }, ...questionData });
    } else {
      console.log(content.error)
      return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
    }
  }
}

module.exports = {
  /**
   * Function that reset all ratings given by student for a quiz
   */
  resetRatings: async (quizId) => {
    const deleteAllRatings = await RatingModel.deleteAll(quizId);

    if (!deleteAllRatings.error) {
      return sendSuccess(deleteAllRatings.response);
    } else {
      console.log(deleteAllRatings.error)
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

    const questions = await QuestionModel.findManyByQuizIdForEdit(quizId);

    if (!questions.error) {
      return sendSuccess(questions.response);
    } else {
      console.log(questions.error)
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

    const question = await QuestionModel.findOneForEdit(id);

    if (!question.error) {
      const questionData = question.response[0];
      const typeId = questionData.type_id;
      return await getQuestionContent(id, typeId, {
        ...questionData,
        isActive: questionData.is_active == 1 ? true : false,
      });
    } else {
      console.log(question.error)
      return sendFailure(STRINGS.CANNOT_LOAD_QUESTION);
    }
  },
  /**
   * Function that loads information for teacher page
   */
  getTeacherHome: async () => {
    let homeSummary = await QuizModel.findAllForTeacher();
    let allSkills = await SkillModel.findAll();
    let questionTypes = await QuestionTypeModel.findAll();

    if (!homeSummary.error && !allSkills.error && !questionTypes.error) {
      return sendSuccess({
        quizzes: homeSummary.response,
        allSkills: allSkills.response,
        allQuestionTypes: questionTypes.response,
      });
    } else {
      console.log(homeSummary.error)
      console.log(allSkills.error)
      console.log(questionTypes.error)
      
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

    const deleteQuiz = await QuizModel.deleteOne(quizId);

    if (!deleteQuiz.error) {
      return sendSuccess(202);
    } else {
      console.log(deleteQuiz.error)
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
      let instructionId = create.response.insertId;

      if (instructionId === 0) {
        const findInstruction = await getInstruction(instruction);

        if (!findInstruction.error) {
          instructionId = findInstruction.response.instruction_id;
        } else {
          console.log(deleteQuiz.error)
          return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
        }
      }

      if (instructionId > 0) {
        const isActive = data.isActive === true ? 1 : 0;

        const question = await QuestionModel.saveOne({
          ...data,
          instructionId,
          isActive,
        });
        const questionsContent = await updateQuestionContent(
          questionId,
          typeId,
          items,
          correctAnswers,
          1
        );

        if (!question.error && !questionsContent.error) {
          return sendSuccess(202);
        } else {
          console.log(question.error)
          console.log(questionsContent.error)
          return sendFailure(STRINGS.ERROR_OCCURRED);
        }
      } else {
        console.log(create.error)
        return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
      }
    } else {
      console.log(create.error)
      return sendFailure(STRINGS.CANNOT_CREATE_INSTRUCTION);
    }
  },
  deleteQuestion: async (questionId) => {
    if (!validator.validateQuestionId(questionId)) {
      return sendFailure(STRINGS.INVALID_QUESTION_ID);
    }

    const deleteQuestion = await QuestionModel.deleteOne(questionId);

    if (!deleteQuestion.error) {
      return sendSuccess(202);
    } else {
      console.log(deleteQuestion.error)
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
