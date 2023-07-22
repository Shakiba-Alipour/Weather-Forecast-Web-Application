const https = require("https");
const fs = require("fs");
const express = require("express");
const { spawn } = require("child_process");
const app = express();
const path = require("path");

// Allow cross-origin requests (if needed)
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to fetch weather data from Python script
app.get("/weather", (_req, res) => {
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
});

const port = 5500;

// Configure the options for the HTTPS server
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "privatekey.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "certificate.pem")),
};

// Create the HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
