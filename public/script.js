// arrays to store next five days data
let today_data, day1_data, day2_data, day3_data, day4_data, day5_data;

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
        today_data = data.today_total_forecast.today;
        fetch_next_days_data(data.next_five_days.days);

        // draw a border for day1 button to show that the chart belongs to day 1
        document.getElementById("button_day1").style.borderColor = "black";

        var target_list = document.getElementsByClassName("forecast-result");
        if (target_list) {
          for (let i = 0; i < target_list.length; i++) {
            target_list[i].style.visibility = "visible";
          }
        }
        // Load the Visualization API and the piechart package.
        google.load("visualization", "1.0", { packages: ["corechart"] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.setOnLoadCallback(draw_charts);

        // diplay quiz section
        document.getElementById("quiz-section").style.visibility = "visible";

        // displayExerciseRecommendation(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

// display hourly chart related to each day when user clicks on each day
let user_selection = document.getElementsByClassName("date");
let chartIds = [
  "day1_chart",
  "day2_chart",
  "day3_chart",
  "day4_chart",
  "day5_chart",
];
for (let i = 0; i < user_selection.length; i++) {
  user_selection[i].addEventListener("click", async function () {
    for (let j = 0; j < chartIds.length; j++) {
      let chart = document.getElementById(chartIds[j]);
      let button = document.getElementById(`button_day${j + 1}`);

      if (i === j) {
        chart.style.display = "block";
        button.style.borderColor = "#403d39ff";
        button.style.borderStyle = "solid";
      } else {
        chart.style.display = "none";
        button.style.borderStyle = "none"; // Reset border color for other buttons
      }
    }
  });
}

// Draw charts for each day asynchronously to display min and max temperature
async function draw_charts() {
  try {
    await drawChartForDay(today_data, "today-forecast-hourly");
    await drawChartForDay(day1_data, "day1_chart");
    await drawChartForDay(day2_data, "day2_chart");
    await drawChartForDay(day3_data, "day3_chart");
    await drawChartForDay(day4_data, "day4_chart");
    await drawChartForDay(day5_data, "day5_chart");
  } catch (error) {
    console.error("An error occurred in drawing charts:", error);
  }
}

// Define a function to draw a chart for a specific day
async function drawChartForDay(hourlyData, chartContainerId) {
  // Create a DataTable for the chart
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Hour");
  dataTable.addColumn("number", "Min Temperature");
  dataTable.addColumn("number", "Max Temperature");

  // Convert the hourlyData to an array of arrays
  const dataArray = hourlyData.map(([hour, minTemp, maxTemp]) => [
    hour,
    minTemp,
    maxTemp,
  ]);

  // Add the data to the DataTable
  dataTable.addRows(dataArray);

  // Set chart options (you can customize this as needed)
  const options = {
    curveType: "function",
    legend: { position: "bottom" },
    vAxis: {
      title: "Temperature (°C)",
    },
  };

  // Create the chart and attach it to the specified container
  const chart = new google.visualization.LineChart(
    document.getElementById(chartContainerId)
  );
  // google.visualization.events.addListener(chart, "ready", () => {
  //   resolve();
  // });
  chart.draw(dataTable, options);
}

// display next five days forecast
function fetch_next_days_data(data) {
  let day_number = 0,
    ct = 0, // counts forecast's day number (1 to 5)
    j = 0;
  for (let i = 0; i < data.length; i = j) {
    let month = getMonth(data[i][0]);
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
function getMonth(number) {
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

// Quiz management
document.addEventListener("DOMContentLoaded", function () {
  const questionContainer = document.getElementById("question");
  const optionsContainer = document.getElementById("options");

  let questions = []; // JSON question bank
  let currentQuestionIndex = -1; // Initialize with -1 to load the first question
  let hasAnswered = false; // Track if the user has answered

  // Fetch the JSON question bank
  fetch("http://127.0.0.1:5500/databases/quiz.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      loadRandomQuestion();
    })
    .catch((error) => console.error("Error fetching question bank:", error));

  //load and display a random question
  function loadRandomQuestion() {
    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    const questionData = questions[currentQuestionIndex];
    questionContainer.textContent = questionData.question;

    optionsContainer.innerHTML = "";
    for (const option in questionData.options) {
      const label = document.createElement("label");
      label.classList.add("options-container");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "option";
      radio.value = option;

      const text = document.createElement("span");
      text.textContent = questionData.options[option];

      label.appendChild(radio);
      label.appendChild(text);

      optionsContainer.appendChild(label);
    }
  }

  // manage next question button
  const nextButton = document.getElementById("next-button");
  nextButton.addEventListener("click", function () {
    loadRandomQuestion();
    hasAnswered = false;
  });

  // show correct answer after user submits his choice
  optionsContainer.addEventListener("change", function () {
    if (!hasAnswered) {
      const selectedOption = document.querySelector(
        "input[name='option']:checked"
      );

      if (selectedOption) {
        const selectedValue = selectedOption.value;
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        if (selectedValue === correctAnswer) {
          selectedOption.parentNode.classList.add("correct-icon");
        } else {
          selectedOption.parentNode.classList.add("incorrect-icon");
          const correctOption = optionsContainer.querySelector(
            `input[value='${correctAnswer}']`
          );
          if (correctOption) {
            correctOption.parentNode.classList.add("correct-icon");
          }
        }

        hasAnswered = true;
      }
    }
  });
});

// Exercise Recommendation Section
async function displayExerciseRecommendation(weatherData) {
  fetch(
    "http://127.0.0.1:3000/exercise-recommendations?weatherData=" +
      encodeURIComponent(JSON.stringify(weatherData))
  )
    .then((response) => response.json())
    .then((data) => {
      // Handle the exercise recommendations (data) here
      console.log("Exercise Recommendations:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
