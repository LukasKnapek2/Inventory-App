const bcrypt = require("bcrypt");
const authQueries = require("../db/authQueries");


function getRegisterPage(req, res) {
  res.render("auth/register");
}

function getLoginPage(req, res) {
  res.render("auth/login");
}

async function register(req, res) {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await authQueries.register(username, hashedPassword);

    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.send("Error registering user");
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await authQueries.getUserByUsername(username);

  if (!user) {
    return res.send('User not found. <a href="/auth/register">Register</a>');
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.send("Wrong password");
  }

req.session.user = {
  id: user.id,
  username: user.username,
};

req.session.save(() => {
  res.redirect("/inventory");
});
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
}


module.exports = {
  register,
  login,
  logout,
  getRegisterPage,
  getLoginPage
}

