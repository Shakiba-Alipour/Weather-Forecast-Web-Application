import express from "express";
import fetch from "node-fetch";
import cors from "cors";
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
    feels_like,
    today_total_forecast
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
    this.today_total_forecast = today_total_forecast;
  }
}

class Today_forecast {
  constructor() {
    this.today = [];
  }

  // add data for a day
  async push_day_data(hour, min_temp, max_temp) {
    this.today.push([hour, min_temp, max_temp]);
    return;
  }

  print() {
    for (let j = 0; j < temp.length; j++) {
      console.log("hour " + temp[j][0]);
      console.log("min " + temp[j][1]);
      console.log("max " + temp[j][2]);
    }
  }
}

// store all data for 4 days
class Five_days_forecast {
  constructor() {
    this.days = [];
  }

  contains(day) {
    // if the day already exists in the days array, its index would be returned
    for (let i = 0; i < this.days.length; i++) {
      if (day == this.days[1]) {
        return i;
      }
    }
    return -1;
  }

  // add data for a day
  async push_day_data(
    month_name,
    day_name,
    hour,
    min_temp,
    max_temp,
    main_weather_condition,
    description
  ) {
    this.days.push([
      month_name,
      day_name,
      hour,
      min_temp,
      max_temp,
      main_weather_condition,
      description,
    ]);
    return;
  }

  print() {
    for (let j = 0; j < day_info.length; j++) {
      console.log("month " + day_info[j][0]);
      console.log("day " + day_info[j][1]);
      console.log("hour " + day_info[j][2]);
      console.log("min " + day_info[j][3]);
      console.log("max " + day_info[j][4]);
      console.log("main " + day_info[j][5]);
      console.log("description " + day_info[j][6]);
    }
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
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOpts));

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
  let city_name = req.query.city_name.toString();
  city_name = city_name[0].toUpperCase() + city_name.slice(1);

  try {
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
      console.log("API request succeed");
    }

    // parse the JSON response from the API call and assigns it to the data variable
    const data = await response.json();

    // Extract relevant weather data
    // Convert temperature from Kelvin to Celsius
    const longitude = data.coord.lon;
    const latitude = data.coord.lat;
    const temperature = Math.round(data.main.temp - 273.15, 2);
    const min_temperature = Math.round(data.main.temp_min - 273.15, 2);
    const max_temperature = Math.round(data.main.temp_max - 273.15, 2);
    const humidity = data.main.humidity;
    const wind_speed = data.wind.speed;
    const main_weather_condition = data.weather[0].main;
    const description = data.weather[0].description;
    const country_name = data.sys.country;
    const icon_id = data.weather[0].icon;
    const feels_like = Math.round(data.main.feels_like - 273.15, 2);

    // Air pollution API
    const air_pollution_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
    const air_pollution_response = await fetch(air_pollution_url);
    const air_pollution_data = await air_pollution_response.json();
    let air_pollution;
    switch (air_pollution_data.list[0].main.aqi) {
      case 1:
        air_pollution = "Good";
        break;
      case 2:
        air_pollution = "Fair";
        break;
      case 3:
        air_pollution = "Moderate";
        break;
      case 4:
        air_pollution = "Poor";
        break;
      case 5:
        air_pollution = "Very Poor";
        break;
    }

    // Extract forecast for next 5 days (index 1 to 5)
    const forecast_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
    const forecast_response = await fetch(forecast_url);
    const forecast_data = await forecast_response.json();
    const forecast = new Five_days_forecast();
    const today_forecast = new Today_forecast();
    const current_day = new Date().getDate();
    for (let i = 0; i < forecast_data.list.length; i++) {
      let item = JSON.parse(JSON.stringify(forecast_data.list))[i];
      let date = item.dt_txt.split("-");
      let month = date[1];
      date = date[2].split(" ");
      let day = date[0];
      let time = item.dt_txt.split(":")[0].split(" ");
      let hour = time[1];
      let min_temp = Math.round(item.main.temp_min - 273.15, 2);
      let max_temp = Math.round(item.main.temp_max - 273.15, 2);
      // today forecast
      if (day == current_day) {
        today_forecast.push_day_data(hour, min_temp, max_temp);
      }
      // next five days forecast
      else {
        let main_weather_condition = item.weather[0].main;
        let description = item.weather[0].description;
        forecast.push_day_data(
          month,
          day,
          hour,
          min_temp,
          max_temp,
          main_weather_condition,
          description
        );
      }
    }

    // make a new object of the whole forecasting data
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
      feels_like,
      today_forecast
    );

    //  send the weather as the JSON response from Node.js server to the client making the request
    // res.send(weather);
    res.json(weather);
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
