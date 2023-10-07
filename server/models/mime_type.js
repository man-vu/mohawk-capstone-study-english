const database = new (require("../config/database"))();

class MimeTypeModel {
  constructor() {
    this.db = database;
  }

  async addOne({ image_url, image_alt }) {
    return await this.db.executeQuery(`
    INSERT INTO mime_type (image_url, image_alt)
    VALUES ('${image_url}', '${image_alt}')`)
  }

  async findOne(mimeId) {
    return await this.db.executeQuery(`SELECT image_url, image_alt FROM mime_type WHERE mime_id = '${mimeId}'`)
  }
}

module.exports = MimeTypeModel;