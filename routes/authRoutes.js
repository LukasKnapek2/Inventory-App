const Router = require("express")
const router = Router();
const controller = require("../controllers/authController");


router.get("/register", controller.getRegisterPage);
router.post("/register", controller.register);

router.get("/login", controller.getLoginPage);
router.post("/login", controller.login);

router.get("/logout", controller.logout);

module.exports = router;
