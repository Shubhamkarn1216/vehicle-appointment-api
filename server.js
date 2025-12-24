const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// -----------------------------
// IN-MEMORY DATABASE
// -----------------------------
const APPOINTMENTS = [];

// -----------------------------
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle API running on port ${PORT}`);
});
