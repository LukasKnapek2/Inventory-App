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


 async function openCaseAjax(req, res) {
    const userId = req.session.user.id;
    try {
      // Get all skins for animation
      const allSkins = await require("../db/queries").getFilteredSkins({});
      // Pick 30 random skins for the animation
      const animationSkins = [];
      for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * allSkins.length);
        animationSkins.push(allSkins[rand]);
      }
      // Pick the winning skin (simulate opening)
      const winningSkin = await require("../db/queries").openCase(userId);
      // Place the winning skin in the center
      const center = Math.floor(animationSkins.length / 2);
      animationSkins[center] = winningSkin;
      res.json({
        animationSkins,
        winningSkin,
      });
    } catch (err) {
      console.error("Error in openCaseAjax:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

module.exports = {
  getCasePage,
  openCase,
  openCaseAjax
};
