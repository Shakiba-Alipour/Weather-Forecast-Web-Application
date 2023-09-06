import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import https from "https";
const app = express();
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
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

app.get("/make-db", (req, res) => {
  const dbPath = "databases/exercises";
  const db = new sqlite3.Database(dbPath, async (err) => {
    const query = `
      CREATE TABLE exercises (
          id INTEGER PRIMARY KEY,
          name TEXT,
          type TEXT,
          indoor INTEGER,
          outdoor INTEGER,
          air_quality_sensitivity TEXT,
          equipment_needed TEXT,
          difficulty_level TEXT
      );
    `;

    // Execute the SQL query and retrieve the recommendations
    const rows = await new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          console.log(rows);
          resolve(rows);
        }
      });
    });

    const query2 = `
      INSERT INTO exercises (
              name,
              type,
              indoor,
              outdoor,
              air_quality_sensitivity,
              equipment_needed,
              difficulty_level
          )
      VALUES (
              'Jogging',
              'Cardio',
              0,
              1,
              'Normal',
              'None',
              'Beginner'
          ),
          (
              'Yoga',
              'Stretching',
              1,
              1,
              'Low',
              'Mat',
              'Beginner'
          ),
          (
              'Cycling',
              'Cardio',
              0,
              1,
              'Normal',
              'Bicycle',
              'Intermediate'
          ),
          (
              'Weight Lifting',
              'Strength',
              1,
              0,
              'Low',
              'Weights',
              'Intermediate'
          ),
          (
              'Hiking',
              'Outdoor',
              0,
              1,
              'High',
              'None',
              'Intermediate'
          ),
          (
              'Swimming',
              'Cardio',
              1,
              0,
              'Normal',
              'Pool',
              'Intermediate'
          ),
          (
              'Martial Arts',
              'Cardio',
              1,
              1,
              'Low',
              'None',
              'Intermediate'
          ),
          (
              'Aerobics',
              'Cardio',
              1,
              1,
              'Low',
              'None',
              'Beginner'
          ),
          (
              'Bodyweight Workout',
              'Strength',
              1,
              1,
              'Normal',
              'None',
              'Intermediate'
          ),
          (
              'Barre',
              'Dance',
              1,
              1,
              'Low',
              'Ballet Barre',
              'Intermediate'
          ),
          (
              'Kayaking',
              'Outdoor',
              0,
              1,
              'Normal',
              'Kayak',
              'Intermediate'
          ),
          (
              'Tai Chi',
              'Relaxation',
              1,
              1,
              'Low',
              'None',
              'Beginner'
          ),
          (
              'Boxing',
              'Cardio',
              1,
              1,
              'Normal',
              'Boxing Gloves',
              'Intermediate'
          ),
          (
              'TRX Suspension',
              'Strength',
              1,
              1,
              'Normal',
              'TRX Straps',
              'Intermediate'
          ),
          (
              'Dance',
              'Dance',
              1,
              1,
              'Low',
              'None',
              'Beginner'
          ),
          (
              'Spinning',
              'Cardio',
              1,
              1,
              'Normal',
              'Spin Bike',
              'Intermediate'
          );
    `;

    // Execute the SQL query and retrieve the recommendations
    const rows2 = await new Promise((resolve, reject) => {
      db.all(query2, [], (err, rows2) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          console.log(rows2);
          resolve(rows2);
        }
      });
    });

    res.json(rows2);
  });
});

// exercise recommendation management
app.get("/exercise-recommendations", (req, res) => {
  const weatherDataString = req.query.weatherData;
  const weatherData = JSON.parse(weatherDataString);

  const dbPath = "databases/exercises";
  const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to the database");
    }

    let outdoor_possibility = 1;

    // Modify indoor ,outdoor and airQuality based on weatherData
    // temperature check
    if (weatherData.min_temperature < 4 || weatherData.max_temperature > 30) {
      outdoor_possibility = 0;
    }
    // humudity check
    if (weatherData.humidity < 30 || weatherData.humidity > 70) {
      outdoor_possibility = 0;
    }
    // wind speen check
    if (weatherData.wind_speed >= 10) {
      outdoor_possibility = 0;
    }
    // main weather condition check
    if (
      (weatherData.description.includes("rain") ||
        weatherData.description.includes("snow")) &&
      !weatherData.description.includes("light")
    ) {
      outdoor_possibility = 0;
    }

    // Modify airQuality based on weatherData or user preferences
    // Indoor exercises are always recommended (indoor = 1).
    // Outdoor exercises are recommended if they have an air quality sensitivity that is not 'High'.
    // This means outdoor exercises are recommended if their air quality sensitivity is 'Low' or 'Normal'.
    // Additionally, outdoor exercises are recommended if the weatherData.air_pollution is "Good" or "Fair".
    // Outdoor exercises are recommended if the outdoor possibility is set to 1, regardless of other conditions.

    const query = `
        SELECT DISTINCT name, type, equipment_needed, difficulty_level
        FROM exercises
        WHERE
            (
                outdoor = 1 AND (
                    air_quality_sensitivity != 'High'
                    OR '${weatherData.air_pollution}' IN ('Good', 'Fair')
                )
            )
            OR (${outdoor_possibility} = 1)
            OR indoor = 1
        `;

    // Execute the SQL query and retrieve the recommendations
    const rows = await new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Send the list of exercises as a JSON response
    res.json(rows);
  });
});
