const db = require('../db/queries');

async function getAllSkins(req, res) {
    try {
        const skins = await db.getAllSkins();
        res.render("skins", { skins });
    } catch (err) {
        console.error("Error fetching skins:", err);
        res.status(500).send("Internal Server Error");
    }
}
async function getUserSkins(req, res) {
    const userId = req.session.userId; // Assuming you have user authentication and session management in place
    try {
        const userSkins = await db.getUserSkins(userId);
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
    const { recipientId, skinId } = req.body;
    try {
        await db.giftSkin(recipientId, skinId);
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
    getAllSkins,
    getUserSkins,
    openCase,
    giftSkin,
    deleteSkin,
};
 