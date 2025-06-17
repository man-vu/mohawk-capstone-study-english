const { QueryTypes } = require('sequelize');
const sequelize = require('../config/orm');

class StatisticsModel {
  constructor() {}

  async findQuizOne(userId) {
    try {
      const res = await sequelize.query(
        `SELECT (SELECT COUNT(*) FROM (SELECT quiz_id FROM quiz GROUP BY quiz_id) as T) as number_of_quizzes,
        (SELECT COUNT(*) FROM (SELECT * FROM user_attempt ua WHERE ua.user_id = :userId AND ua.end_time IS NULL) as Y) as incomplete,
        (SELECT COUNT(*) FROM quiz q WHERE q.quiz_id NOT IN (SELECT quiz_id FROM user_attempt ua WHERE ua.user_id = :userId GROUP BY quiz_id)) as unattempted`,
        { replacements: { userId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findAnswerOne(userId) {
      try {
        const res = await sequelize.query(
          `SELECT
          (SELECT COUNT(*) FROM user_answer_question uaq WHERE uaq.user_id = :userId AND uaq.is_correct = 1) as correct,
          (SELECT COUNT(*) FROM user_answer_question uaq WHERE uaq.user_id = :userId AND uaq.is_correct = 2) as partially_correct,
          (SELECT COUNT(*) FROM user_answer_question uaq WHERE uaq.user_id = :userId AND uaq.is_correct = 3) as incorrect,
          (SELECT COUNT(*) FROM user_answer_question uaq WHERE uaq.user_id = :userId AND uaq.is_correct = 4) as unanswered`,
          { replacements: { userId }, type: QueryTypes.SELECT }
        );
        return { error: null, response: res };
      } catch (error) {
        return { error };
      }
  }
  async findBoardStatisticsByQuiz({quizId, dateFrom, dateTo}) {
    try {
      const res = await sequelize.query(
        `SELECT ua.end_time, ua.grade, CONCAT(u.first_name,  ' ', u.last_name) as full_name
        FROM user_attempt ua JOIN user u ON ua.user_id = u.user_id
        WHERE quiz_id = :quizId
          AND ua.end_time IS NOT NULL
          AND (ua.end_time BETWEEN :dateFrom AND :dateTo)
        ORDER BY grade DESC`,
        { replacements: { quizId, dateFrom, dateTo }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findBoardStatisticsByAnswerQuality({userId, dateFrom, dateTo}) {
    try {
      const res = await sequelize.query(
        `SELECT
        (SELECT COUNT(*) FROM user_answer_question uaq JOIN user_attempt ua ON uaq.user_id = ua.user_id AND uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.attempt_id WHERE uaq.user_id = :userId AND (ua.end_time BETWEEN :dateFrom AND :dateTo) AND uaq.is_correct = 1) as correct,
        (SELECT COUNT(*) FROM user_answer_question uaq JOIN user_attempt ua ON uaq.user_id = ua.user_id AND uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.attempt_id WHERE uaq.user_id = :userId AND (ua.end_time BETWEEN :dateFrom AND :dateTo) AND uaq.is_correct = 2) as partially_correct,
        (SELECT COUNT(*) FROM user_answer_question uaq JOIN user_attempt ua ON uaq.user_id = ua.user_id AND uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.attempt_id WHERE uaq.user_id = :userId AND (ua.end_time BETWEEN :dateFrom AND :dateTo) AND uaq.is_correct = 3) as incorrect,
        (SELECT COUNT(*) FROM user_answer_question uaq JOIN user_attempt ua ON uaq.user_id = ua.user_id AND uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.attempt_id WHERE uaq.user_id = :userId AND (ua.end_time BETWEEN :dateFrom AND :dateTo) AND uaq.is_correct = 4) as unanswered`,
        { replacements: { userId, dateFrom, dateTo }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findBoardStatisticsByQuizCompleted({userId, dateFrom, dateTo}) {
    try {
      const res = await sequelize.query(
        `SELECT (SELECT COUNT(*) FROM (SELECT quiz_id FROM quiz GROUP BY quiz_id) as T) as number_of_quizzes,
        (SELECT COUNT(*) FROM (SELECT * FROM user_attempt ua WHERE ua.user_id = :userId AND ua.end_time IS NULL) as Y) as incomplete,
        (SELECT COUNT(*) FROM quiz q WHERE q.quiz_id NOT IN (SELECT quiz_id FROM user_attempt ua WHERE ua.user_id = :userId AND ua.end_time BETWEEN :dateFrom AND :dateTo GROUP BY quiz_id)) as unattempted`,
        { replacements: { userId, dateFrom, dateTo }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = StatisticsModel;