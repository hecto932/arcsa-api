require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT,
  dbUser: process.env.MONGO_DB_USER,
  dbPassword: process.env.MONGO_DB_PASSWORD,
  dbHost: process.env.MONGO_DB_HOST,
  dbPort: process.env.MONGO_DB_PORT,
  dbName: process.env.MONGO_DB_NAME,
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  authAdminUser: process.env.AUTH_ADMIN_USER,
  authAdminName: process.env.AUTH_ADMIN_NAME,
  authAdminPassword: process.env.AUTH_ADMIN_PASSWORD,
  authAdminEmail: process.env.AUTH_ADMIN_EMAIL,
}

module.exports = { config }