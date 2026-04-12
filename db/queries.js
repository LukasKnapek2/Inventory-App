const pool = require("./pool");
const { buildFilters } = require("./filter");

async function getFilteredSkins(filters) {
  const { whereClause, orderClause, values } = buildFilters(filters);

  const page = parseInt(filters.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  values.push(limit);
  values.push(offset);

  const query = `
    SELECT * FROM skins
    ${whereClause}
    ${orderClause}
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const result = await pool.query(query, values);
  return result.rows;
}
async function getTotalSkins(filters) {
  const { whereClause, values } = buildFilters(filters);

  const query = `
    SELECT COUNT(*) FROM skins
    ${whereClause ? "WHERE " + whereClause.replace("WHERE ", "") : ""}
  `;

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count);
}

async function getTotalUserSkins(userId, filters) {
  const { whereClause, values } = buildFilters(filters);

  values.unshift(userId);

  // Adjust placeholders
  let adjustedWhereClause = whereClause.replace(
    /\$(\d+)/g,
    (match, num) => `$${parseInt(num) + 1}`,
  );

  const query = `
    SELECT COUNT(*) FROM skins
    JOIN inventories ON skins.id = inventories.skin_id
    WHERE inventories.user_id = $1 AND inventories.quantity > 0
    ${adjustedWhereClause ? "AND " + adjustedWhereClause.replace("WHERE ", "") : ""}
  `;

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count);
}

async function getUserSkins(userId, filters) {
  const { whereClause, orderClause, values } = buildFilters(filters);

  // userId must be FIRST value
  values.unshift(userId);

  // Adjust placeholders since userId is prepended
  let adjustedWhereClause = whereClause.replace(
    /\$(\d+)/g,
    (match, num) => `$${parseInt(num) + 1}`,
  );

  const query = `
    SELECT skins.*, inventories.quantity
    FROM skins
    JOIN inventories ON skins.id = inventories.skin_id
    WHERE inventories.user_id = $1 AND inventories.quantity > 0
    ${adjustedWhereClause ? "AND " + adjustedWhereClause.replace("WHERE ", "") : ""}
    ${orderClause}
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

async function openCase(userId) {
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

async function getSkinById(skinId) {
  const result = await pool.query(`SELECT * FROM skins WHERE id = $1`, [
    skinId,
  ]);
  return result.rows[0];
}

async function giftSkin(recipientId, senderId, skinId, quantity) {
  // Remove from sender: update if more than gifting, or delete if exactly
  await pool.query(
    `UPDATE inventories
     SET quantity = quantity - $1
     WHERE user_id = $2 AND skin_id = $3 AND quantity > $1`,
    [quantity, senderId, skinId]
  );

  // Delete sender's entry if they gifted exactly their quantity
  await pool.query(
    `DELETE FROM inventories
     WHERE user_id = $1 AND skin_id = $2 AND quantity = $3`,
    [senderId, skinId, quantity]
  );

  // Add to receiver
  await pool.query(
    `INSERT INTO inventories (user_id, skin_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, skin_id)
     DO UPDATE SET quantity = inventories.quantity + $3`,
    [recipientId, skinId, quantity]
  );
}

async function getUserSkinQuantity(userId, skinId) {
  const result = await pool.query(
    `SELECT quantity FROM inventories WHERE user_id = $1 AND skin_id = $2`,
    [userId, skinId],
  );
  return result.rows[0]?.quantity || 0;
}

async function getUserIdByUsername(username) {
  const result = await pool.query(`SELECT id FROM users WHERE username = $1`, [
    username,
  ]);
  return result.rows[0]?.id;
}

async function deleteSkin(skinId) {
  await pool.query(`DELETE FROM inventories WHERE skin_id = $1`, [skinId]);
}

module.exports = {
  getFilteredSkins,
  getTotalSkins,
  getUserSkins,
  getTotalUserSkins,
  openCase,
  giftSkin,
  deleteSkin,
  getSkinById,
  getUserSkinQuantity,
  getUserIdByUsername,
};
