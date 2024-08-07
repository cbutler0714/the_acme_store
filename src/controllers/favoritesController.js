const uuid = require("uuid");
const client = require("../../server/db");

const createFavorite = async (req, res) => {
  console.log("Request Body:", req.body);
  const { product_id: productId } = req.body;
  const { id: userId } = req.params;

  try {
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const favoriteId = uuid.v4();
    const SQL = `
      INSERT INTO favorites (id, user_id, product_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const favoriteValues = [favoriteId, userId, productId];
    const response = await client.query(SQL, favoriteValues);

    console.log("Favorite created successfully.");

    res.status(201).json(response.rows[0]);
  } catch (err) {
    console.error("Error creating favorite: ", err);
    res.status(500).json({ error: "Error creating favorite" });
  }
};

const fetchFavorites = async (req, res) => {
  try {
    const SQL = `
      SELECT id, user_id, product_id FROM favorites
    `;
    const { rows } = await client.query(SQL);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching favorites: ", err);
    res.status(500).json({ error: "Error fetching favorites" });
  }
};

const destroyFavorite = async (req, res) => {
  const { id } = req.params; // Change from favoriteId to id

  try {
    const SQL = `
      DELETE FROM favorites WHERE id = $1
    `;
    await client.query(SQL, [id]);

    console.log("Favorite deleted successfully.");

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (err) {
    console.error("Error deleting favorite: ", err);
    res.status(500).json({ error: "Error deleting favorite" });
  }
};

module.exports = {
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
