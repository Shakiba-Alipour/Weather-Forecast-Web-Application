// arrays to store next five days data
let today_data, day1_data, day2_data, day3_data, day4_data, day5_data;
// var day1_chart, day2_chart, day3_chart, day4_chart, day5_chart;

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
        document.getElementById("temp").innerHTML = data.temperature + " °C";
        document.getElementById("feels-like").innerHTML =
          "Feels like " + data.feels_like + " °C";
        document.getElementById("city").innerHTML = data.city_name;
        document.getElementById("country").innerHTML = data.country_name;
        document.getElementById("min-temp").innerHTML =
          data.min_temperature + " °C";
        document.getElementById("min-temp").style.color = "blue";
        document.getElementById("max-temp").innerHTML =
          data.max_temperature + " °C";
        document.getElementById("max-temp").style.color = "red";
        document.getElementById("wind-speed").innerHTML =
          data.wind_speed + " m/s";
        document.getElementById("humidity").innerHTML = data.humidity + "%";
        document.getElementById("air-pollution").innerHTML = data.air_pollution;

        // display today and next five days forecast
        today_data = data.today_total_forecast;
        dispaly_next_days(data.next_five_days.days);

        var target_list = document.getElementsByClassName("forecast-result");
        if (target_list) {
          for (let i = 0; i < target_list.length; i++) {
            target_list[i].style.visibility = "visible";
          }
        }
        // Load the Visualization API and the piechart package.
        google.load("visualization", "1.0", { packages: ["corechart"] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.setOnLoadCallback(draw_chart);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

// display hourly chart related to each day when user clickes on each day
let user_selection = document.getElementsByClassName("day_number");
for (var i = 0; i < user_selection.length; i++) {
  (function (index) {
    user_selection[index].addEventListener("click", async function () {
      let day_number = String(
        document.getElementsByClassName("day_number")[0].id
      ).charAt(3);
      switch (day_number) {
        case 1:
          draw_chart(day1_data, "next_days_chart");
          break;
        case 2:
          draw_chart(day2_data, "next_days_chart");
          break;
        case 3:
          draw_chart(day3_data, "next_days_chart");
          break;
        case 4:
          draw_chart(day4_data, "next_days_chart");
          break;
        case 5:
          draw_chart(day5_data, "next_days_chart");
          break;
      }
    });
  })(i);
}

// a method for drawing a chart to display min and max temperature
function draw_chart() {
  // today chart
  // Create a DataTable for today
  var today_dataTable = new google.visualization.DataTable();
  today_dataTable.addColumn("string", "Hour");
  today_dataTable.addColumn("number", "Min Temperature");
  today_dataTable.addColumn("number", "Max Temperature");

  // Convert the Map data from Today_forecast to an array of arrays
  const today_array = today_data.today.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  today_dataTable.addRows(today_array);

  // Set chart options
  const today_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var today_chart = new google.visualization.LineChart(
    document.getElementById("today-forecast-hourly")
  );

  today_chart.draw(today_dataTable, today_options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  // day1 chart
  // Create a DataTable for today
  var day1_dataTable = new google.visualization.DataTable();
  day1_dataTable.addColumn("string", "Hour");
  day1_dataTable.addColumn("number", "Min Temperature");
  day1_dataTable.addColumn("number", "Max Temperature");

  const day1_array = day1_data.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  day1_dataTable.addRows(day1_array);

  // Set chart options
  const day1_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var day1_chart = new google.visualization.LineChart(
    document.getElementById("day1_chart")
  );

  day1_chart.draw(day1_dataTable, day1_options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  // day2 chart
  // Create a DataTable for today
  var day2_dataTable = new google.visualization.DataTable();
  day2_dataTable.addColumn("string", "Hour");
  day2_dataTable.addColumn("number", "Min Temperature");
  day2_dataTable.addColumn("number", "Max Temperature");

  const day2_array = day2_data.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  day2_dataTable.addRows(day2_array);

  // Set chart options
  const day2_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var day2_chart = new google.visualization.LineChart(
    document.getElementById("day2_chart")
  );

  day2_chart.draw(day2_dataTable, day2_options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  // day3 chart
  // Create a DataTable for today
  var day3_dataTable = new google.visualization.DataTable();
  day3_dataTable.addColumn("string", "Hour");
  day3_dataTable.addColumn("number", "Min Temperature");
  day3_dataTable.addColumn("number", "Max Temperature");

  const day3_array = day3_data.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  day3_dataTable.addRows(day3_array);

  // Set chart options
  const day3_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var day3_chart = new google.visualization.LineChart(
    document.getElementById("day3_chart")
  );

  day3_chart.draw(day3_dataTable, day3_options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  // day4 chart
  // Create a DataTable for today
  var day4_dataTable = new google.visualization.DataTable();
  day4_dataTable.addColumn("string", "Hour");
  day4_dataTable.addColumn("number", "Min Temperature");
  day4_dataTable.addColumn("number", "Max Temperature");

  const day4_array = day4_data.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  day4_dataTable.addRows(day4_array);

  // Set chart options
  const day4_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var day4_chart = new google.visualization.LineChart(
    document.getElementById("day4_chart")
  );

  day4_chart.draw(day4_dataTable, day4_options);

  //////////////////////////////////////////////////////////////////////////////////////////////
  // day5 chart
  // Create a DataTable for today
  var day5_dataTable = new google.visualization.DataTable();
  day5_dataTable.addColumn("string", "Hour");
  day5_dataTable.addColumn("number", "Min Temperature");
  day5_dataTable.addColumn("number", "Max Temperature");

  const day5_array = day5_data.map(([hour, min_temp, max_temp]) => [
    hour,
    min_temp,
    max_temp,
  ]);

  // Add the data to the DataTable
  day5_dataTable.addRows(day5_array);

  // Set chart options
  const day5_options = {
    curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Hour", // Set the label for the horizontal axis
    // },
    vAxis: {
      title: "Temperature (°C)", // Set the label for the vertical axis
    },
  };

  var day5_chart = new google.visualization.LineChart(
    document.getElementById("day5_chart")
  );

  day5_chart.draw(day5_dataTable, day5_options);
}

// display next five days forecast
function dispaly_next_days(data) {
  let day_number = 0,
    ct = 0, // counts forecast's day number (1 to 5)
    j = 0;
  for (let i = 0; i < data.length; i = j) {
    let month = this.month(data[i][0]);
    let condition = data[i][6];
    let chart_data = [];
    ct++;
    day_number = data[i][1];
    for (; j < data.length && data[j][1] == day_number; j++) {
      chart_data.push([data[j][2], data[j][3], data[j][4]]);
    }

    // set date and conditions
    document.getElementById("day" + ct).innerHTML = month + " " + day_number;
    document.getElementById("condition" + ct).innerHTML = condition;

    switch (ct) {
      case 1:
        day1_data = chart_data;
        break;
      case 2:
        day2_data = chart_data;
        break;
      case 3:
        day3_data = chart_data;
        break;
      case 4:
        day4_data = chart_data;
        break;
      case 5:
        day5_data = chart_data;
        break;
    }
  }
}

// find month name
function month(number) {
  switch (number) {
    case "01":
      return "JAN";
    case "02":
      return "FEB";
    case "03":
      return "MAR";
    case "04":
      return "APR";
    case "05":
      return "MAY";
    case "06":
      return "JUN";
    case "07":
      return "JUL";
    case "08":
      return "AUG";
    case "09":
      return "SEP";
    case "10":
      return "OCT";
    case "11":
      return "NOV";
    case "12":
      return "DEC";
  }
}
