const database = new (require("../config/database"))();

class UserModel {
  constructor() {
    this.db = database;
  }

  async findAll() {
    return await this.db.executeQuery("SELECT user_id, first_name, last_name, CONCAT(first_name, ' ', last_name) as full_name FROM user");
  }

  async findAllTeachers() {
    return await this.db.executeQuery("SELECT * FROM user WHERE role_id = 1");
  }

  async findAllStudents() {
    return await this.db.executeQuery("SELECT * FROM user WHERE role_id = 2");
  }

  async findOneById(id) {
    return await this.db.executeQuery(
      `SELECT user.email, user.first_name, user.last_name, user.gender 
      FROM user WHERE user_id = ${id}`
    );
  }

  async findOneByEmail(email) {
    return await this.db.executeQuery(
      `SELECT user_id, role_id, password_hash, first_name, last_name, profile_picture_id, password_reset_hash, password_reset_salt, password_reset_expiry
       FROM user WHERE email='${email}'`
    );
  }

  async addOne(email, passwordHash, passwordSalt, gender, roleId, profilePictureId, firstName, lastName) {
    return await this.db
      .executeQuery(`INSERT INTO user(email, password_hash, password_salt, gender, role_id, profile_picture_id, first_name, last_name)  
    VALUES('${email}', '${passwordHash}', '${passwordSalt}', '${gender}', '${roleId}', '${profilePictureId}', '${firstName}', '${lastName}')`);
  }

  async saveOne(userId, email, firstName, lastName, gender) {
    return this.db.executeQuery(`UPDATE user
    SET email = '${email}', first_name = '${firstName}', last_name = '${lastName}', gender = '${gender}'
    WHERE user_id = ${userId}`);
  }

  async deleteOne(userId) {
    return this.db.executeQuery(`
    DELETE FROM user WHERE user_id = ${userId};
    DELETE FROM user_attempt WHERE user_id = ${userId};
    DELETE FROM user_answer_question WHERE user_id = ${userId};
    DELETE FROM user_favorite WHERE user_id = ${userId};
    DELETE FROM user_rating WHERE user_id = ${userId};`)
  }

  async savePassword({userId, passwordHash, passwordSalt}) {
    return this.db.executeQuery(`UPDATE user
    SET password_salt = '${passwordSalt}', password_hash = '${passwordHash}'
    WHERE user_id = ${userId}`);
  }

  async saveResetPassword({ userId, passwordHash, passwordSalt, passwordExpiry}) {
    return this.db.executeQuery(`UPDATE user
    SET password_reset_salt = '${passwordSalt}', 
    password_reset_hash = '${passwordHash}',
    password_reset_expiry = '${passwordExpiry}'
    WHERE user_id = ${userId}`);
  }

  async saveProfilePicture({ userId, mimeId}) {
    return this.db.executeQuery(`UPDATE user
    SET profile_picture_id = '${mimeId}'
    WHERE user_id = ${userId}`);
  }

  async deleteResetPassword({userId}) {
    return this.db.executeQuery(`UPDATE user
    SET password_reset_salt = NULL,
    password_reset_hash = NULL,
    password_reset_expiry = NULL
    WHERE user_id = ${userId}`);
  }
}

module.exports = UserModel;