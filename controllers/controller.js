const db = require("../db/queries");

async function getFilteredSkins(req, res) {
  try {
    const filters = {
      rarity: req.query.rarity,
      weapon_type: req.query.weapon_type,
      search: req.query.search,
      sort: req.query.sort,
    };

    const skins = await db.getFilteredSkins(filters);

    res.render("skins", { skins });
  } catch (err) {
    console.error("Error fetching skins:", err);
    res.status(500).send("Internal Server Error");
  }
}
async function getUserSkins(req, res) {
  try {
        const filters = {
      rarity: req.query.rarity,
      weapon_type: req.query.weapon_type,
      search: req.query.search,
      sort: req.query.sort,
    };
    const userSkins = await db.getUserSkins(req.query.userId, filters);
    res.render("index", { skins: userSkins });
  } catch (err) {
    console.error("Error fetching user skins:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function openCase(req, res) {
  try {
    const newSkin = await db.openCase();
    res.render("cases", { skin: newSkin });
  } catch (err) {
    console.error("Error opening case:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function giftSkin(req, res) {
  const { recipientId, senderId, skinId, quantity } = req.body;
  try {
    await db.giftSkin(recipientId, senderId, skinId, quantity);
    res.redirect("/inventory");
  } catch (err) {
    console.error("Error gifting skin:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteSkin(req, res) {
  const { skinId } = req.body;
  try {
    await db.deleteSkin(skinId);
    res.redirect("/inventory");
  } catch (err) {
    console.error("Error deleting skin:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getFilteredSkins,
  getUserSkins,
  openCase,
  giftSkin,
  deleteSkin,
};
