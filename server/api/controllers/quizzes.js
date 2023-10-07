const STRINGS = require("../../config/strings");
const { sendSuccess, sendFailure } = require("../../config/res");
const helper = require("../../misc/helper");
const { datetime_format } = require("../../config/index");
const moment = require("moment");
const QuizModel = new (require("../../models/quiz"))();
const RatingModel = new (require("../../models/rating"))();
const FavoriteModel = new (require("../../models/favorite"))();
const QuestionModel = new (require("../../models/question"))();
const AttemptModel = new (require("../../models/attempt"))();
const UserAnswerModel = new (require("../../models/user_answer"))();
const CorrectAnswerModel = new (require("../../models/correct_answer"))();
const validator = require("../validators/validator");
const { cleanObject } = require("../../misc/helper");

/**
 * Async function marks a quiz as a user's favorite 
 * @param {*} param0 favorite's info
 */
async function markFavorite({ quizId, userId }) {
  const favorite = await FavoriteModel.addOne(quizId, userId);

  if (!favorite.error && favorite.response.affectedRows === 1) {
    return sendSuccess(null);
  } else {
    console.log(favorite.error)
    return sendFailure(STRINGS.ERROR_OCCURRED);
  }
}

/**
 * Async function unmarks a quiz as a user's favorite 
 * @param {*} param0 favorite's info
 */
async function unmarkFavorite({ quizId, userId }) {
  const unfavorite = await FavoriteModel.deleteOne(quizId, userId);

  if (!unfavorite.error && unfavorite.response.affectedRows === 1) {
    return sendSuccess(200, null);
  } else {
    console.log(unfavorite.error)
    return sendFailure(STRINGS.ERROR_OCCURRED);
  }
}

/**
 * Async function creates a new attempt based on provided information
 * @param {*} data All information about a new attempt
 */
async function createNewAttempt(data) {
  const { hasCompleted, latestAttempt, questionIds, quizId, userId } = data;

  const newAttemptId = hasCompleted
    ? latestAttempt.response[0].attempt_id + 1
    : 1;
  const newAttemptData = {
    quizId,
    userId,
    attemptId: newAttemptId,
    questionIds,
    startTime: moment(Date.now()).format(datetime_format),
  };

  const newAttempt = await AttemptModel.addOne(newAttemptData);
  const addPlaceHolder = await AttemptModel.addManyPlaceholders(newAttemptData);

  if (!newAttempt.error && !addPlaceHolder.error) {
    const newAttempt = await UserAnswerModel.findAll(newAttemptData);
    
    if (!newAttempt.error) {
      return newAttempt.response;
    } else {
      console.log(newAttempt.error)  
      return false
    }
  } else {
    console.log(newAttempt.error)
    console.log(addPlaceHolder.error)
    return false;
  }
}

/**
 * Function loads incomplete attempt 
 * @param {*} data 
 */
async function loadIncompleteAttempt(data) {
  const { latestAttempt, quizId, userId } = data;

  const attemptId = latestAttempt.response[0].attempt_id;

  const userAnswerData = { quizId, userId, attemptId };

  const questions = await QuestionModel.findManyByQuizId(userAnswerData);
  const questionsContent = await QuestionModel.loadContent(quizId);
  const userAnswerQuestions = await UserAnswerModel.findAll(userAnswerData);

  if ( !questionsContent.error && !questions.error && !userAnswerQuestions.error) {
    return {
      questions: questions.response,
      questionsContent: questionsContent.response,
      userAnswerQuestions: questionsContent.response,
    };
  } else {
    console.log(questionsContent.error)
    console.log(questions.error)
    console.log(userAnswerQuestions.error)

    return false;
  }
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
  const thisAttempt = await AttemptModel.findIncompleteAttempt(quizId, userId, attemptId)

  if (!thisAttempt.error) {
    const { time_allowed, start_time } = thisAttempt.response[0]

    const expiredTime = moment(start_time).add(time_allowed, "minutes");
    const difference = moment().diff(expiredTime, "seconds"); 

    return sendSuccess({
      time_left: difference,
      expired_time: expiredTime,
    })
  } else {
    console.log(thisAttempt.error)
    return sendFailure(STRINGS.ERROR_OCCURRED)
  }
}

