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
  .addEventListener("click", async function (event) {
    event.preventDefault();
    var city_name = document.getElementById("search-input").value;
    await fetch("http://127.0.0.1:3000/weather?city_name=" + city_name)
      .then((response) => response.json())
      .then((data) => {
        // change the location of the search bar
        const form = document.querySelector("form");
        const header = document.getElementById("header");
        form.reset();
        header.appendChild(form);
        header.style.justifyContent = "space-between";
        document.getElementById("search-bar").style.backgroundColor = "white";
        document.getElementById("search-input").style.backgroundColor = "white";
        document.getElementById("search-icon").style.backgroundColor = "white";

        // display today weather information
        document.getElementById("weather-icon").src =
          "http://openweathermap.org/img/wn/" + data.icon_id + ".png";
        document.getElementById("condition").innerHTML = data.description;
        document.getElementById("temp").innerHTML =
          data.temperature + " \u00B0" + "C";
        document.getElementById("feels-like").innerHTML =
          "Feels like " + data.feels_like + " \u00B0" + "C";
        document.getElementById("city").innerHTML = data.city_name;
        document.getElementById("country").innerHTML = data.country_name;
        document.getElementById("min-temp").innerHTML =
          data.min_temperature + " \u00B0" + "C";
        document.getElementById("min-temp").style.color = "blue";
        document.getElementById("max-temp").innerHTML =
          data.max_temperature + " \u00B0" + "C";
        document.getElementById("max-temp").style.color = "red";
        document.getElementById("wind-speed").innerHTML =
          data.wind_speed + " m/s";
        document.getElementById("humidity").innerHTML = data.humidity + "%";
        document.getElementById("air-pollution").innerHTML = data.air_pollution;

        // draw a chart to display hourly forecast for today
        google.charts.load("current", { packages: ["corechart"] });
        google.setOnLoadCallback(() =>
          draw_chart(data.today_total_forecast, "today-forecast-hourly")
        );

        // const weatherInfo = document.getElementById("weather-info");
        // const cityElement = document.getElementById("city");
        // const temperatureElement = document.getElementById("temperature");
        // const descriptionElement = document.getElementById("description");

        // cityElement.textContent = data.city;
        // temperatureElement.textContent = data.temperature + " °C";
        // descriptionElement.textContent = data.description;

        // document.getElementsByClassName("forecast-result").style.display =
        //   "block";
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

function draw_chart(input, container_id) {
  // Create a DataTable
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Hour");
  dataTable.addColumn("number", "Min Temperature");
  dataTable.addColumn("number", "Max Temperature");

  // Convert the Map data from Today_forecast to an array of arrays
  const data = input.today.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  dataTable.addRows(data);

  // Set chart options
  const options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById(container_id)
  );

  chart.draw(dataTable, options);
}
