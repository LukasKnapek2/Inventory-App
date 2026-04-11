const Router = require("express")
const router = Router();
const controller = require("../controllers/controller");


router.get("/skins", controller.getFilteredSkins);
router.post("/delete", controller.deleteSkin);
router.post("/gift", controller.giftSkin);

module.exports = router;