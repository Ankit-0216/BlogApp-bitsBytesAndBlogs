const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");

const dotenv = require("dotenv");
dotenv.config();

const database = require("./config/database");
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running",
  });
});

PORT = process.env.PORT || 4000;

app.use("/api/v1/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
