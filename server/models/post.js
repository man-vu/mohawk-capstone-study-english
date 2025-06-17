const { DataTypes, literal } = require('sequelize');
const sequelize = require('../config/orm');

const DiscussionPost = sequelize.define('discussion_post', {
  post_id: { type: DataTypes.INTEGER, primaryKey: true },
  content: DataTypes.TEXT,
  thread_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, { tableName: 'discussion_post', timestamps: false });

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

DiscussionPost.belongsTo(User, { foreignKey: 'user_id' });
User.belongsTo(MimeType, { foreignKey: 'profile_picture_id' });

class PostModel {
  constructor() {
    this.DiscussionPost = DiscussionPost;
  }

  async findAll() {
    try {
      const res = await this.DiscussionPost.findAll();
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findDetailed(id) {
    try {
      const post = await this.DiscussionPost.findOne({
        where: { post_id: id },
        include: [{
          model: User,
          attributes: [
            [sequelize.fn('CONCAT', sequelize.col('user.first_name'), ' ', sequelize.col('user.last_name')), 'full_name'],
            ['created_at', 'member_since'],
            'profile_picture_id',
            [literal('(SELECT COUNT(*) FROM discussion_thread dt1 WHERE dt1.user_id = user.user_id)'), 'thread_count'],
            [literal('(SELECT COUNT(*) FROM discussion_post dp1 WHERE dp1.user_id = user.user_id)'), 'post_count']
          ],
          include: [{ model: MimeType, attributes: [['image_url', 'avatarUrl']] }]
        }],
        attributes: ['post_id', 'content', ['created_at', 'posted_at']]
      });
      return { error: null, response: post ? [post.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findMany(threadId) {
    try {
      const posts = await this.DiscussionPost.findAll({
        where: { thread_id: threadId },
        include: [{
          model: User,
          attributes: [
            [sequelize.fn('CONCAT', sequelize.col('user.first_name'), ' ', sequelize.col('user.last_name')), 'full_name'],
            ['created_at', 'member_since'],
            'profile_picture_id',
            [literal('(SELECT COUNT(*) FROM discussion_thread dt1 WHERE dt1.user_id = user.user_id)'), 'thread_count'],
            [literal('(SELECT COUNT(*) FROM discussion_post dp1 WHERE dp1.user_id = user.user_id)'), 'post_count']
          ],
          include: [{ model: MimeType, attributes: [['image_url', 'avatarUrl']] }]
        }],
        attributes: ['post_id', 'content', ['created_at', 'posted_at']],
        order: [['created_at', 'ASC']]
      });
      return { error: null, response: posts.map(p => p.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addOne(threadId, content, userId) {
    try {
      const res = await this.DiscussionPost.create({ thread_id: threadId, content, user_id: userId });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(id) {
    try {
      const rows = await this.DiscussionPost.destroy({ where: { post_id: id } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = PostModel;
