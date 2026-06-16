// Author: Pranathi
// This file handles all the incoming API routes for tracking dashboard logs

const express = require("express");
const router = express.Router();
const pool = require("../db"); // Importing our database connector pool

// --- ROUTE 1: GET ALL LOGS ---
// This endpoint is called by our React frontend to display rows in the table
router.get("/all", function (req, res) {
  const sqlQuery = "SELECT * FROM api_logs ORDER BY id DESC;";

  pool.query(sqlQuery, function (err, result) {
    if (err) {
      console.log("Error running select query: " + err.message);
      res.status(500).json({ error: "Failed to fetch logs from database" });
    } else {
      res.json(result.rows); // Sending the database rows directly back to React
    }
  });
});

// --- ROUTE 2: POST A NEW LOG ---
// This endpoint simulates an app logging a web request into our tracking system
router.post("/create", function (req, res) {
  // Extracting parameters sent in the body request
  const endpoint = req.body.endpoint;
  const method = req.body.method;
  const status_code = req.body.status_code;
  const response_time = req.body.response_time;
  const error_message = req.body.error_message || null; // Fallback to null if no error

  const sqlQuery = `
    INSERT INTO api_logs (endpoint, method, status_code, response_time, error_message)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [endpoint, method, status_code, response_time, error_message];

  pool.query(sqlQuery, values, function (err, result) {
    if (err) {
      console.log("Error running insert query: " + err.message);
      res.status(500).json({ error: "Failed to save log to database" });
    } else {
      res
        .status(201)
        .json({ message: "Log saved successfully!", data: result.rows[0] });
    }
  });
});

// --- ROUTE 3: GET ONLY FAILED REQUESTS ---
// This helps filter and show only the critical errors on the dashboard
router.get("/errors", function (req, res) {
  const sqlQuery = `
    SELECT * FROM api_logs 
    WHERE status_code >= 400 
    ORDER BY id DESC;
  `;

  pool.query(sqlQuery, function (err, result) {
    if (err) {
      console.log("Error fetching error logs: " + err.message);
      res.status(500).json({ error: "Failed to fetch error logs" });
    } else {
      res.json(result.rows);
    }
  });
});

// --- ROUTE 4: GET SUMMARY STATS ---
// This gives us the numbers shown in the top cards of our dashboard
router.get("/stats", function (req, res) {
  const sqlQuery = `
    SELECT 
      COUNT(*) AS total_requests,
      COUNT(CASE WHEN status_code < 400 THEN 1 END) AS successful_requests,
      COUNT(CASE WHEN status_code >= 400 THEN 1 END) AS failed_requests,
      ROUND(AVG(response_time)) AS avg_response_time
    FROM api_logs;
  `;

  pool.query(sqlQuery, function (err, result) {
    if (err) {
      console.log("Error fetching stats: " + err.message);
      res.status(500).json({ error: "Failed to fetch stats" });
    } else {
      res.json(result.rows[0]);
    }
  });
});

module.exports = router;
