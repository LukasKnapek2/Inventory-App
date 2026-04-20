const db = require("../db/queries");

async function getUserSkins(req, res) {
  try {
    const filters = {
      rarity: req.query.rarity,
      weapon_type: req.query.weapon_type,
      search: req.query.search,
      sort: req.query.sort,
      page: req.query.page,
    };
    const userSkins = await db.getUserSkins(req.session.user.id, filters);
    const total = await db.getTotalUserSkins(req.session.user.id, filters);

    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    // Check if request accepts JSON (for AJAX requests)
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json({
        skins: userSkins,
        query: req.query,
        currentPage: parseInt(req.query.page) || 1,
        totalPages,
        pageType: "inventory"
      });

   } else {
      res.render("skins", {
        skins: userSkins,
        query: req.query,
        currentPage: parseInt(req.query.page) || 1,
        totalPages
      });
    }
  } catch (err) {
    console.error("Error fetching user skins:", err);
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
  getUserSkins,
  deleteSkin,
};
