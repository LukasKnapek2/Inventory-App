const db = require("../db/queries");
const { get } = require("../routes/userRoutes");

async function getFilteredSkins(req, res) {
  try {
  const filters = {
    rarity: req.query.rarity,
    weapon_type: req.query.weapon_type,
    search: req.query.search,
    sort: req.query.sort,
    page: req.query.page
  };

  const skins = await db.getFilteredSkins(filters);
  const total = await db.getTotalSkins(filters);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  res.render("skins", {
    skins,
    query: req.query,
    currentPage: parseInt(req.query.page) || 1,
    totalPages
  });
}
  catch (err) {
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
      page: req.query.page
    };
    const userSkins = await db.getUserSkins(req.query.userId, filters);
    const total = await db.getTotalSkins(filters);

    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    res.render("index", { skins: userSkins, query: req.query, currentPage: parseInt(req.query.page) || 1, totalPages });
  } catch (err) {
    console.error("Error fetching user skins:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function getCasePage(req, res) {
  try {
    let newSkin = null;
    if (req.query.skinId) {
      const result = await db.getSkinById(req.query.skinId);
      newSkin = result;
    }
    
    res.render("case", { newSkin });
  } catch (err) {
    console.error("Error opening case:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function openCase(req, res) {
  const userId = 1; // Replace with the actual user ID
  try {
    const newSkin = await db.openCase(userId);
    res.redirect(`/case?skinId=${newSkin.id}`);
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
  getCasePage,
  openCase,
  giftSkin,
  deleteSkin,
};
