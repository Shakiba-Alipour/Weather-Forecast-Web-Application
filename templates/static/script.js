//about popup management
document
  .getElementById("open-about-popup")
  .addEventListener("click", function () {
    document.getElementById("about-popup").style.display = "block";
  });

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("about-popup").style.display = "none";
});

//search management
document.getElementById("search-icon").addEventListener("click", function () {
  //get data from API
  var city_name = document.getElementById("search-input").value;
  var xhr = new XMLHttpRequest();
  var api_key = "6e10fbb861b606deeab532507ffcb0d7";
  var weather_url = "http://localhost:5500/weather?city=" + city_name;

  // xhr.open("GET", weather_url, true);
  // xhr.onload = function () {
  //   if (xhr.status === 200) {
  //     var response = JSON.parse(xhr.responseText);
  //     var temperature = response.main.temp;
  //     var description = response.weather[0].description;
  //   } else {
  //     alert("Error retrieving weather data.");
  //   }
  // };
  // xhr.send();
  // Make the API request to your Python server
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error retrieving weather data.");
      }
    })
    .then(function (data) {
      var temperature = data["temperature"];
      var description = data["description"];
    })
    .catch(function (error) {
      alert(error.message);
    });
  // $.ajax({
  //   url: "/weather_forcast",
  //   data: { city_name: city_name },
  //   dataType: "json",
  //   success: function (response) {
  //     console.log(response); // Log the response to the console
  //     //change color of search bar
  //     var search_bar = document.getElementById("search-bar");
  //     search_bar.style.color = "white";
  //     //change position of search bar
  //     var header = document.getElementById("header");
  //     header.appendChild(search_bar);
  //   },
  //   error: function (error) {
  //     console.error("Error:", error);
  //     // Handle the error and display an error message
  //   },
  // });
});

// class Weather {
//   constructor(
//     city_name,
//     country_name,
//     longitude,
//     latitude,
//     temperature,
//     min_temperature,
//     max_temperature,
//     humidity,
//     wind_speed,
//     main_weather_condition,
//     description,
//     air_pollution,
//     icon_id
//   ) {
//     this.city_name = city_name;
//     this.country_name = country_name;
//     this.longitude = longitude;
//     this.latitude = latitude;
//     this.temperature = temperature;
//     this.min_temperature = min_temperature;
//     this.max_temperature = max_temperature;
//     this.humidity = humidity;
//     this.wind_speed = wind_speed;
//     this.main_weather_condition = main_weather_condition;
//     this.description = description;
//     this.air_pollution = air_pollution;
//     this.icon_id = icon_id;
//   }
// }

// function getWeatherData(city_name) {
//   // var city_name = document.getElementById("city_name").value;
//   var xhr = new XMLHttpRequest();
//   var api_key = "6e10fbb861b606deeab532507ffcb0d7";
//   var weather_url =
//     "http://api.openweathermap.org/data/2.5/weather?appid=" +
//     api_key +
//     "&q=" +
//     city_name;

//   //   fetch(weather_url)
//   //     .then(function (response) {
//   //       return response.json();
//   //     })
//   //     .then(function (data) {
//   //       var weather = new Weather(
//   //         data.name,
//   //         data.sys.country,
//   //         data.coord.lon,
//   //         data.coord.lat,
//   //         data.main.temp,
//   //         data.main.temp_min,
//   //         data.main.temp_max,
//   //         data.main.humidity,
//   //         data.wind.speed,
//   //         data.weather[0].main,
//   //         data.weather[0].description,
//   //         data.air_pollution,
//   //         data.weather[0].id
//   //       );

//   //       displayWeatherData(weather);
//   //     })
//   //     .catch(function (error) {
//   //       console.error("Error:", error);
//   //       document.getElementById("weatherData").innerHTML =
//   //         "An error occurred while fetching weather data.";
//   //     });
//   // }

//   // function displayWeatherData(weather) {
//   //   var html = "<h2>Weather in " + weather.city_name + "</h2>";
//   //   html += "<p>Temperature: " + (weather.temperature - 273.15) + "°C</p>";
//   //   html += "<p>Humidity: " + weather.humidity + "%</p>";
//   //   html += "<p>Description: " + weather.description + "</p>";
//   //   document.getElementById("weatherData").innerHTML = html;

//   xhr.open("GET", weather_url, true);
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       var response = JSON.parse(xhr.responseText);
//       var temperature = response.main.temp;
//       var description = response.weather[0].description;
//     } else {
//       alert("Error retrieving weather data.");
//     }
//   };
//   xhr.send();
// }
