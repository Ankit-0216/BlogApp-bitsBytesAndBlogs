const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const database = require("./config/database");
database.connect();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running",
  });
});

PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
