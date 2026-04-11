const Router = require("express")
const router = Router();
const controller = require("../controllers/caseController");

router.get("/", controller.getCasePage)
router.post("/open", controller.openCase);