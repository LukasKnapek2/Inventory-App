const {client} = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES
('alice', 'password123'),
('bob', 'securepassword'),
('charlie', 'mypassword');

CREATE TABLE IF NOT EXISTS skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
    weapon-type VARCHAR(255) NOT NULL,
    rarity VARCHAR(255) NOT NULL,
    image-url VARCHAR(255) NOT NULL
);

INSERT INTO skins (name, price, weapon-type, rarity, image-url) VALUES
('Dragon Lore', 1500.00, 'AWP', 'Covert', 'https://example.com/dragon_lore.jpg'),
('Howl', 1200.00, 'M4A4', 'Covert', 'https://example.com/howl.jpg'),
('Medusa', 1000.00, 'AWP', 'Covert', 'https://example.com/medusa.jpg');

CREATE TABLE IF NOT EXISTS inventories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skin_id INTEGER REFERENCES skins(id)
);

INSERT INTO inventories (user_id, skin_id) VALUES
(1, 1),
(1, 2),
(2, 3);
`;

async function populateDB() {
    const dbClient = new client({
        connectionString: process.env.DATABASE_URL,
    });
    await dbClient.connect();
    await dbClient.query(SQL);
    await dbClient.end();
}

populateDB().then(() => {
    console.log("Database populated successfully");
}).catch((err) => {
    console.error("Error populating database:", err);
});