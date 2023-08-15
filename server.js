import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import the cors module
import https from "https";
import fs from "fs";
const app = express();
const PORT = 3000;

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
    icon_id,
    feels_like
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
    this.feels_like = feels_like;
  }
}

// use SSL/TLS certificates
// const options = {
//   key: fs.readFileSync("key.pem"), // Private Key file
//   cert: fs.readFileSync("cert.pem"), // Certificate file
//   passphrase: "shakiba", // Passphrase used to encrypt the private key
// };

app.get("/", (req, res) => {
  res.send("Hello, Weather App (HTTPS)!");
});

// const server = https.createServer(options, app);

// Set up CORS to allow requests from your Glitch app's domain
// app.use(cors());
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
// app.use((req, res, next) => {
//   //allow access from every, elminate CORS
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.removeHeader("x-powered-by");
//   //set the allowed HTTP methods to be requested
//   res.setHeader("Access-Control-Allow-Methods", "POST");
//   //headers clients can use in their requests
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   //allow request to continue and be handled by routes
//   next();
// });

// Redirect HTTP requests to HTTPS
// app.use((req, res, next) => {
//   if (req.header("x-forwarded-proto") !== "https") {
//     res.redirect(`https://${req.header("host")}${req.url}`);
//   } else {
//     next();
//   }
// });

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static("public"));

app.get("/weather", async (req, res) => {
  // connect API
  const api_key = "6e10fbb861b606deeab532507ffcb0d7";
  const city_name = req.query.city_name;
  console.log("nodejs");

  try {
    console.log("in try block");
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`
    );

    // use a proxy server when app isn't running locally
    // const response = await fetch(
    //   `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`
    // );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    } else {
      console.log("successful fetching");
    }

    // parse the JSON response from the API call and assigns it to the data variable
    const data = await response.json();
    //  send the data object as the JSON response from your Node.js server to the client making the request
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
    const feels_like = data.main.feels_like;

    console.log(latitude);
    console.log(longitude);
    console.log(temperature);
    console.log(min_temperature);
    console.log(max_temperature);
    console.log(humidity);
    console.log(wind_speed);
    console.log(main_weather_condition);
    console.log(description);
    console.log(country_name);
    console.log(icon_id);

    // Air pollution API
    const air_pollution_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
    const air_pollution_response = await fetch(air_pollution_url);
    const air_pollution_data = await air_pollution_response.json();
    const air_pollution = air_pollution_data.list[0].main.aqi; // Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor

    // Extract forecast for next 5 days (index 1 to 5)
    const forecast_url = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${api_key}`;
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
      icon_id,
      feels_like
    );

    console.log(
      city_name +
        "  " +
        country_name +
        "  " +
        longitude +
        "  " +
        latitude +
        "  " +
        temperature +
        "  " +
        min_temperature +
        "  " +
        max_temperature +
        "  " +
        humidity +
        "  " +
        wind_speed +
        "  " +
        main_weather_condition +
        "  " +
        description +
        "  " +
        air_pollution +
        "  " +
        forecast +
        "  " +
        icon_id
    );

    return res.json(weather); // Send the weather data as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// HTTP
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// HTTPS
// server.listen(PORT, () => {
//   console.log("Server is running (HTTPS)");
// });
