// Author: Pranathi
// This is the main server file that starts our Node.js backend application

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // load .env first

const pool = require("./db");
const logsRouter = require("./routes/logs");

// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
// cors allows our React frontend (port 5173) to talk to this backend (port 5000)
app.use(cors());
// express.json() allows our server to read JSON data sent in request bodies
app.use(express.json());

// --- ROUTES ---
// Link all endpoints written in routes/logs.js under the path "/api/logs"
app.use("/api/logs", logsRouter);

// Simple test route to check if the backend server is alive
app.get("/test", function (req, res) {
  res.send("Backend server is working perfectly!");
});

// Start the server and listen on port 5000
app.listen(PORT, function () {
  console.log("Server is running smoothly on port " + PORT);
});
