const router = require("express").Router();
const {
  createProduct,
  fetchProducts,
} = require("../controllers/productsController");

router.get("/api/products", fetchProducts);
router.post("/api/products", createProduct);

module.exports = router;
