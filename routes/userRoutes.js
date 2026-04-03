const Router = require("express")
const router = Router();
const controller = require("../controllers/userController");

router.get("/", controller.getUserSkins);
router.post("/cases", controller.openCase);
router.get("/skins", controller.getAllSkins);
router.post("/delete", controller.deleteSkin);
router.post("/gift", controller.giftSkin);

module.exports = router;