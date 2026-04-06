function buildFilters({ rarity, weapon_type, search, sort }) {
  let conditions = [];
  let values = [];

  if (rarity) {
    values.push(rarity);
    conditions.push(`rarity = $${values.length}`);
  }

  if (weapon_type) {
    values.push(weapon_type);
    conditions.push(`weapon_type = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  let whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  let orderClause = "";

  if (sort === "price_asc") {
    orderClause = "ORDER BY price ASC";
  } else if (sort === "price_desc") {
    orderClause = "ORDER BY price DESC";
  }

  return { whereClause, orderClause, values };
}

module.exports = {
  buildFilters,
};