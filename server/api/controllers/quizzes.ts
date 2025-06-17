const STRINGS = require("../../config/strings");
const { sendSuccess, sendFailure } = require("../../config/res");
const helper = require("../../misc/helper");
const { datetime_format } = require("../../config/index");
const moment = require("moment");
const QuizModel = require("../../new_models/QuizModel.ts").default;
const RatingModel = require("../../new_models/UserRatingModel.ts").default;
const FavoriteModel = require("../../new_models/UserFavoriteModel.ts").default;
const QuestionModel = require("../../new_models/QuestionModel.ts").default;
const AttemptModel = require("../../new_models/UserAttemptModel.ts").default;
const UserAnswerModel = require("../../new_models/UserAnswerModel.ts").default;
const CorrectAnswerModel = require("../../new_models/CorrectAnswerModel.ts").default;
const validator = require("../validators/validator");
const { cleanObject } = require("../../misc/helper");

/**
 * Async function marks a quiz as a user's favorite 
 * @param {*} param0 favorite's info
 */
async function markFavorite({ quizId, userId }) {
  const qId = Number(quizId);
  const uId = Number(userId);
  try {
    await FavoriteModel.create({ QuizId: qId, UserId: uId });
    return sendSuccess(null);
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.ERROR_OCCURRED);
  }
}

/**
 * Async function unmarks a quiz as a user's favorite 
 * @param {*} param0 favorite's info
 */
async function unmarkFavorite({ quizId, userId }) {
  const qId = Number(quizId);
  const uId = Number(userId);
  try {
    await FavoriteModel.delete(uId, qId);
    return sendSuccess(200, null);
  } catch (error) {
    console.log(error);
    return sendFailure(STRINGS.ERROR_OCCURRED);
  }
}

/**
 * Async function creates a new attempt based on provided information
 * @param {*} data All information about a new attempt
 */
async function createNewAttempt({ questionIds, quizId, userId }) {
  const qId = Number(quizId);
  const uId = Number(userId);
  if (Number.isNaN(qId) || Number.isNaN(uId)) {
    throw new Error('Invalid quiz or user id');
  }
  const attempt = await AttemptModel.create({
    Quiz: { connect: { QuizId: qId } },
    AppUser: { connect: { UserId: uId } },
  });
  await UserAnswerModel.createMany(
    questionIds.map((id) => ({ AttemptId: attempt.AttemptId, QuestionId: id, AnswerText: '' }))
  );
  return attempt.AttemptId;
}

/**
 * Function loads incomplete attempt 
 * @param {*} data 
 */
async function loadIncompleteAttempt(data) {
  const { latestAttempt, quizId, userId } = data;

  const attemptId = latestAttempt.AttemptId;

  const questions = await QuestionModel.findManyByQuizId({ quizId, userId, attemptId });
  const questionsContent = await QuestionModel.loadContent(quizId);
  const userAnswerQuestions = await UserAnswerModel.findAllByAttempt(quizId, userId, attemptId);

  return {
    questions,
    questionsContent,
    userAnswerQuestions,
  };
}

/**
 * Convert question content to object for mapping
 * @param {*} object 
 */
function convertToObject(object) {
  let resObject = {};

  for (const currentItem of object) {
    if (resObject[currentItem.question_id]) {
      resObject[currentItem.question_id].push(currentItem);
    } else {
      resObject[currentItem.question_id] = [currentItem];
    }
  }

  return resObject;
}

/**
 * Function loads the current quiz info
 * @param {*} quizId 
 * @param {*} userId 
 * @param {*} attemptId 
 */
async function getCurrentQuizInfo (quizId, userId, attemptId) {
  const qId = Number(quizId);
  const uId = Number(userId);
  const aId = Number(attemptId);
  const thisAttempt = await AttemptModel.findIncompleteAttempt(qId, uId, aId);
  if (thisAttempt) {
    const expiredTime = moment(thisAttempt.StartTime).add(thisAttempt.Quiz.TimeAllowed, 'minutes');
    const difference = moment().diff(expiredTime, 'seconds');
    return { time_left: difference, expired_time: expiredTime };
  }
  return null;
}

