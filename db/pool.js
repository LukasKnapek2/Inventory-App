const { Pool } = require("pg");



module.exports = new Pool({
  host: "localhost", 
  user: process.env.POSTGRESQL_USER,
  database: "inventory_app",
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432 // 
});