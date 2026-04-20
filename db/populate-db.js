const { Client } = require("pg");
require("dotenv").config();

function generateSkins(count = 100) {
  const weaponTypes = ["AK-47", "M4A4", "AWP", "Glock-18", "Knife"];
  function getRandomRarity() {
    const rand = Math.random() * 100;
    if (rand < 60) return "common";
    if (rand < 85) return "rare";
    if (rand < 95) return "epic";
    return "legendary";
  }

  const names = [
    "Vortex",
    "Phantom",
    "Crimson",
    "Obsidian",
    "Nova",
    "Specter",
    "Inferno",
    "Pulse",
    "Venom",
    "Blaze",
    "Frost",
    "Shadow",
    "Titan",
    "Nebula",
    "Storm",
  ];

  const images = {
  'AK-47': 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'M4A4': 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
  'AWP': 'https://images.unsplash.com/photo-1608889175123-8ee362201f81',
  'Knife': 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
  'Glock-18': 'https://images.unsplash.com/photo-1520975916090-3105956dac38'
};

  const skins = [];

  for (let i = 0; i < count; i++) {
    const weapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    const rarity = getRandomRarity();
    const name =
      names[Math.floor(Math.random() * names.length)] + " " + (i + 1);

    const priceBase = {
      common: 50,
      rare: 200,
      epic: 600,
      legendary: 1200,
    };

    const price = (priceBase[rarity] + Math.random() * 200).toFixed(2);

    skins.push({
      name,
      weapon,
      rarity,
      price,
      image: images[weapon]
    });
  }

  return skins;
}

const SQL = `
DROP TABLE IF EXISTS inventories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS skins;

CREATE TABLE IF NOT EXISTS skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weapon_type VARCHAR(255) NOT NULL,
    rarity VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

ALTER TABLE skins 
ADD CONSTRAINT unique_skin_name UNIQUE (name);


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT ''
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
`;

async function populateDB() {
  const connectionString =
    process.argv[2] ||
    `postgresql://${process.env.POSTGRESQL_USER}:${process.env.POSTGRESQL_PASSWORD}@localhost:5432/${process.env.POSTGRESQL_DB}`;
  const dbClient = new Client({
    connectionString: connectionString,
  });
  await dbClient.connect();
  await dbClient.query(SQL);
  const skins = generateSkins(100);
  for (const skin of skins) {
  await dbClient.query(
    `INSERT INTO skins (name, price, weapon_type, rarity, image_url)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (name) DO NOTHING`,
    [skin.name, skin.price, skin.weapon, skin.rarity, skin.image]
  );
}
  await dbClient.end();
}

populateDB()
  .then(() => {
    console.log("Database populated successfully");
  })
  .catch((err) => {
    console.error("Error populating database:", err);
  });
