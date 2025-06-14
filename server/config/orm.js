const { Sequelize } = require('sequelize');
const { mysql_host, mysql_user, mysql_port, mysql_password, database_name } = require('./index');

const sequelize = new Sequelize(database_name, mysql_user, mysql_password, {
  host: mysql_host,
  port: mysql_port,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
