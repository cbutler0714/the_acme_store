const pg = require("pg");
const client = new pg.Client(
  process.env.URL || "postgres://postgres:123@localhost:5432/the_acme_store"
);
const uuid = require("uuid");

const createTables = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS favorites CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      
      CREATE TABLE users (
          id UUID PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL
      );
      
      CREATE TABLE products (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE favorites ( 
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES users(id) NOT NULL,
          product_id UUID REFERENCES products(id) NOT NULL,
          CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
      );

    `;

    await client.query(SQL);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error setting up tables: ", err);
  }
};

const seedData = async () => {
  try {
    const checkUsersSQL = `
      SELECT username FROM users WHERE username IN ($1, $2)
    `;
    const checkUserValues = ["user1", "user2"];
    const { rows } = await client.query(checkUsersSQL, checkUserValues);

    if (rows.length < 2) {
      const user1Values = [uuid.v4(), "user1", "password1"];
      const user2Values = [uuid.v4(), "user2", "password2"];

      // Insert user1
      const user1SQL = `
        INSERT INTO users (id, username, password)
        VALUES ($1, $2, $3)
      `;
      await client.query(user1SQL, user1Values);

      // Insert user2
      const user2SQL = `
        INSERT INTO users (id, username, password)
        VALUES ($1, $2, $3)
      `;
      await client.query(user2SQL, user2Values);

      // Insert products for user1 and user2
      const product1Values = [uuid.v4(), "Product A"];
      const product2Values = [uuid.v4(), "Product B"];

      const productsSQL = `
        INSERT INTO products (id, name)
        VALUES ($1, $2), ($3, $4)
      `;
      await client.query(productsSQL, [...product1Values, ...product2Values]);

      // Insert favorites for user1 and user2
      const favorite1Values = [uuid.v4(), user1Values[0], product1Values[0]];
      const favorite2Values = [uuid.v4(), user2Values[0], product2Values[0]];

      const favoritesSQL = `
        INSERT INTO favorites (id, user_id, product_id)
        VALUES ($1, $2, $3), ($4, $5, $6)
      `;
      await client.query(favoritesSQL, [
        ...favorite1Values,
        ...favorite2Values,
      ]);

      console.log("Seed data inserted successfully.");
    } else {
      console.log(
        "Users 'user1' and 'user2' already exist, skipping seed data insertion."
      );
    }
  } catch (err) {
    console.error("Error seeding data: ", err);
  }
};

const init = async () => {
  try {
    await client.connect(); // Connect the client once

    await createTables(); // Wait for tables to be created
    await seedData(); // Then seed the data
  } catch (err) {
    console.error("Error initializing database: ", err);
  }
};

init();

module.exports = client;
