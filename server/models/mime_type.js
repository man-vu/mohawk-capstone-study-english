const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const MimeType = sequelize.define('mime_type', {
  mime_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image_url: DataTypes.STRING,
  image_alt: DataTypes.STRING
}, { tableName: 'mime_type', timestamps: false });

class MimeTypeModel {
  constructor() {
    this.MimeType = MimeType;
  }

  async addOne({ image_url, image_alt }) {
    try {
      const res = await this.MimeType.create({ image_url, image_alt });
      return { error: null, response: { affectedRows: res ? 1 : 0, mime_id: res.mime_id } };
    } catch (error) {
      return { error };
    }
  }

  async findOne(mimeId) {
    try {
      const res = await this.MimeType.findByPk(mimeId, { attributes: ['image_url', 'image_alt'] });
      return { error: null, response: res ? [res.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = MimeTypeModel;