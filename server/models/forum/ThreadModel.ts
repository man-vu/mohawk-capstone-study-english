import prisma from '../../prismaClient';

export interface ThreadSearch {
  subject?: string;
  quizId?: number;
  userId?: number;
  dateCreated?: string;
}

export class ThreadModel {
  static findAll() {
    return prisma.$queryRaw`SELECT dt.subject, dt.thread_id, dt.content, dt.quiz_id, dt.user_id as thread_starter,
      u.first_name,
      (SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = dt.thread_id) as replies,
      COALESCE((SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = dt.thread_id ORDER BY dp.created_at DESC LIMIT 1),
               (SELECT dt1.created_at FROM discussion_thread dt1 WHERE dt1.thread_id = dt.thread_id)) as last_activity,
      mt.image_url as thread_starter_avatar_url
      FROM discussion_thread dt JOIN user u ON dt.user_id = u.user_id
      JOIN mime_type mt ON u.profile_picture_id = mt.mime_id
      ORDER BY last_activity desc`;
  }

  static async findMany({ subject, quizId, userId, dateCreated }: ThreadSearch) {
    const whereClause: string[] = [];
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
    const formatted = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
    const query = `SELECT dt.subject, dt.thread_id, dt.content, dt.quiz_id, dt.user_id as thread_starter,
      u.first_name,
      (SELECT COUNT(*) FROM discussion_post dp WHERE dp.thread_id = dt.thread_id) as replies,
      COALESCE((SELECT dp.created_at FROM discussion_post dp WHERE dp.thread_id = dt.thread_id ORDER BY dp.created_at DESC LIMIT 1),
               (SELECT dt1.created_at FROM discussion_thread dt1 WHERE dt1.thread_id = dt.thread_id)) as last_activity,
      mt.image_url as thread_starter_avatar_url
      FROM discussion_thread dt JOIN user u ON dt.user_id = u.user_id
      JOIN mime_type mt ON u.profile_picture_id = mt.mime_id
      ${formatted}`;
    return prisma.$queryRawUnsafe(query);
  }
}
export default ThreadModel;
