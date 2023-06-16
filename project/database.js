const dotenv = require ('dotenv');
const { Pool } = require ('pg');
dotenv.config();
let client = new Pool();
const {
  DB_HOST,
  DB_PORT,
  DEV_DB,
  TEST_DB,
  DB_USER,
  DB_PASSWORD,
  ENV,
} = process.env;
console.log(ENV);
if (ENV === 'dev') {
  client = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DEV_DB,
    user: DB_USER,
    password: DB_PASSWORD,
  });
}
if (ENV === 'test') {
  client = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: TEST_DB,
    user: DB_USER,
    password: DB_PASSWORD,
  });
}
module.exports = client;
