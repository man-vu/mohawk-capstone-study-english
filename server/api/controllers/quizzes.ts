const STRINGS = require("../../config/strings");
const { sendSuccess, sendFailure } = require("../../config/res");
const moment = require("moment");
const QuizModel = require("../../models/quiz/QuizModel.ts").default;
const RatingModel = require("../../models/user/UserRatingModel.ts").default;
const FavoriteModel = require("../../models/user/UserFavoriteModel.ts").default;
const QuestionModel = require("../../models/question/QuestionModel.ts").default;
const AttemptModel = require("../../models/user/UserAttemptModel.ts").default;
const UserAnswerModel = require("../../models/user/UserAnswerModel.ts").default;
const CorrectAnswerModel = require("../../models/question/CorrectAnswerModel.ts").default;
const QuizPartModel = require("../../models/quiz/QuizPartModel.ts").default;
const AppUserModel = require("../../models/auth/AppUserModel.ts").default;
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
  const user = await AppUserModel.findById(uId);
  if (!user) {
    throw new Error('User not found');
  }
  const attempt = await AttemptModel.create({
    StartTime: moment.utc().toDate(),
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

function evaluateMultipleChoice(text: string, corrects: any[]) {
  const selected = text.split(',').map((v) => Number(v));
  const correctIds = corrects.filter((c: any) => c.is_correct_choice).map((c: any) => c.choice_id);
  const details = corrects.map((c: any) => {
    const chosen = selected.includes(c.choice_id);
    return {
      ...c,
      user_answer: chosen ? 1 : 0,
      marked: (chosen && c.is_correct_choice === 1) || (!chosen && c.is_correct_choice === 0),
    };
  });
  if (!selected.length) return { result: 4, details };
  const marks = selected.map((id) => correctIds.includes(id));
  if (marks.length === correctIds.length && marks.every(Boolean)) return { result: 1, details };
  if (marks.every((m) => !m)) return { result: 2, details };
  return { result: 3, details };
}

function evaluateGapFilling(text: string, corrects: any[]) {
  const answers = text.split(',').map((a) => a.split('.'));
  const details = corrects.map((c: any, idx: number) => {
    const val = answers[idx] ? answers[idx][1] : '';
    const expect = c.correct_answer.toLowerCase().trim();
    let isCorrect = false;
    if (expect.includes('/') || expect.includes('|')) {
      const opts = (expect.includes('/') ? expect.split('/') : expect.split('|')).map((o) => o.trim());
      isCorrect = opts.some((o) => val.toLowerCase().trim() === o);
    } else {
      isCorrect = val.toLowerCase().trim() === expect;
    }
    return { ...c, user_answer: val, marked: isCorrect };
  });
  const marks = details.map((d) => d.marked);
  if (marks.every(Boolean)) return { result: 1, details };
  if (marks.every((m) => !m)) return { result: 2, details };
  return { result: 3, details };
}

function evaluateMatchingPairs(text: string, corrects: any[]) {
  const map: Record<number, string[]> = {};
  for (const c of corrects) {
    const po = c.prompt_order ?? c.PromptOrder;
    const co = c.choice_order ?? c.ChoiceOrder;
    if (!map[po]) map[po] = [];
    map[po].push(String.fromCharCode(64 + co));
  }
  const orders = Object.keys(map).map((n) => Number(n)).sort((a, b) => a - b);
  const pairs = text.split(' ').map((p) => p.split('.'));
  const details: any[] = [];
  const marks: boolean[] = [];
  for (let i = 0; i < orders.length; i++) {
    const po = orders[i];
    const choice = pairs[i] ? pairs[i][1] : '';
    const correctLetters = map[po] || [];
    const ok = !!choice && correctLetters.includes(choice);
    marks.push(ok);
    details.push({ type_id: 3, sequence_id: po, correct_answer: correctLetters.join('/'), user_answer: choice, marked: ok });
  }
  if (marks.length === orders.length && marks.every(Boolean)) return { result: 1, details };
  if (marks.every((m) => !m)) return { result: 2, details };
  return { result: 3, details };
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
    const expiredTime = moment.utc(thisAttempt.StartTime).add(thisAttempt.Quiz.TimeAllowed, 'minutes');
    const difference = expiredTime.diff(moment.utc(), 'seconds');
    return { time_left: difference, expired_time: expiredTime.toISOString() };
  }
  return null;
}

module.exports = {
  /**
   * Loads all quizzes with optional user info for home page
   */
  getQuizzes: async (userId?: number) => {
    try {
      const quizzes = await QuizModel.getHomeSummary(userId);
      return sendSuccess(quizzes);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
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
        const rawParts = await QuizPartModel.findAllByQuiz(qId);
        const parts = rawParts.map((p) => ({
          part_id: p.PartId,
          part_title: p.PartTitle,
          sort_order: p.SortOrder,
        }));
        const response = { questions: questionsWithAns, parts, attempt_id: attemptId, ...quizInfo };
        const resObject = convertToObject(questionsContent);
        for (const question of response.questions) {
          question.content = resObject[question.question_id];
        }
        return sendSuccess(response);
      } else {
        const data = { latestAttempt, quizId: qId, userId: uId };
        const incomplete = await loadIncompleteAttempt(data);
        const quizInfo = await getCurrentQuizInfo(qId, uId, latestAttempt.AttemptId);
        const rawParts = await QuizPartModel.findAllByQuiz(qId);
        const parts = rawParts.map((p) => ({
          part_id: p.PartId,
          part_title: p.PartTitle,
          sort_order: p.SortOrder,
        }));
        const response = { questions: incomplete.questions, parts, attempt_id: latestAttempt.AttemptId, ...quizInfo };
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
      if (error.message === 'User not found') {
        return sendFailure(404, STRINGS.NO_SUCH_USER_EXISTS);
      }
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

      const ratingAgg = await require("../../models/quiz/QuizModel.ts").default.findDetailed(qId);
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
  submitAndMark: async ({ quizId, userId, attemptId }) => {
    const qId = Number(quizId);
    const uId = Number(userId);
    const aId = Number(attemptId);

    if (Number.isNaN(qId) || Number.isNaN(uId) || Number.isNaN(aId)) {
      return sendFailure(STRINGS.INVALID_QUIZ_ID);
    }

    const endTime = moment(Date.now());

    try {
      const [mcRows, gapRows, matchRows] = await Promise.all([
        CorrectAnswerModel.findMultipleChoice(qId),
        CorrectAnswerModel.findGapFilling(qId),
        CorrectAnswerModel.findMatchingPairs(qId),
      ]);
      const uaRecords = await UserAnswerModel.findAllByAttempt(qId, uId, aId);

      const mcMap = convertToObject(cleanObject(mcRows));
      const gapMap = convertToObject(cleanObject(gapRows));
      const matchMap = convertToObject(cleanObject(matchRows));
      const userAnswers = uaRecords.map((ua) => ({
        question_id: ua.QuestionId,
        type_id: ua.Question.TypeId,
        answer_text: ua.AnswerText,
      }));

      const result = { correct: 0, partial: 0, incorrect: 0, unanswered: 0 };
      const detailedAnswers: any[] = [];
      const markUpdates: any[] = [];


      const evaluators: any = {
        1: evaluateMultipleChoice,
        2: evaluateGapFilling,
        3: evaluateMatchingPairs,
      };
      const answerMaps: any = { 1: mcMap, 2: gapMap, 3: matchMap };

      for (const { question_id, type_id, answer_text } of userAnswers) {
        const corrects = answerMaps[type_id]?.[question_id] || [];
        const evaluation = !answer_text
          ? { result: 4, details: corrects }
          : evaluators[type_id]
          ? evaluators[type_id](answer_text, corrects)
          : { result: 4, details: [] };

        const keyMap: any = { 1: 'correct', 2: 'incorrect', 3: 'partial', 4: 'unanswered' };
        const key = keyMap[evaluation.result];
        if (key) result[key] += 1;

        detailedAnswers.push({ answers: evaluation.details });
        markUpdates.push({ quizId: qId, userId: uId, attemptId: aId, questionId: question_id, markedResult: evaluation.result });
      }

      const numQuestions = userAnswers.length;
      const each = 100 / numQuestions;
      const grade = result.correct === numQuestions ? 100 : each * result.correct + (each / 2) * result.partial;

      await UserAnswerModel.markOne(markUpdates);
      await AttemptModel.closeOne(aId, { EndTime: endTime.toDate(), Grade: grade });
      const thisAttempt = await AttemptModel.findOne(qId, uId, aId);

      return sendSuccess({
        detailedAnswers,
        result: { ...result, total: numQuestions },
        accuracy: grade,
        quiz_id: qId,
        attempt_id: aId,
        userAnswers,
        time_taken: endTime.diff(thisAttempt?.StartTime, 'seconds'),
      });
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
