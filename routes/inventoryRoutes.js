const Router = require("express")
const router = Router();
const controller = require("../controllers/inventoryController");

router.get("/", controller.getUserSkins);
router.post("/delete", controller.deleteSkin);
router.post("/gift", controller.giftSkin);

module.exports = router;