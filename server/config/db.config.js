const Pool = require('pg').Pool;
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
});

module.exports = pool;
