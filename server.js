import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import the cors module
const app = express();
const PORT = process.env.PORT || 3000;

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
    this.min_temperature = min_temperature;
    this.max_temperature = max_temperature;
    this.humidity = humidity;
    this.wind_speed = wind_speed;
    this.main_weather_condition = main_weather_condition;
    this.description = description;
    this.air_pollution = air_pollution; // Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    this.next_five_days = next_five_days;
    this.icon_id = icon_id;
  }
}

// Set up CORS to allow requests from your Glitch app's domain
app.use(cors());

// Redirect HTTP requests to HTTPS
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static("public"));

app.get("/weather", async (req, res) => {
  // connect API
  const api_key = "6e10fbb861b606deeab532507ffcb0d7";
  const city_name = req.query.city;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

    // Extract relevant weather data
    // Convert temperature from Kelvin to Celsius

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

    // Air pollution API
    const air_pollution_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
    const air_pollution_response = await fetch(air_pollution_url);
    const air_pollution_data = await air_pollution_response.json();
    const air_pollution = air_pollution_data.list[0].main.aqi; // Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor

    // Extract forecast for next 5 days (index 1 to 5)
    const forecast_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${api_key}`;
    const forecast_response = await fetch(forecast_url);
    const forecast_data = await forecast_response.json();
    const forecast = await forecast_data.daily.slice(1, 6).map((day) => {
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

    return res.json(weather); // Send the weather data as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