module.exports = {
  /**
   * This function loads an incomplete attempt by student or creates a new attempt if they has completed their latest attempt or has never taken the quiz
   */
  startQuiz: async (quizId, userId) => {
    let latestAttempt = await AttemptModel.findLatest(quizId, userId);

    if (!latestAttempt.error) {
      const hasCompleted =
        latestAttempt.response.length === 1 &&
        latestAttempt.response[0].end_time !== null;
      const hasNeverTaken = latestAttempt.response.length === 0;

      if (!latestAttempt.error) {
        if (hasCompleted || hasNeverTaken) {
          // User has never attempted this quiz or has completed the quiz
          const questions = await QuestionModel.findManyByQuizId({ quizId });
          let questionsContent = await QuestionModel.loadContent(quizId);

          if (!questions.error && !questionsContent.error) {
            const questionIds = questions.response.map((q) => q.question_id);

            if (questionIds.length > 0) {
              const data = {
                hasCompleted,
                latestAttempt,
                questionIds,
                quizId,
                userId,
              };
              const newAttempt = await createNewAttempt(data);

              if (!newAttempt.error) {
                const questions = await QuestionModel.findManyByQuizId({
                  quizId,
                  userId,
                  attemptId: newAttempt[0].attempt_id,
                });
  
                const quizInfo = await getCurrentQuizInfo(quizId, userId, newAttempt[0].attempt_id)
  
                if (!questions.error && !quizInfo.error) {
                  const response = {questions: questions.response, ...quizInfo.response}

                  questionsContent = helper.cleanObject(questionsContent.response);
  
                  let resObject = {};
    
                  for (const currentItem of questionsContent) {
                    if (resObject[currentItem.question_id]) {
                      resObject[currentItem.question_id].push(currentItem);
                    } else {
                      resObject[currentItem.question_id] = [currentItem];
                    }
                  }
    
                  for (const question of response.questions) {
                    question.content = resObject[question.question_id];
                  }
    
                  return sendSuccess(response);
                } else {
                  console.log(questions.error)
                  console.log(quizInfo.error)  
                  return sendFailure(STRINGS.CANNOT_LOAD_QUESTIONS)
                }
              } else {
                console.log(newAttempt.error)
                return sendFailure(STRINGS.CANNOT_CREATE_NEW_ATTEMPT)
              }


            } else {
              return sendFailure(STRINGS.ERROR_OCCURRED);
            }
          } else {
            console.log(questions.error)
            console.log(questionsContent.error)
            return sendFailure(STRINGS.CANNOT_LOAD_QUESTIONS);
          }
          
        } else {
          // User has attempted this quiz but has not completed it
          const data = { latestAttempt, quizId, userId };
          const incompleteAttempt = await loadIncompleteAttempt(data);

          if (incompleteAttempt === false) {
            return sendFailure(STRINGS.ERROR_OCCURRED);
          } else {
            const { questions, userAnswerQuestions } = incompleteAttempt;

            const quizInfo = await getCurrentQuizInfo(quizId, userId, latestAttempt.response[0].attempt_id)

            if (!quizInfo.error) {
              const response =  {questions, ...quizInfo.response} 

              const questionsContent = helper.cleanObject(
                incompleteAttempt.questionsContent
              );
  
              let resObject = {};
  
              for (const currentItem of questionsContent) {
                if (resObject[currentItem.question_id]) {
                  resObject[currentItem.question_id].push(currentItem);
                } else {
                  resObject[currentItem.question_id] = [currentItem];
                }
              }
  
              for (const question of response.questions) {
                if (question.type_id === 1) {
                  const content = resObject[question.question_id];
                  question.number_of_selections = content.filter(choice => choice.is_correct_choice).length
                  content.forEach(choice => delete choice.is_correct_choice)
                }
                question.content = resObject[question.question_id];
              }
  
              return sendSuccess(response);
            } else {
              console.log(quizInfo.error)
              return sendFailure(STRINGS.CANNOT_LOAD_QUESTIONS);
            }
          }
        }
      }
    } else {
      console.log(latestAttempt.error)
      return sendFailure(STRINGS.CANNOT_LOAD_LATEST_ATTEMPT)
    }
  },
  /**
   * Loads a quiz by Id
   */
  getQuiz: async (id) => {
    const quiz = await QuizModel.findDetailed(id);

    if (!quiz.error) {
      return sendSuccess(quiz.response[0]);
    } else {
      console.log(quiz.error)
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

    const isActive = data.isActive === true ? 1 : 0;

    let quiz = await QuizModel.addOne({ ...data, isActive });

    if (!quiz.error && quiz.response.affectedRows === 1) {
      const newQuizId = quiz.response.insertId;

      return module.exports.getQuiz(newQuizId);
    } else {
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  /**
   * Function updates a quiz from teacher page
   */
  updateQuiz: async (data) => {
    const { quizId } = data;

    if (!validator.validateIsActiveQuestion(data.isActive)) {
      return sendFailure(STRINGS.INVALID_IS_ACTIVE_VALUE);
    }
    if (!validator.validateTimeAllowed(data.timeAllowed)) {
      return sendFailure(STRINGS.TIME_ALLOWED_MUST_BE_AT_LEAST_1_MINUTE);
    }
    if (!validator.validateCourseName(data.courseName)) {
      return sendFailure(STRINGS.COURSE_NAME_MUST_BE_AT_LEAST_3_CHARACTERS);
    }

    const isActive = data.isActive === true ? 1 : 0;

    const quiz = await QuizModel.saveOne({ ...data, isActive });

    if (!quiz.error && quiz.response.affectedRows === 1) {
      return module.exports.getQuiz(quizId);
    } else {
      console.log(quiz.error)
      return sendFailure(STRINGS.CANNOT_UPDATE_QUIZ);
    }
  },
  /**
   * Function toggles a quiz's favorite based on provided information
   */
  toggleFavorite: async (data) => {
    const { quizId, userId } = data;
    let status = await FavoriteModel.findOne(quizId, userId);

    if (!status.error) {
      if (status.response[0].favorite === 0) {
        return markFavorite(data);
      } else if (status.response[0].favorite === 1) {
        return unmarkFavorite(data);
      }
    } else {
      console.log(status.error)
      return sendFailure(STRINGS.CANNOT_UPDATE_FAVORITE);
    }
  },
  /**
   * Function sets rating for quiz by a user
   */
  setRating: async ({ quizId, userId, ratingGiven }) => {
    // Validation
    if (!quizId || !userId || quizId < 1 || userId < 0) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }
    if (!validator.validateRatingGiven(ratingGiven)) {
      return sendFailure(STRINGS.RATING_MUST_BE_BETWEEN_1_AND_5)
    }

    const ratingFound = await RatingModel.findOne(quizId, userId);

    if (!ratingFound.error) {
      const data = { quizId, userId, ratingGiven };
      if (ratingFound.response.length === 0) {
        const rating = await RatingModel.addOne(data);
        const getRating = await RatingModel.findOneByQuizId(quizId, userId)

        if (!rating.error && rating.response.affectedRows === 1) {
          if (!getRating.error) {
            return sendSuccess(200, getRating.response[0]);  
          }

          return sendSuccess(200, null);
        } else {
          console.log(rating.error)
          return sendFailure(STRINGS.CANNOT_UPDATE_RATING);
        }
      } else {
        const rating = await RatingModel.saveOne(data);
        const getRating = await RatingModel.findOneByQuizId(quizId, userId)

        if (!rating.error && rating.response.affectedRows === 1) {
          if (!getRating.error) {
            return sendSuccess(200, getRating.response[0]);  
          }

          return module.exports.getQuiz(quizId);
        } else {
          console.log(rating.error)
          return sendFailure(STRINGS.CANNOT_UPDATE_RATING);
        }
      }
    } else {
      console.log(ratingFound.error)
      return sendFailure(STRINGS.CANNOT_UPDATE_RATING);
    }
  },
  /**
   * Function handles submissions from students either by clicking on submit or timeout 
   */
  submitAndMark: async (data) => {
    const { quizId, userId, attemptId } = data;

    const endTime = moment(Date.now())
    const getCorrectAnswers = await CorrectAnswerModel.findAll(quizId);
    const userAnswerQuestions = await UserAnswerModel.findAll(data);
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

        const ua = { quizId, userId, attemptId, questionId: question_id, markedResult}

        userAnswersModels.push(ua)
      }

      const numQuestions = Object.keys(correctAnswers).length;
      const eachQuestionMark = 100 / numQuestions
      const grade = result.correct === numQuestions ? 100 : (eachQuestionMark * result.correct + (eachQuestionMark / 2) * result.partial)

      const updateMarked = await UserAnswerModel.markOne(userAnswersModels)
      const attemptData = { userId, quizId, attemptId, endTime: endTime.format(datetime_format), grade };
      const closeAttempt = await AttemptModel.closeOne(attemptData)
      const thisAttempt = await AttemptModel.findOne(quizId, userId, attemptId)

      if(!updateMarked.error && !closeAttempt.error && !thisAttempt.error) {
        response.result = result
        response.result.total = numQuestions
        response.accuracy = grade
        response.quiz_id = quizId
        response.attempt_id = attemptId
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
