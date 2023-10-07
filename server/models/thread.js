const database = new (require("../config/database"))();

class ThreadModel {
  constructor() {
    this.db = database;
  }

  async findAll() {
    return await this.db
      .executeQuery(`SELECT dt.subject, dt.thread_id, dt.content, dt.quiz_id, dt.user_id as thread_starter, 
      u.first_name,
    (SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = dt.thread_id) as replies,
    COALESCE(
    (SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = dt.thread_id ORDER BY dp.created_at DESC LIMIT 1),
    (SELECT dt.created_at FROM discussion_thread dt1 WHERE dt1.thread_id = dt.thread_id)
    ) as last_activity,
    mt.image_url as thread_starter_avatar_url
    FROM discussion_thread dt JOIN user u ON dt.user_id = u.user_id
    JOIN mime_type mt ON u.profile_picture_id = mt.mime_id
    ORDER BY last_activity desc`);
  }

  async findOne(id) {
    return await this.db.executeQuery(
      `SELECT dt.thread_id, dt.subject, dt.content, dt.created_at, 
      (SELECT CONCAT(u.first_name, ' ', u.last_name)) as full_name,
            (SELECT COUNT(*) FROM discussion_thread dt1 WHERE dt1.user_id = u.user_id) as thread_count,
            (SELECT COUNT(*) FROM discussion_post dp1 WHERE dp1.user_id = u.user_id) as post_count,
            dt.is_deleted,
      u.created_at as member_since, u.profile_picture_id, m.image_url as avatarUrl
      FROM discussion_thread dt JOIN user u ON dt.user_id = u.user_id
      JOIN mime_type m ON m.mime_id = u.profile_picture_id
      WHERE dt.thread_id = ${id}`
    );
  }

  async findMany({ subject, quizId, userId, dateCreated }) {
    const whereClause = [];
    let formattedWhereClause = ''
    if (subject) {
      whereClause.push(`dt.subject LIKE '%${subject}%'`);
    }
    if (quizId) {
      whereClause.push(`dt.quiz_id = ${quizId}`);
    }
    if (userId) {
      whereClause.push(`dt.user_id = ${userId}`);
    }
    if (dateCreated) {
      whereClause.push(`dt.created_at LIKE '${dateCreated}%'`);
    }

    if (whereClause.length > 0) {
      formattedWhereClause = 'WHERE ' + whereClause.join(" AND ")
    }

    return await this.db.executeQuery(
      `SELECT dt.subject, dt.thread_id, dt.content, dt.quiz_id, dt.user_id as thread_starter, 
        u.first_name,
      (SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = dt.thread_id) as replies,
      COALESCE(
      (SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = dt.thread_id ORDER BY dp.created_at DESC LIMIT 1),
      (SELECT dt.created_at FROM discussion_thread dt1 WHERE dt1.thread_id = dt.thread_id)
      ) as last_activity,
      mt.image_url as thread_starter_avatar_url
      FROM discussion_thread dt JOIN user u ON dt.user_id = u.user_id
      JOIN mime_type mt ON u.profile_picture_id = mt.mime_id
      ${formattedWhereClause}`
    );
  }

  async addOne({ subject, description, userId, selectedRelatedQuizId  }) {
    return await this.db.executeQuery(`
      INSERT INTO discussion_thread(subject, content, user_id, quiz_id) 
      VALUES ('${subject}', '${description}', '${userId}', '${selectedRelatedQuizId}');
      `);
  }

  async deleteOne(id) {
    return await this.db.executeQuery(`DELETE FROM discussion_thread WHERE thread_id = ${id}`)
  }
}

module.exports = ThreadModel;
