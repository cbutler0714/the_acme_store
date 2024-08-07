const express = require("express");
const app = express();
const userRoutes = require("../src/routes/userRoutes");
const productsRoutes = require("../src/routes/productsRoutes");
app.use(express.json());
app.use(userRoutes);
app.use(productsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
