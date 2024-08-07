const bcrypt = require("bcrypt");
const uuid = require("uuid");
const client = require("../../server/db");

const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const SQL = `
      INSERT INTO users (id, username, password)
      VALUES ($1, $2, $3)
    `;
    const userValues = [uuid.v4(), username, hashedPassword];
    const response = await client.query(SQL, userValues);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user: ", err);
    res.status(500).json({ error: "Error creating user" });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const SQL = `
        SELECT id, username FROM users
    `;
    const { rows } = await client.query(SQL);
    res.status(200).json(rows);
    console.log("Users fetched successfully", rows);
  } catch (err) {
    console.error("Error fetching users: ", err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

module.exports = {
  createUser,
  fetchUsers,
};
