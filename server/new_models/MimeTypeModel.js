const prisma = require('../prismaClient');
class MimeTypeModel {
  static create(data) {
    return prisma.mimeType.create({ data });
  }

  static findById(MimeId) {
    return prisma.mimeType.findUnique({ where: { MimeId } });
  }

  static findOne(MimeId) {
    return prisma.mimeType.findUnique({
      where: { MimeId },
      select: { ImageUrl: true, ImageAlt: true },
    });
  }

  static update(MimeId, data) {
    return prisma.mimeType.update({ where: { MimeId }, data });
  }

  static delete(MimeId) {
    return prisma.mimeType.delete({ where: { MimeId } });
  }

  static findAll() {
    return prisma.mimeType.findMany();
  }
}
module.exports = MimeTypeModel;
