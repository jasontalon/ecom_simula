require("dotenv").config();

const conn = {
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING
};

module.exports = {
  development: conn,
  production: conn
};
