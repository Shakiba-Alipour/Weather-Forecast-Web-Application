/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const { spawn } = require("child_process");

// Initialize Express app
const express = require("express");
const app = express();

// Allow cross-origin requests (if needed)
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to fetch weather data from Python script
app.get("/weather", async (_req, res) => {
  try {
    const pythonProcess = spawn("python", ["weather_forecast.py"]);
    let weatherData = "";

    pythonProcess.stdout.on("data", (data) => {
      weatherData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      try {
        const parsedData = JSON.parse(weatherData);
        res.json(parsedData);
      } catch (error) {
        console.error("Error parsing weather data:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Export the Cloud Function
exports.weather = functions.https.onRequest(app);
