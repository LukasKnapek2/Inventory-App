const Router = require("express")
const router = Router();
const controller = require("../controllers/authController");


app.get("/register", getRegisterPage);
app.post("/register", register);

app.get("/login", getLoginPage);
app.post("/login", login);

app.get("/logout", logout);

