module.exports = () => {
  return require("knex")({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING
    //debug: true,
  });
};
