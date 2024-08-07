const router = require("express").Router();
const { createUser, fetchUsers } = require("../controllers/userController");
const {
  fetchFavorites,
  createFavorite,
  destroyFavorite,
} = require("../controllers/favoritesController");

router.get("/api/users", fetchUsers);
router.post("/api/users", createUser);

router.get("/api/users/:id/favorites", fetchFavorites);
router.post("/api/users/:id/favorites", createFavorite);
router.delete("/api/users/:id/favorites/:id", destroyFavorite);

module.exports = router;
