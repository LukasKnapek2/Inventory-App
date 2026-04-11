const db = require("../db/queries");

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

module.exports = {
  getFilteredSkins
};
