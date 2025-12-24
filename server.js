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

// --------------------------------------
// API 2: Book new appointment
// --------------------------------------
app.post("/vehicle/appointments", (req, res) => {
  const { plate, date, service } = req.body;

  // Step 1: Validate input
  if (!plate || !date || !service) {
    return res.status(400).json({
      code: "MISSING_FIELDS",
      message: "plate, date, and service are required"
    });
  }

  // Step 2: Create appointment object
  const appointment = {
    id: uuidv4(),
    plate,
    date,
    service,
    status: "BOOKED",
    technician: null,
    createdAt: new Date().toISOString()
  };

  // Step 3: Save appointment
  APPOINTMENTS.push(appointment);

  // Step 4: Return response
  res.status(201).json({
    code: "APPOINTMENT_BOOKED",
    appointment
  });
});


// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle API running on port ${PORT}`);
});
