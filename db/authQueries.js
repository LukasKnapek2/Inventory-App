const pool = require("./pool");

async function register(username, hashedPassword) {
    await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)`,
      [username, hashedPassword]
    );
  }
  
async function getUserByUsername(username) {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  }
  

  module.exports = {
    register,
    getUserByUsername
  };