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

// --------------------------------------
// API 3: Reschedule appointment
// --------------------------------------
app.put("/vehicle/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  // Step 1: Validate input
  if (!date) {
    return res.status(400).json({
      code: "DATE_REQUIRED",
      message: "New appointment date is required"
    });
  }

  // Step 2: Find appointment
  const appointment = APPOINTMENTS.find(
    a => a.id === id
  );

  if (!appointment) {
    return res.status(404).json({
      code: "APPOINTMENT_NOT_FOUND"
    });
  }

  // Step 3: Update date
  appointment.date = date;
  appointment.updatedAt = new Date().toISOString();

  // Step 4: Return updated record
  res.json({
    code: "APPOINTMENT_RESCHEDULED",
    appointment
  });
});

// --------------------------------------
// API 4: Cancel appointment
// --------------------------------------
app.delete("/vehicle/appointments/:id", (req, res) => {
  const { id } = req.params;

  // Step 1: Find appointment index
  const index = APPOINTMENTS.findIndex(
    a => a.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      code: "APPOINTMENT_NOT_FOUND"
    });
  }

  // Step 2: Remove appointment
  APPOINTMENTS.splice(index, 1);

  // Step 3: Return confirmation
  res.json({
    code: "APPOINTMENT_CANCELLED"
  });
});

// --------------------------------------
// API 5: Get vehicle / technician status
// --------------------------------------
app.get("/vehicle/status/:appointment_id", (req, res) => {
  const { appointment_id } = req.params;

  // Step 1: Find appointment
  const appointment = APPOINTMENTS.find(
    a => a.id === appointment_id
  );

  if (!appointment) {
    return res.status(404).json({
      code: "APPOINTMENT_NOT_FOUND"
    });
  }

  // Step 2: Return status
  res.json({
    appointment_id: appointment.id,
    plate: appointment.plate,
    status: appointment.status,
    technician: appointment.technician
      ? appointment.technician
      : "NOT_ASSIGNED"
  });
});

// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle API running on port ${PORT}`);
});
