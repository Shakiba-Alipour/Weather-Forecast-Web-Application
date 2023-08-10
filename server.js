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
  // Path to SSL certificate files
  key: fs.readFileSync(path.resolve(__dirname, "privatekey.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "certificate.pem")),
};

// Create the HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://127.0.0.1:${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////

const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors");

// Initialize Express app
const express = require("express");
const app = express();

app.use(cors());

class Weather {
  constructor(
    city_name,
    country_name,
    longitude,
    latitude,
    temperature,
    min_temperature,
    max_temperature,
    humidity,
    wind_speed,
    main_weather_condition,
    description,
    air_pollution,
    next_five_days,
    icon_id
  ) {
    this.city_name = city_name;
    this.country_name = country_name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.temperature = temperature;
    this.min_temperatur = min_temperatur;
    this.max_temperatur = max_temperatur;
    this.humidity = humidity;
    this.wind_speed = wind_speed;
    this.main_weather_condition = main_weather_condition;
    this.description = description;
    this.air_pollution = air_pollution; // Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    this.next_five_days = next_five_days;
    this.icon_id = icon_id;
  }
}

app.get("/weather", async (req, res) => {
  try {
    const apiKey = "6e10fbb861b606deeab532507ffcb0d7";
    const city = req.query.city_name;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}`
    );

    const data = await response.json();

    const longitude = data.coord.lon;
    const latitude = data.coord.lat;

    const temperature = round(data.main.temp - 273.15, 2);
    const min_temperature = round(data.main.temp_min - 273.15, 2);
    const max_temperature = round(data.main.temp_max - 273.15, 2);
    const humidity = data.main.humidity;
    const wind_speed = data.wind.speed;
    const main_weather_condition = data.weather[0].main;
    const description = data.weather[0].description;
    const country_name = data.sys.country;
    const icon_id = data.weather[0].id;

    const air_pollution_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
    const air_pollution_response = await fetch(air_pollution_url);
    const air_pollution_data = await air_pollution_response.json();

    const air_pollution = air_pollution_data.list[0].main.aqi;

    const forecast_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${api_key}`;
    const forecast_response = await fetch(forecast_url);
    const forecast_data = await forecast_response.json();

    const forecast = forecast_data.daily.slice(1, 6).map((day) => {
      return {
        date: day.dt,
        min_temp: day.temp.min,
        max_temp: day.temp.max,
      };
    });

    const weather = new Weather(
      city_name,
      country_name,
      longitude,
      latitude,
      temperature,
      min_temperature,
      max_temperature,
      humidity,
      wind_speed,
      main_weather_condition,
      description,
      air_pollution,
      forecast,
      icon_id
    );

    res.status(200).json(weather);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Export the Cloud Function
exports.weather = functions.https.onRequest(app);
