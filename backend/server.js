// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const allRoutes = require('./routes/index');
const app = express();

// --- Middlewares ---

// ✅ UPDATED: This new CORS configuration allows both your local computer
// and your live Vercel frontend to connect to the backend.
const allowedOrigins = [
  'http://localhost:5173',
  'https://mess-easy.vercel.app' // Your live frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());


// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- API Routes ---
app.use('/api', allRoutes);

// ✅ ADDED: Export the app object for Vercel
module.exports = app;
