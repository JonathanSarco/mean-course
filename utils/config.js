const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../.env` });

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: (process.env.PORT) ? process.env.PORT : 3000,
  DB: {
    DB_URL: process.env.DB_URL
  },
  BASE_URL_BE: process.env.BASE_URL_BE
}

module.exports = config;