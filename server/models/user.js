const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING,
  password_salt: DataTypes.STRING,
  gender: DataTypes.STRING,
  role_id: DataTypes.INTEGER,
  profile_picture_id: DataTypes.INTEGER,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  password_reset_hash: DataTypes.STRING,
  password_reset_salt: DataTypes.STRING,
  password_reset_expiry: DataTypes.DATE,
}, {
  tableName: 'user',
  timestamps: false
});

class UserModel {
  constructor() {
    this.User = User;
  }

  async findAll() {
    try {
      const users = await this.User.findAll({
        attributes: [
          'user_id',
          'first_name',
          'last_name',
          [sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'full_name']
        ]
      });
      return { error: null, response: users.map(u => u.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findAllTeachers() {
    try {
      const res = await this.User.findAll({ where: { role_id: 1 } });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findAllStudents() {
    try {
      const res = await this.User.findAll({ where: { role_id: 2 } });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findOneById(id) {
    try {
      const user = await this.User.findByPk(id, {
        attributes: ['email', 'first_name', 'last_name', 'gender']
      });
      return { error: null, response: user ? [user.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findOneByEmail(email) {
    try {
      const user = await this.User.findOne({
        where: { email },
        attributes: ['user_id', 'role_id', 'password_hash', 'first_name', 'last_name', 'profile_picture_id', 'password_reset_hash', 'password_reset_salt', 'password_reset_expiry']
      });
      return { error: null, response: user ? [user.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async addOne(email, passwordHash, passwordSalt, gender, roleId, profilePictureId, firstName, lastName) {
    try {
      const res = await this.User.create({
        email,
        password_hash: passwordHash,
        password_salt: passwordSalt,
        gender,
        role_id: roleId,
        profile_picture_id: profilePictureId,
        first_name: firstName,
        last_name: lastName
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne(userId, email, firstName, lastName, gender) {
    try {
      const [rows] = await this.User.update({
        email,
        first_name: firstName,
        last_name: lastName,
        gender
      }, {
        where: { user_id: userId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(userId) {
    try {
      const rows = await this.User.destroy({ where: { user_id: userId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async savePassword({ userId, passwordHash, passwordSalt }) {
    try {
      const [rows] = await this.User.update({
        password_salt: passwordSalt,
        password_hash: passwordHash
      }, {
        where: { user_id: userId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async saveResetPassword({ userId, passwordHash, passwordSalt, passwordExpiry }) {
    try {
      const [rows] = await this.User.update({
        password_reset_salt: passwordSalt,
        password_reset_hash: passwordHash,
        password_reset_expiry: passwordExpiry
      }, {
        where: { user_id: userId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async saveProfilePicture({ userId, mimeId }) {
    try {
      const [rows] = await this.User.update({
        profile_picture_id: mimeId
      }, {
        where: { user_id: userId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteResetPassword({ userId }) {
    try {
      const [rows] = await this.User.update({
        password_reset_salt: null,
        password_reset_hash: null,
        password_reset_expiry: null
      }, {
        where: { user_id: userId }
      });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = UserModel;
