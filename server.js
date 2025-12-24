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

// --------------------------------------
// API 1: Get appointments by plate
// --------------------------------------
app.get("/vehicle/appointments", (req, res) => {
  const { plate } = req.query;

  // Step 1: Validate input
  if (!plate) {
    return res.status(400).json({
      code: "PLATE_REQUIRED",
      message: "Vehicle plate number is required"
    });
  }

  // Step 2: Filter appointments
  const results = APPOINTMENTS.filter(
    appointment => appointment.plate === plate
  );

  // Step 3: Return response
  res.json({
    plate,
    count: results.length,
    appointments: results
  });
});


// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle API running on port ${PORT}`);
});
