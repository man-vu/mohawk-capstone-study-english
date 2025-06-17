const { DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/orm');

const UserAttempt = sequelize.define('user_attempt', {
  quiz_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  attempt_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE,
  remaining_time: DataTypes.INTEGER,
  grade: DataTypes.DECIMAL(5, 2)
}, {
  tableName: 'user_attempt',
  timestamps: false
});

const UserRating = sequelize.define('user_rating', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  rating_given: DataTypes.INTEGER
}, {
  tableName: 'user_rating',
  timestamps: false
});

const UserAnswerQuestion = sequelize.define('user_answer_question', {
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  attempt_id: DataTypes.INTEGER,
  question_id: DataTypes.INTEGER,
  answer_text: DataTypes.STRING
}, {
  tableName: 'user_answer_question',
  timestamps: false
});

const Quiz = sequelize.define('quiz', {
  quiz_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  time_allowed: DataTypes.INTEGER
}, {
  tableName: 'quiz',
  timestamps: false
});

UserAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id' });

class AttemptModel {
  constructor() {
    this.UserAttempt = UserAttempt;
    this.UserRating = UserRating;
    this.UserAnswerQuestion = UserAnswerQuestion;
  }

  async findLatest(quizId, userId) {
    if (quizId === undefined || userId === undefined) {
      return { error: new Error('Missing quizId or userId'), response: null };
    }
    try {
      const attempt = await this.UserAttempt.findOne({
        where: { quiz_id: quizId, user_id: userId },
        order: [['attempt_id', 'DESC']],
        attributes: ['attempt_id', 'start_time', 'end_time']
      });
      return { error: null, response: attempt ? [attempt.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findOne(quizId, userId, attemptId) {
    try {
      const attempt = await this.UserAttempt.findOne({
        where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId },
        attributes: ['attempt_id', 'user_id', 'quiz_id', 'start_time', 'end_time']
      });
      return { error: null, response: attempt ? [attempt.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findAll() {
    try {
      const res = await this.UserRating.findAll({
        attributes: [
          'quiz_id',
          [sequelize.fn('AVG', sequelize.col('rating_given')), 'average_rating'],
          [sequelize.fn('COUNT', sequelize.col('rating_given')), 'rating_count']
        ],
        group: ['quiz_id']
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addOne({quizId, userId, attemptId, startTime}) {
    try {
      const res = await this.UserAttempt.create({
        quiz_id: quizId,
        user_id: userId,
        attempt_id: attemptId,
        start_time: startTime
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne({ quizId, userId, ratingGiven }) {
    try {
      const [rows] = await this.UserRating.update({
        rating_given: ratingGiven
      }, {
        where: { user_id: userId, quiz_id: quizId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(quizId, userId) {
    try {
      const rows = await this.UserRating.destroy({
        where: { user_id: userId, quiz_id: quizId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async addOnePlaceholder({ quizId, userId, attemptId, questionId }) {
    try {
      const res = await this.UserAnswerQuestion.create({
        quiz_id: quizId,
        user_id: userId,
        attempt_id: attemptId,
        question_id: questionId,
        answer_text: ''
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async addManyPlaceholders({ quizId, userId, attemptId, questionIds }) {
    const records = questionIds.map(id => ({
      quiz_id: quizId,
      user_id: userId,
      attempt_id: attemptId,
      question_id: id,
      answer_text: ''
    }));
    try {
      const res = await this.UserAnswerQuestion.bulkCreate(records);
      return { error: null, response: { affectedRows: res.length } };
    } catch (error) {
      return { error };
    }
  }

  async closeOne({quizId, userId, attemptId, endTime, grade}) {
    try {
      const [rows] = await this.UserAttempt.update({
        end_time: endTime,
        grade,
        remaining_time: 0
      }, {
        where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async findIncompleteAttempts(quizId) {
    try {
      const attempts = await this.UserAttempt.findAll({
        where: { quiz_id: quizId, end_time: null, grade: null },
        attributes: ['user_id', 'quiz_id', 'attempt_id']
      });
      return { error: null, response: attempts.map(a => a.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findAllIncompleteAttempts() {
    try {
      const attempts = await this.UserAttempt.findAll({
        where: { end_time: null },
        include: [{ model: Quiz, attributes: ['time_allowed'] }],
        order: [['start_time', 'ASC']],
        attributes: ['attempt_id', 'user_id', 'quiz_id', 'start_time']
      });
      const result = attempts.map(a => {
        const obj = a.toJSON();
        obj.time_allowed = obj.quiz.time_allowed;
        delete obj.quiz;
        return obj;
      });
      return { error: null, response: result };
    } catch (error) {
      return { error };
    }
  }

  async findIncompleteAttempt(quizId, userId, attemptId) {
    try {
      const attempt = await this.UserAttempt.findOne({
        where: { quiz_id: quizId, user_id: userId, attempt_id, end_time: null },
        include: [{ model: Quiz, attributes: ['time_allowed'] }],
        attributes: ['attempt_id', 'user_id', 'quiz_id', 'start_time']
      });
      if (!attempt) return { error: null, response: [] };
      const obj = attempt.toJSON();
      obj.time_allowed = obj.quiz.time_allowed;
      delete obj.quiz;
      return { error: null, response: [obj] };
    } catch (error) {
      return { error };
    }
  }

  async findManyIncompleteAttempts(userId) {
    try {
      const results = await sequelize.query(
        `SELECT ua.attempt_id, ua.user_id, ua.quiz_id, ua.start_time, q.time_allowed, total_questions, unanswered, (total_questions - unanswered) as answered
        FROM user_attempt ua JOIN quiz q ON ua.quiz_id = q.quiz_id
        JOIN (SELECT COUNT(*) as total_questions, SUM(CASE WHEN answer_text = '' THEN 1 ELSE 0 END) as unanswered, SUM(CASE WHEN answer_text <> '' THEN 1 ELSE 0 END) as answered, attempt_id, quiz_id, user_id
        FROM user_answer_question
        GROUP BY attempt_id, quiz_id, user_id) t1 ON t1.attempt_id = ua.attempt_id AND t1.quiz_id = ua.quiz_id AND t1.user_id = ua.user_id
        WHERE ua.user_id = :userId AND ua.end_time IS NULL
        ORDER BY ua.quiz_id, ua.attempt_id`,
        { replacements: { userId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: results };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = AttemptModel;
