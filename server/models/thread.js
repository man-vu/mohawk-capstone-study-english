const { DataTypes, Op, literal, fn, col } = require('sequelize');
const sequelize = require('../config/orm');

const DiscussionThread = sequelize.define('discussion_thread', {
  thread_id: { type: DataTypes.INTEGER, primaryKey: true },
  subject: DataTypes.STRING,
  content: DataTypes.TEXT,
  is_deleted: DataTypes.BOOLEAN,
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, { tableName: 'discussion_thread', timestamps: false });

const User = sequelize.define('user', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  profile_picture_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, { tableName: 'user', timestamps: false });

const MimeType = sequelize.define('mime_type', {
  mime_id: { type: DataTypes.INTEGER, primaryKey: true },
  image_url: DataTypes.STRING
}, { tableName: 'mime_type', timestamps: false });

const DiscussionPost = sequelize.define('discussion_post', {
  post_id: { type: DataTypes.INTEGER, primaryKey: true },
  thread_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, { tableName: 'discussion_post', timestamps: false });

DiscussionThread.belongsTo(User, { foreignKey: 'user_id' });
User.belongsTo(MimeType, { foreignKey: 'profile_picture_id' });
DiscussionThread.hasMany(DiscussionPost, { foreignKey: 'thread_id' });

class ThreadModel {
  constructor() {
    this.DiscussionThread = DiscussionThread;
  }

  async findAll() {
    try {
      const threads = await DiscussionThread.findAll({
        include: [{
          model: User,
          attributes: ['first_name'],
          include: [{ model: MimeType, attributes: [['image_url', 'thread_starter_avatar_url']] }]
        }],
        attributes: {
          include: [
            [literal('(SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = discussion_thread.thread_id)'), 'replies'],
            [literal(`COALESCE((SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = discussion_thread.thread_id ORDER BY dp.created_at DESC LIMIT 1), discussion_thread.created_at)`), 'last_activity']
          ]
        },
        order: [[literal('last_activity'), 'DESC']]
      });
      const res = threads.map(t => {
        const obj = t.toJSON();
        obj.thread_starter = obj.user_id;
        obj.thread_starter_avatar_url = obj.user ? obj.user.mime_type.thread_starter_avatar_url : null;
        obj.first_name = obj.user ? obj.user.first_name : null;
        delete obj.user;
        return obj;
      });
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findOne(id) {
    try {
      const thread = await DiscussionThread.findOne({
        where: { thread_id: id },
        include: [{
          model: User,
          attributes: [
            [fn('CONCAT', col('user.first_name'), ' ', col('user.last_name')), 'full_name'],
            [literal('(SELECT COUNT(*) FROM discussion_thread dt1 WHERE dt1.user_id = user.user_id)'), 'thread_count'],
            [literal('(SELECT COUNT(*) FROM discussion_post dp1 WHERE dp1.user_id = user.user_id)'), 'post_count'],
            ['created_at', 'member_since'],
            'profile_picture_id'
          ],
          include: [{ model: MimeType, attributes: [['image_url', 'avatarUrl']] }]
        }]
      });
      return { error: null, response: thread ? [thread.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findMany({ subject, quizId, userId, dateCreated }) {
    try {
      const where = {};
      if (subject) where.subject = { [Op.like]: `%${subject}%` };
      if (quizId) where.quiz_id = quizId;
      if (userId) where.user_id = userId;
      if (dateCreated) where.created_at = { [Op.like]: `${dateCreated}%` };

      const threads = await DiscussionThread.findAll({
        where,
        include: [{
          model: User,
          attributes: ['first_name'],
          include: [{ model: MimeType, attributes: [['image_url', 'thread_starter_avatar_url']] }]
        }],
        attributes: {
          include: [
            [literal('(SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = discussion_thread.thread_id)'), 'replies'],
            [literal(`COALESCE((SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = discussion_thread.thread_id ORDER BY dp.created_at DESC LIMIT 1), discussion_thread.created_at)`), 'last_activity']
          ]
        }
      });
      const res = threads.map(t => {
        const obj = t.toJSON();
        obj.thread_starter = obj.user_id;
        obj.thread_starter_avatar_url = obj.user ? obj.user.mime_type.thread_starter_avatar_url : null;
        obj.first_name = obj.user ? obj.user.first_name : null;
        delete obj.user;
        return obj;
      });
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async addOne({ subject, description, userId, selectedRelatedQuizId }) {
    try {
      const res = await DiscussionThread.create({
        subject,
        content: description,
        user_id: userId,
        quiz_id: selectedRelatedQuizId
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(id) {
    try {
      const rows = await DiscussionThread.destroy({ where: { thread_id: id } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = ThreadModel;
