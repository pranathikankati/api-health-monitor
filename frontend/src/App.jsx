// Author: Pranathi
// This file renders a beautiful, responsive API Monitoring Dashboard layout

import React, { useState, useEffect } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to pull fresh logs from our Node server
  function fetchLogs() {
    fetch("http://localhost:5000/api/logs/all", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setLogs(data);
        setErrorMessage(""); // Clear error if successful
      })
      .catch(function (error) {
        console.log("Error connecting to backend: " + error.message);
        setErrorMessage("Could not sync with the live database backend.");
      });
  }

  // Automatically load logs once when the webpage opens
  useEffect(function () {
    fetchLogs();

    // auto refresh every 5 seconds so dashboard stays live
    const interval = setInterval(function () {
      fetchLogs();
    }, 5000);

    return function () {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Live API Health Monitor</h1>
          <p style={styles.subtitle}>
            Logged-in Client Activity & System Exceptions
          </p>
        </div>
        <button onClick={fetchLogs} style={styles.refreshButton}>
          🔄 Refresh Grid
        </button>
      </header>

      {/* ERROR ANNOUNCEMENT IF BACKEND IS DOWN */}
      {errorMessage && <div style={styles.errorBanner}>⚠️ {errorMessage}</div>}

      {/* RESPONSIVE CARDS FOR QUICK STATS */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #2ecc71" }}>
          <h3>Total Requests</h3>
          <p style={styles.statNumber}>{logs.length}</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #e74c3c" }}>
          <h3>Critical Failures</h3>
          <p style={styles.statNumber}>
            {logs.filter((log) => log.status_code >= 400).length}
          </p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #3498db" }}>
          <h3>Success Rate</h3>
          <p style={styles.statNumber}>
            {logs.length === 0
              ? "0%"
              : Math.round(
                  (logs.filter((log) => log.status_code < 400).length /
                    logs.length) *
                    100,
                ) + "%"}
          </p>
        </div>
      </div>

      {/* SCROLLABLE RESPONSIVE TABLE CONTAINER */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Endpoint Path</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Speed (ms)</th>
              <th style={styles.th}>Server Message Summary</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyCell}>
                  No logs recorded yet. Run traffic generator script...
                </td>
              </tr>
            ) : (
              logs.map(function (log) {
                // Highlight row light red if status code is an error (400+)
                const isError = log.status_code >= 400;
                return (
                  <tr
                    key={log.id}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: isError ? "#fdf2f2" : "#ffffff",
                    }}
                  >
                    <td style={styles.td}>{log.id}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "bold",
                        color: log.method === "POST" ? "#9b59b6" : "#2980b9",
                      }}
                    >
                      {log.method}
                    </td>
                    <td style={{ ...styles.td, fontFamily: "monospace" }}>
                      {log.endpoint}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "bold",
                        color: isError ? "#e74c3c" : "#2ecc71",
                      }}
                    >
                      {log.status_code}
                    </td>
                    <td style={styles.td}>{log.response_time}ms</td>
                    <td
                      style={{
                        ...styles.td,
                        color: isError ? "#c0392b" : "#7f8c8d",
                      }}
                    >
                      {log.error_message || "Success"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STUDENT-LEVEL CLEAN CSS-IN-JS OBJECTS
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // Makes it stack nicely on mobile phones
    gap: "15px",
    marginBottom: "25px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  title: { margin: 0, color: "#2c3e50", fontSize: "24px" },
  subtitle: { margin: "5px 0 0 0", color: "#7f8c8d", fontSize: "14px" },
  refreshButton: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "0.2s",
  },
  errorBanner: {
    backgroundColor: "#fde8e8",
    color: "#e74c3c",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },
  statCard: {
    flex: "1 1 200px", // Responsive sizing: grows but scales down cleanly
    backgroundColor: "#ffffff",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "5px 0 0 0",
    color: "#2c3e50",
  },
  tableWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    overflowX: "auto", // Secret Sauce: Gives horizontal scrolling on small phone viewports!
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: "600px",
  },
  tableHeaderRow: {
    backgroundColor: "#f1f2f6",
    borderBottom: "2px solid #dcdde1",
  },
  th: {
    padding: "15px",
    color: "#2c3e50",
    fontWeight: "600",
    fontSize: "14px",
  },
  tableRow: { borderBottom: "1px solid #f1f2f6" },
  td: { padding: "15px", fontSize: "14px", color: "#333" },
  emptyCell: { padding: "30px", textAlign: "center", color: "#7f8c8d" },
};

export default App;
