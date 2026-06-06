require('dotenv').config();

module.exports = {
  port:      process.env.PORT       || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  nodeEnv:   process.env.NODE_ENV   || 'development'
};