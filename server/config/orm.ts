import { Sequelize } from 'sequelize';
import config from './index';

const { mysql_host, mysql_user, mysql_port, mysql_password, database_name } = config;

const sequelize = new Sequelize(database_name, mysql_user, mysql_password, {
  host: mysql_host,
  port: mysql_port,
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
