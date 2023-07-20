import express from "express";
import { spawn } from "child_process";
const app = express();

// Allow cross-origin requests (if needed)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to fetch weather data from Python script
app.get("/static/weather_forcast", (req, res) => {
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
