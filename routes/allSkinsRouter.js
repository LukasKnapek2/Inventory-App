const Router = require("express")
const router = Router();
const controller = require("../controllers/allSkinsController");


router.get("/", controller.getFilteredSkins);

module.exports = router;