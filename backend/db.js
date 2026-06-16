// Author: Pranathi
// This file connects our app to the PostgreSQL database

const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// checking if database connection is working
pool.connect(function (err, client, release) {
  if (err) {
    console.log("database connection failed: " + err.message);
  } else {
    console.log("database connected successfully");
    release();
  }
});

module.exports = pool;
