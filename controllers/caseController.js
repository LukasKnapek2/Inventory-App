const db = require("../db/queries");

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
  const userId = req.session.user.id;
  try {
    const newSkin = await db.openCase(userId);
    res.redirect(`/case?skinId=${newSkin.id}`);
  } catch (err) {
    console.error("Error opening case:", err);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = {
  getCasePage,
  openCase
};