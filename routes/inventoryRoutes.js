const Router = require("express")
const router = Router();
const controller = require("../controllers/inventoryController");
const giftSkinController = require("../controllers/giftSkinController");

router.get("/", controller.getUserSkins);
router.post("/delete", controller.deleteSkin);
router.post("/gift", giftSkinController.giftSkin);

module.exports = router;