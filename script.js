// weather class
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

// get weather data method
async function getWeatherData(city_name) {
  // connect API
  const apiKey = "6e10fbb861b606deeab532507ffcb0d7";
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city_name}`
  )
    .then((response) => {
      if (!response.ok) {
        alert(`API request failed with status ${response.status}`);
      }
      return response.json(); // Parse response as JSON
    })
    .then(async (data) => {
      alert("API response:", data);

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

      return weather;
    })
    .catch((error) => {
      alert("error: ", error);
    });
}

// about popup management
document
  .getElementById("open-about-popup")
  .addEventListener("click", function () {
    document.getElementById("about-popup").style.display = "block";
  });

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("about-popup").style.display = "none";
});

// search management
document.getElementById("search-icon").addEventListener("click", function () {
  var city_name = document.getElementById("search-input").value;
  getWeatherData(city_name)
    .then((data) => {
      alert("hello");
    })
    .catch((error) => {
      alert("fail in get weather");
    });

  // Fetch weather data from the server
  // var api_url =
  //   "https://127.0.0.1:5500/weather?city=" + encodeURIComponent(city_name);
  // fetch(api_url)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     alert("done");
  //     // change the location of the search bar
  //     const search_bar = document.getElementsByTagName("form");
  //     const header = document.getElementById("header");
  //     header.appendChild(search_bar);
  //     header.style.justifyContent = "space-between";
  //     search_bar.style.marginRight = 0;
  //     search_bar.style.background = "#fffcf2ff";
  //     // const weatherInfo = document.getElementById("weather-info");
  //     // const cityElement = document.getElementById("city");
  //     // const temperatureElement = document.getElementById("temperature");
  //     // const descriptionElement = document.getElementById("description");

  //     // cityElement.textContent = data.city;
  //     // temperatureElement.textContent = data.temperature + " °C";
  //     // descriptionElement.textContent = data.description;

  //     // weatherInfo.style.display = "block";
  //   })
  //   .catch((error) => {
  //     alert("Failed to fetch weather data: " + error.message);
  //   });
});
