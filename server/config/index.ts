import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined.");
}

dotenv.config({
  path: path.resolve(__dirname, "../..", `.env.${process.env.NODE_ENV}`)
});

/**
 * Mapping environment variables to local variables that can be used throughout the app
 */
const envFile = {
  vue_app_server_endpoint: process.env.VUE_APP_SERVER_ENDPOINT,
  server_port: process.env.SERVER_PORT,
  client_port: process.env.CLIENT_PORT,
  mysql_host: process.env.MYSQL_HOST,
  mysql_port: process.env.MYSQL_PORT,
  mysql_user: process.env.MYSQL_USER,
  mysql_password: process.env.MYSQL_PASSWORD,
  database_name: process.env.DATABASE_NAME,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_ttl: process.env.REDIS_TTL,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  jwt_expiry_time: process.env.JWT_EXPIRY_TIME ? parseInt(process.env.JWT_EXPIRY_TIME) : 86400,
  password_reset_expiry_time: process.env.PASSWORD_RESET_EXPIRY_TIME,
  datetime_format: process.env.DATETIME_FORMAT,
  appmail: process.env.APPMAIL,
  appmail_password: process.env.APPMAIL_PASSWORD,
};
export const {
  vue_app_server_endpoint,
  server_port,
  client_port,
  mysql_host,
  mysql_port,
  mysql_user,
  mysql_password,
  database_name,
  redis_host,
  redis_port,
  redis_ttl,
  jwt_secret_key,
  jwt_expiry_time,
  password_reset_expiry_time,
  datetime_format,
  appmail,
  appmail_password,
} = envFile;

export default envFile;
