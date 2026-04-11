const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weapon_type VARCHAR(255) NOT NULL,
    rarity VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password Text NOT NULL
);

CREATE TABLE IF NOT EXISTS inventories (
    id SERIAL PRIMARY KEY,
    
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
        
    skin_id INTEGER NOT NULL
        REFERENCES skins(id) ON DELETE CASCADE,

    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),

    UNIQUE(user_id, skin_id)
);

INSERT INTO skins (name, price, weapon_type, rarity, image_url) VALUES
('Dragon Lore', 1500.00, 'AWP', 'epic', 'https://example.com/dragon_lore.jpg'),
('Howl', 1200.00, 'M4A4', 'common', 'https://example.com/howl.jpg'),
('Medusa', 1000.00, 'AWP', 'rare', 'https://example.com/medusa.jpg');

INSERT INTO users (username) VALUES
('alice'),
('bob'),
('charlie');

INSERT INTO inventories (user_id, skin_id)
SELECT users.id, skins.id
FROM users, skins
WHERE users.username = 'alice'
AND skins.name = 'Dragon Lore';
`;

async function populateDB() {
  const connectionString = process.argv[2] ||`postgresql://${process.env.POSTGRESQL_USER}:${process.env.POSTGRESQL_PASSWORD}@localhost:5432/${process.env.POSTGRESQL_DB}`;
  const dbClient = new Client({
    connectionString: connectionString,
  });
  await dbClient.connect();
  await dbClient.query(SQL);
  await dbClient.end();
}

populateDB()
  .then(() => {
    console.log("Database populated successfully");
  })
  .catch((err) => {
    console.error("Error populating database:", err);
  });