module.exports = {
  /**
   * This function loads an incomplete attempt by student or creates a new attempt if they has completed their latest attempt or has never taken the quiz
   */
  startQuiz: async (quizId, userId) => {
    const qId = Number(quizId);
    const uId = Number(userId);
    if (Number.isNaN(qId) || Number.isNaN(uId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    try {
      const latestAttempt = await AttemptModel.findLatest(qId, uId);
      const hasCompleted = latestAttempt && latestAttempt.EndTime !== null;
      const hasNeverTaken = !latestAttempt;

      const questionsContent = await QuestionModel.loadContent(qId);

      if (hasCompleted || hasNeverTaken) {
        const questions = await QuestionModel.findManyByQuizId({ quizId: qId });
        const questionIds = questions.map((q) => q.question_id);
        if (questionIds.length === 0) return sendFailure(STRINGS.ERROR_OCCURRED);
        const attemptId = await createNewAttempt({ questionIds, quizId: qId, userId: uId });
        const questionsWithAns = await QuestionModel.findManyByQuizId({ quizId: qId, userId: uId, attemptId });
        const quizInfo = await getCurrentQuizInfo(qId, uId, attemptId);
        const response = { questions: questionsWithAns, ...quizInfo };
        const resObject = convertToObject(questionsContent);
        for (const question of response.questions) {
          question.content = resObject[question.question_id];
        }
        return sendSuccess(response);
      } else {
        const data = { latestAttempt, quizId: qId, userId: uId };
        const incomplete = await loadIncompleteAttempt(data);
        const quizInfo = await getCurrentQuizInfo(qId, uId, latestAttempt.AttemptId);
        const response = { questions: incomplete.questions, ...quizInfo };
        const resObject = convertToObject(incomplete.questionsContent);
        for (const question of response.questions) {
          if (question.type_id === 1) {
            const content = resObject[question.question_id];
            question.number_of_selections = content.filter((c) => c.is_correct_choice).length;
            content.forEach((c) => delete c.is_correct_choice);
          }
          question.content = resObject[question.question_id];
        }
        return sendSuccess(response);
      }
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_LOAD_LATEST_ATTEMPT);
    }
  },
  /**
   * Loads a quiz by Id
   */
  getQuiz: async (id) => {
    const qId = Number(id);
    if (Number.isNaN(qId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    try {
      const quiz = await QuizModel.findDetailed(qId);
      return sendSuccess(quiz);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function creates a quiz from teacher page
   */
  createQuiz: async (data) => {
    const {} = data;

    if (!validator.validateIsActiveQuestion(data.isActive)) {
      return sendFailure(STRINGS.INVALID_IS_ACTIVE_VALUE);
    }
    if (!validator.validateTimeAllowed(data.timeAllowed)) {
      return sendFailure(STRINGS.TIME_ALLOWED_MUST_BE_AT_LEAST_1_MINUTE);
    }
    if (!validator.validateCourseName(data.courseName)) {
      return sendFailure(STRINGS.COURSE_NAME_MUST_BE_AT_LEAST_3_CHARACTERS);
    }

    const isActive = data.isActive === true;

    const timeAllowed = Number(data.timeAllowed);
    const skillId = Number(data.skillId);
    const userId = Number(data.userId);
    if (Number.isNaN(timeAllowed) || Number.isNaN(skillId) || Number.isNaN(userId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }

    try {
      const quiz = await QuizModel.create({
        Title: data.courseName,
        Description: data.description,
        IsActive: isActive,
        TimeAllowed: timeAllowed,
        SkillId: skillId,
        CreatedBy: userId,
      });
      return sendSuccess(await QuizModel.findDetailed(quiz.QuizId));
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function updates a quiz from teacher page
   */
  updateQuiz: async (data) => {
    const quizId = Number(data.quizId);
    const skillId = Number(data.skillId);
    const userId = Number(data.userId);
    if (Number.isNaN(quizId) || Number.isNaN(skillId) || Number.isNaN(userId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }

    if (!validator.validateIsActiveQuestion(data.isActive)) {
      return sendFailure(STRINGS.INVALID_IS_ACTIVE_VALUE);
    }
    if (!validator.validateTimeAllowed(data.timeAllowed)) {
      return sendFailure(STRINGS.TIME_ALLOWED_MUST_BE_AT_LEAST_1_MINUTE);
    }
    if (!validator.validateCourseName(data.courseName)) {
      return sendFailure(STRINGS.COURSE_NAME_MUST_BE_AT_LEAST_3_CHARACTERS);
    }

    const isActive = data.isActive === true;

    try {
      await QuizModel.update(quizId, {
        Title: data.courseName,
        Description: data.description,
        IsActive: isActive,
        TimeAllowed: Number(data.timeAllowed),
        SkillId: skillId,
        CreatedBy: userId,
      });
      return sendSuccess(await QuizModel.findDetailed(quizId));
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_UPDATE_QUIZ);
    }
  },
  /**
   * Function toggles a quiz's favorite based on provided information
   */
  toggleFavorite: async (data) => {
    const qId = Number(data.quizId);
    const uId = Number(data.userId);
    if (Number.isNaN(qId) || Number.isNaN(uId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    try {
      const exist = await FavoriteModel.findById(uId, qId);
      if (exist) {
        return unmarkFavorite({ quizId: qId, userId: uId });
      } else {
        return markFavorite({ quizId: qId, userId: uId });
      }
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_UPDATE_FAVORITE);
    }
  },
  /**
   * Function sets rating for quiz by a user
   */
  setRating: async ({ quizId, userId, ratingGiven }) => {
    const qId = Number(quizId);
    const uId = Number(userId);
    if (Number.isNaN(qId) || Number.isNaN(uId) || qId < 1 || uId < 0) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    if (!validator.validateRatingGiven(ratingGiven)) {
      return sendFailure(STRINGS.RATING_MUST_BE_BETWEEN_1_AND_5);
    }

    try {
      const exist = await RatingModel.findById(uId, qId);
      if (exist) {
        await RatingModel.update(uId, qId, { RatingGiven: ratingGiven });
      } else {
        await RatingModel.create({ UserId: uId, QuizId: qId, RatingGiven: ratingGiven });
      }

      const ratingAgg = await require("../../new_models/QuizModel.ts").default.findDetailed(qId);
      return sendSuccess(200, {
        average_rating: ratingAgg.average_rating,
        rating_count: ratingAgg.rating_count,
        rating_given: ratingGiven,
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.CANNOT_UPDATE_RATING);
    }
  },
  /**
   * Function handles submissions from students either by clicking on submit or timeout 
   */
  submitAndMark: async (data) => {
    const qId = Number(data.quizId);
    const uId = Number(data.userId);
    const aId = Number(data.attemptId);

    if (Number.isNaN(qId) || Number.isNaN(uId) || Number.isNaN(aId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }

    const endTime = moment(Date.now());
    const getCorrectAnswers = await CorrectAnswerModel.findAll(qId);
    const userAnswerQuestions = await UserAnswerModel.findAll({ quizId: qId, userId: uId, attemptId: aId });
    const response = { detailedAnswers: [], result: [], grade: null }

    if (!getCorrectAnswers.error && !userAnswerQuestions.error) {
      // 1 - correct, 2 - partially correct, 3 - incorrect, 4 - unanswered
      const result = { correct: 0, partial: 0, incorrect: 0, unanswered: 0 };
      const correctAnswers = convertToObject( cleanObject(getCorrectAnswers.response) );
      const userAnswers = userAnswerQuestions.response;
      const userAnswersModels = []
      let markedResult

      for (const { answer_text, type_id, question_id } of userAnswers) {
        const corrects = type_id === 3 ?  correctAnswers[question_id][0].correct_answers.split(" ") .map((a) => a.split(".")) : correctAnswers[question_id]

        if (answer_text === "") {
          result.unanswered += 1;
          markedResult = 4

          if (type_id === 1) {
            response.detailedAnswers.push({answers: corrects.map(c => ({...c, marked: 0 === c.is_correct_choice, user_answer: 0}))})
          } else if (type_id === 2) {
            response.detailedAnswers.push({answers: corrects })
          } else if (type_id === 3) {
            response.detailedAnswers.push({answers: corrects.map((c,i) => ({ type_id: 3, sequence_id: i + 1, correct_answer: c[1]}))})

          }
        } else {
          response.detailedAnswers.push({})
          const index = response.detailedAnswers.length - 1

          if (type_id === 1) {
            const selectedOptions = answer_text.split(',').map(i => parseInt(i) ? parseInt(i) : i)
            const marked = selectedOptions.map((o) => corrects[o - 1].is_correct_choice === 1)
            
            for (const correct of corrects) {
              const isSelected = selectedOptions.includes(correct.choice_id) 
              correct.user_answer = isSelected ? 1 : 0
              if ((isSelected && correct.is_correct_choice === 1) || (!isSelected && correct.is_correct_choice === 0)) {
                  correct.marked = true 
              } else {
                  correct.marked = false
              }
          }
              

            response.detailedAnswers[index].answers = corrects;
            
            if (marked.length === corrects.filter(c => c.is_correct_choice === 1).length && marked.every(m => m === true)) {
              
              markedResult = 1;
              result.correct += 1
            } else if (marked.every(m => m === false)) {
              markedResult = 2
              result.incorrect += 1
            } else {
              markedResult = 3
              result.partial += 1
            }
          } else if (type_id === 2) {
            const answers = answer_text.split(",").map((a) => a.split("."));
            const marked = answers.map((item, i) => {
              const string = corrects[i].correct_answer.toLowerCase().trim()
              const string2 = item[1].toLowerCase().trim()
              
              if (string.includes('/') || string.includes('|'))  {
                const correct_answers = (string.includes('/') ? string.split('/') : string.split('|')).map(a => a.trim())
                return correct_answers.some(answer => string2 === answer)
              } else {
                return string2 === string
              }
            })

            response.detailedAnswers[index].answers = corrects
            
            for (let i = 0; i < marked.length; i++) {
              response.detailedAnswers[index].answers[i].user_answer = answers[i][1]
              response.detailedAnswers[index].answers[i].marked = marked[i]
            }

            if (marked.every(m => m === true)) {
              markedResult = 1;
              result.correct += 1
            } else if (marked.every(m => m === false)) {
              markedResult = 2
              result.incorrect += 1
            } else {
              markedResult = 3
              result.partial += 1
            }
          } else if (type_id === 3) {
            const answers = answer_text.split(" ").map((a) => a.split("."));
            const marked = answers.map((item, i) => item[1] === corrects[i][1])

            response.detailedAnswers[index].answers = corrects.map(c => ({ correct_answer: c[1]}))
            
            for (let i = 0; i < marked.length; i++) {
              response.detailedAnswers[index].answers[i].type_id = 3
              response.detailedAnswers[index].answers[i].sequence_id = i + 1
              response.detailedAnswers[index].answers[i].user_answer = answers[i][1]
              response.detailedAnswers[index].answers[i].marked = marked[i]
            }

            if (marked.length === corrects.length && marked.every(m => m === true)) {
              markedResult = 1;
              result.correct += 1
            } else if (marked.every(m => m === false)) {
              markedResult = 2
              result.incorrect += 1
            } else {
              markedResult = 3
              result.partial += 1
            }
          }
        }

        const ua = { quizId: qId, userId: uId, attemptId: aId, questionId: question_id, markedResult }

        userAnswersModels.push(ua)
      }

      const numQuestions = Object.keys(correctAnswers).length;
      const eachQuestionMark = 100 / numQuestions
      const grade = result.correct === numQuestions ? 100 : (eachQuestionMark * result.correct + (eachQuestionMark / 2) * result.partial)

      const updateMarked = await UserAnswerModel.markOne(userAnswersModels)
      const attemptData = { endTime: endTime.format(datetime_format), grade };
      const closeAttempt = await AttemptModel.closeOne(aId, attemptData)
      const thisAttempt = await AttemptModel.findOne(qId, uId, aId)

      if(!updateMarked.error && !closeAttempt.error && !thisAttempt.error) {
        response.result = result
        response.result.total = numQuestions
        response.accuracy = grade
        response.quiz_id = qId
        response.attempt_id = aId
        response.userAnswers = userAnswers
        response.time_taken = endTime.diff(thisAttempt.response[0].start_time, 'seconds')
  
        return sendSuccess(response)
      } else {
        return sendFailure(STRINGS.ERROR_OCCURRED)
      }
    } else {
      console.log(getCorrectAnswers.error)
      console.log(userAnswerQuestions.error)
      return sendFailure(STRINGS.ERROR_OCCURRED)
    }
  },
};
