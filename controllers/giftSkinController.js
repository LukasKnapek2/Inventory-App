const db = require("../db/queries");

async function giftSkin(req, res) {
  const { recipient, skinId } = req.body;
  const quantity = Number(req.body.quantity);

  const recipientId = await db.getUserIdByUsername(recipient);
  if (!recipientId) {
    return res.status(400).send("Recipient not found");
  }
  if (quantity <= 0 || await db.getUserSkinQuantity(req.session.user.id, skinId) < quantity) {
    return res.status(400).send("Invalid quantity");
  }

  try {
    await db.giftSkin(recipientId, req.session.user.id, skinId, quantity);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error gifting skin:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  giftSkin
};  