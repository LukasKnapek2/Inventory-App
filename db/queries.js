const pool = require("./pool");
const { buildFilters } = require("./filter");

async function getFilteredSkins(filters) {
  const { whereClause, orderClause, values } = buildFilters(filters);

  const query = `
    SELECT * FROM skins
    ${whereClause}
    ${orderClause}
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

async function getUserSkins(userId, filters) {
  const { whereClause, orderClause, values } = buildFilters(filters);

  // userId must be FIRST value
  values.unshift(userId);

  const query = `
    SELECT skins.*
    FROM skins
    JOIN inventories ON skins.id = inventories.skin_id
    WHERE inventories.user_id = $1
    ${whereClause ? "AND " + whereClause.replace("WHERE ", "") : ""}
    ${orderClause}
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

async function openCase() {
  const result = await pool.query(
    `SELECT * FROM skins ORDER BY RANDOM() LIMIT 1`,
  );
  const newSkin = result.rows[0];

  await pool.query(
    `INSERT INTO inventories (user_id, skin_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, skin_id)
     DO UPDATE SET quantity = inventories.quantity + 1`,
    [userId, newSkin.id],
  );

  return newSkin;
}

async function giftSkin(recipientId, senderId, skinId, quantity) {
  await pool.query(
    `-- remove from sender
UPDATE inventories
SET quantity = quantity - $quantity
WHERE user_id = $senderId AND skin_id = $skinId

-- add to receiver
INSERT INTO inventories (user_id, skin_id, quantity)
VALUES ($receiver, $skinId, $quantity)
ON CONFLICT (user_id, skin_id)
DO UPDATE SET quantity = inventories.quantity + $quantity;`,
    [recipientId, senderId, skinId, quantity],
  );
}

async function deleteSkin(skinId) {
  await pool.query(`DELETE FROM inventories WHERE skin_id = $1`, [skinId]);
}

module.exports = {
  getFilteredSkins,
  getUserSkins,
  openCase,
  giftSkin,
  deleteSkin,
};
