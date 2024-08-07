const uuid = require("uuid");
const client = require("../../server/db");

const createProduct = async (req, res) => {
  const { name } = req.body;

  try {
    const SQL = `
      INSERT INTO products(id, name)
      VALUES ($1, $2)
      RETURNING id, name
    `;
    const productValues = [uuid.v4(), name];
    const response = await client.query(SQL, productValues);

    console.log("Product created successfully.");

    res.status(201).json({
      message: "Product created successfully",
      product: response.rows[0],
    });
  } catch (err) {
    console.error("Error creating product: ", err);
    res.status(500).json({ error: "Error creating product" });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const SQL = `
      SELECT id, name FROM products
    `;
    const { rows } = await client.query(SQL);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching products: ", err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

module.exports = {
  createProduct,
  fetchProducts,
};
