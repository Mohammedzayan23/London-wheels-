require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create bookings table
async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(150) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      pickup VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      travel_date DATE NOT NULL,
      travel_time TIME NOT NULL,
      vehicle VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database table is ready.");
}

// Receive booking enquiries
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      name,
      email,
      pickup,
      destination,
      date,
      time,
      vehicle
    } = req.body;

    if (
      !name || !email || !pickup ||
      !destination || !date || !time || !vehicle
    ) {
      return res.status(400).json({
        message: "Please complete all booking fields."
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings
      (customer_name, customer_email, pickup, destination,
       travel_date, travel_time, vehicle)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [name, email, pickup, destination, date, time, vehicle]
    );

    res.status(201).json({
      message: "Your reservation enquiry has been received.",
      bookingId: result.rows[0].id
    });

  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({
      message: "Unable to save your enquiry. Please try again."
    });
  }
});

// Start server after database setup
setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`London Wheels server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  });

