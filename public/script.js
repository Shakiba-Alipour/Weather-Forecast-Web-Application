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
document
  .getElementById("search-icon")
  .addEventListener("click", async function () {
    var city_name = document.getElementById("search-input").value;
    await fetch("http://127.0.0.1:3000/weather?city_name=" + city_name)
      .then((response) => response.json())
      .then((data) => {
        console.log("Weather data:", data);

        // change the location of the search bar
        const search_bar = document.getElementsByTagName("form");
        const header = document.getElementById("header");
        header.appendChild(search_bar);
        header.style.justifyContent = "space-between";
        search_bar.style.marginRight = 0;
        search_bar.style.background = "#fffcf2ff";

        // display today weather information
        document
          .getElementById("weather-icon")
          .setAttribute(
            "http://openweathermap.org/img/w/" + data.icon_id + ".png"
          );
        document
          .getElementById("condition")
          .setAttribute(data.main_weather_condition);
        document.getElementById("temp").setAttribute(data.temperature);
        document.getElementById("feels-like").setAttribute(data.feels_like);
        document.getElementById("city").setAttribute(data.city_name);
        document.getElementById("country").setAttribute(data.country_name);
        document.getElementById("min-temp").setAttribute(data.min_temperature);
        document.getElementById("max-temp").setAttribute(data.max_temperature);
        document.getElementById("wind-speed").setAttribute(data.wind_speed);
        document.getElementById("humidity").setAttribute(data.humidity);
        document
          .getElementById("air-pollution")
          .setAttribute(data.air_pollution);

        // draw a chart to display hourly forecast for today
        google.charts.load("current", { packages: ["corechart"] });
        google.setOnLoadCallback(draw_chart(data.today_forecast));

        // const weatherInfo = document.getElementById("weather-info");
        // const cityElement = document.getElementById("city");
        // const temperatureElement = document.getElementById("temperature");
        // const descriptionElement = document.getElementById("description");

        // cityElement.textContent = data.city;
        // temperatureElement.textContent = data.temperature + " °C";
        // descriptionElement.textContent = data.description;

        // weatherInfo.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

function draw_chart(input) {
  var data = google.visualization.arrayToDataTable(
    ["hour", "minimum temperature", "maximum temperature"],
    input
  );

  var options = {
    curveType: "function",
    legend: { position: "bottom" },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );

  chart.draw(data, options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  //   <script
  // src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
  // </script>

  // let hours,
  //   min_temps,
  //   max_temps = [];
  // let i = 0;
  // data.forEach((hour, temp) => {
  //   hours[i] = hour;
  //   min_temps[i] = temp[0];
  //   max_temps[i] = temp[1];
  //   i++;
  // });

  // new Chart("today", {
  //   type: "line",
  //   data: {
  //     labels: hours,
  //     datasets: [
  //       {
  //         data: min_temps,
  //         borderColor: "blue",
  //         fill: false,
  //       },
  //       {
  //         data: max_temps,
  //         borderColor: "red",
  //         fill: false,
  //       },
  //     ],
  //   },
  //   options: {
  //     legend: { display: false },
  //   },
  // });
}
