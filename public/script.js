// arrays to store next five days data
let today_hourly_data,
  day1_hourly_data,
  day2_hourly_data,
  day3_hourly_data,
  day4_hourly_data,
  day5_hourly_data;

// chart instances
let today_instance,
  day1_instance,
  day2_instance,
  day3_instance,
  day4_instance,
  day5_instance;

// temperature unit
let temp_unit = "C";

// load cityList element (for the search bar)
const cityList = document.getElementById("cityList");

// extract city names from json file and store in an array for search suggestion
let cities = [];
fetch("../databases/city.list.json")
  .then((response) => response.json())
  .then((data) => {
    cities = data
      .filter((city) => city.name)
      .map((city) => {
        const cityName = city.name.toLowerCase();
        const countryCode = city.country;

        // Find the full country name
        let countryName = countryCode;
        if (countryCode === "IR") {
          countryName = "Iran";
        } else {
          const fullCountryName = new Intl.DisplayNames(["en"], {
            type: "region",
          }).of(countryCode);
          if (fullCountryName) {
            countryName = fullCountryName;
          }
        }

        return [cityName, countryName];
      });
  })
  .catch((error) => {
    console.error("Error loading city names:", error);
  });

// about popup management
document
  .getElementById("open-about-popup")
  .addEventListener("click", function () {
    document.getElementById("about-popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  });

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("about-popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// search suggestion management
let cityInput = document.getElementById("search-input");
cityInput.addEventListener("input", () => {
  const searchTerm = cityInput.value.toLowerCase(); // Convert user input to lowercase.

  // Clear previous suggestions when the input is empty
  if (!searchTerm) {
    cityList.innerHTML = "";
    cityList.style.display = "none";
    return;
  }

  if (searchTerm) {
    cityList.style.display = "flex";
    cityList.style.flexDirection = "column";
    const matchingCities = cities.filter((cityEntry) =>
      cityEntry[0].includes(searchTerm)
    );

    // Clear previous suggestions.
    cityList.innerHTML = "";

    // Display the matching city suggestions.
    matchingCities.forEach((cityEntry, index) => {
      if (cityList.getElementsByTagName("li").length < 5) {
        const li = document.createElement("li");
        const city_name = document.createElement("p");
        city_name.classList.add("city");
        city_name.textContent = cityEntry[0] + ", " + cityEntry[1]; // Access city and country using cityEntry[0] and cityEntry[1]
        li.appendChild(city_name);
        li.addEventListener("click", () => {
          // When a city is selected from the list, populate the input field.
          cityInput.value = cityEntry[0];
          // Fetch weather data for the selected city using the OpenWeatherMap API.
          document.querySelector("#search-icon").click();
          // Clear previous suggestions when the input is empty
          cityList.innerHTML = "";
          cityList.style.display = "none";
        });
        cityList.appendChild(li);
      }
    });
  }
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
        // display temperature unit switch
        document.getElementById("unit-switch").style.visibility = "visible";

        // change the location of the search bar
        const form = document.querySelector("form");
        const header = document.getElementById("header");
        form.reset();
        header.prepend(form);
        header.style.justifyContent = "space-between";
        document.getElementById("search-bar").style.top = "50%";
        document.getElementById("search-bar").style.left = "25%";
        document.getElementById("search-bar").style.backgroundColor =
          "#fffcf2ff";
        document.getElementById("search-input").style.backgroundColor =
          "#fffcf2ff";
        document.getElementById("search-icon").style.backgroundColor =
          "#fffcf2ff";

        // display today weather information
        document.getElementById("weather-icon").src =
          "http://openweathermap.org/img/wn/" + data.icon_id + ".png";
        document.getElementById("condition").innerHTML = data.description;
        document.getElementById("temp").innerHTML =
          data.temperature + " °" + temp_unit;
        document.getElementById("feels-like").innerHTML =
          "Feels like " + data.feels_like + " °" + temp_unit;
        document.getElementById("city").innerHTML = data.city_name;
        document.getElementById("country").innerHTML = data.country_name;
        document.getElementById("favorite-checker").innerHTML = "star";
        document.getElementById("favorite-checker").style.fill = "blue";
        document.getElementById("wind-speed").innerHTML =
          data.wind_speed + " m/s";
        document.getElementById("humidity").innerHTML = data.humidity + "%";
        document.getElementById("air-pollution").innerHTML = data.air_pollution;

        // display today and next five days forecast
        today_hourly_data = data.today_total_forecast.today;
        fetch_next_days_data(data.next_five_days.days);

        var target_list = document.getElementsByClassName("forecast-result");
        if (target_list) {
          for (let i = 0; i < target_list.length; i++) {
            target_list[i].style.visibility = "visible";
          }
        }

        // set data for today's button
        document.getElementById("today-icon").src =
          "http://openweathermap.org/img/wn/" + data.icon_id + ".png";
        document.getElementById("day0").innerHTML = "Today";
        document.getElementById("condition0").innerHTML = data.description;
        document.getElementById("humidity0").innerHTML = data.humidity + "%";
        document.getElementById("min-temp0").innerHTML =
          data.min_temperature + " °" + temp_unit;
        document.getElementById("max-temp0").innerHTML =
          data.max_temperature + " °" + temp_unit;

        // draw charts to display today and next five days temperature
        draw_charts();

        // diplay quiz section
        document.getElementById("quiz-section").style.visibility = "visible";

        displayExerciseRecommendation(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

// display hourly chart related to each day when user clicks on each day
let user_selection = document.getElementsByClassName("date");
let chartIds = [
  "today-forecast-hourly",
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

      if (i === j) {
        chart.style.display = "block";
        document.getElementById("div" + j).className = "active";
      } else {
        chart.style.display = "none";
        document.getElementById("div" + j).className = "deactive";
      }
    }
  });
}

// Draw charts for each day asynchronously to display min and max temperature
async function draw_charts() {
  try {
    today_instance = await drawChartForDay(
      today_hourly_data,
      "today-forecast-hourly"
    );
    day1_instance = await drawChartForDay(day1_hourly_data, "day1_chart");
    day2_instance = await drawChartForDay(day2_hourly_data, "day2_chart");
    day3_instance = await drawChartForDay(day3_hourly_data, "day3_chart");
    day4_instance = await drawChartForDay(day4_hourly_data, "day4_chart");
    day5_instance = await drawChartForDay(day5_hourly_data, "day5_chart");
  } catch (error) {
    console.error("An error occurred in drawing charts:", error);
  }
}

// Define a function to draw a chart for a specific day
async function drawChartForDay(hourlyData, chartContainerId) {
  const ctx = document.getElementById(chartContainerId).getContext("2d");

  // Convert the hourlyData to separate arrays for labels, minTemp, and maxTemp
  const labels = hourlyData.map(([hour, minTemp, maxTemp]) => hour);
  const minTempData = hourlyData.map(([hour, minTemp, maxTemp]) => minTemp);
  const maxTempData = hourlyData.map(([hour, minTemp, maxTemp]) => maxTemp);

  // Create the chart
  let instance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Min Temperature",
          data: minTempData,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Max Temperature",
          data: maxTempData,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Hour",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
        customCanvasBackgroundColor: {
          color: "#fffcf2ff",
        },
      },
    },
  });

  return instance;
}

// fetch next five days forecast
function fetch_next_days_data(data) {
  let day_number = 0,
    ct = 0, // counts forecast's day number (1 to 5)
    j = 0;
  for (let i = 0; i < data.length; i = j) {
    let month = getMonth(data[i][0]);
    let chart_data = [];
    ct++;
    day_number = data[i][1];

    // add the data that is for the current day
    for (; j < data.length && data[j][1] == day_number; j++) {
      chart_data.push([data[j][2], data[j][3], data[j][4]]);
    }

    // add hour 24 to the array
    if (data[j]) {
      chart_data.push([data[j][2], data[j][3], data[j][4]]);
    }

    // set date and conditions
    document.getElementById("day" + ct).innerHTML = month + " " + day_number;
    document.getElementById("day" + ct + "-min-temp").innerHTML =
      data[i][3] + " °" + temp_unit;
    document.getElementById("day" + ct + "-max-temp").innerHTML =
      data[i][4] + " °" + temp_unit;
    document.getElementById("humidity" + ct).innerHTML = data[i][5] + "%";
    document.getElementById("condition" + ct).innerHTML = data[i][6];
    document.getElementById("day" + ct + "-icon").src =
      "http://openweathermap.org/img/wn/" + data[i][8] + ".png";

    switch (ct) {
      case 1:
        day1_hourly_data = chart_data;
        break;
      case 2:
        day2_hourly_data = chart_data;
        break;
      case 3:
        day3_hourly_data = chart_data;
        break;
      case 4:
        day4_hourly_data = chart_data;
        break;
      case 5:
        day5_hourly_data = chart_data;
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
    for (const optionValue in questionData.options) {
      const optionText = questionData.options[optionValue];

      // Create a button for each option
      const button = document.createElement("button");
      button.classList.add("quiz-option");
      button.textContent = optionText;
      button.setAttribute("data-value", optionValue);

      // Add a click event listener to handle option selection
      button.addEventListener("click", handleOptionClick);

      optionsContainer.appendChild(button);

      hasAnswered = false;
    }
  }

  // show correct answer after user submits his choice
  // Handle button click when an option is selected
  function handleOptionClick(event) {
    if (!hasAnswered) {
      const selectedValue = event.target.getAttribute("data-value");
      const correctAnswer = questions[currentQuestionIndex].correctAnswer;

      if (selectedValue === correctAnswer) {
        event.target.style.backgroundColor = "green";
        event.target.style.borderColor = "green";
      } else {
        event.target.style.backgroundColor = "palevioletred";
        event.target.style.borderColor = "palevioletred";
        const correctOption = optionsContainer.querySelector(
          `button[data-value='${correctAnswer}']`
        );
        if (correctOption) {
          correctOption.style.backgroundColor = "green";
          correctOption.style.borderColor = "green";
        }
      }

      hasAnswered = true;

      // Load another random question 4 seconds after the user responses the quiz
      setTimeout(loadRandomQuestion, 4000);
    }
  }
});

// Exercise Recommendation Section
async function displayExerciseRecommendation(weatherData) {
  fetch(
    "http://127.0.0.1:3000/exercise-recommendations?weatherData=" +
      encodeURIComponent(JSON.stringify(weatherData))
  )
    .then((response) => response.json())
    .then((data) => {
      const carousel = $(".exercise-carousel");

      // Clear existing slides before adding new ones
      carousel.owlCarousel("destroy");

      for (let i = 0; i < data.length; i++) {
        // Create a slide for each exercise
        const slideHTML = `
          <div class="exercise-slide">
            <h4>${data[i].name}</h4>
            <p>Equipment: ${data[i].equipment_needed}</p>
            <p>Difficulty: ${data[i].difficulty_level}</p>
          </div>
        `;

        // Add the new slide to the carousel
        carousel.append(slideHTML);
      }

      // Initialize Owl Carousel with desired settings
      carousel.owlCarousel({
        items: 3, // Number of items to display
        loop: false, // Infinite loop
        margin: 8, // Space between items
        autoplay: false, // Auto-play the carousel
        nav: true, // Show navigation buttons
        responsive: {
          0: {
            items: 1, // Number of items to display at a smaller screen size
          },
          768: {
            items: 3, // Number of items to display at a medium screen size
          },
          992: {
            items: 5, // Number of items to display at a larger screen size
          },
        },
      });

      // display exercise recommendation section
      document.getElementById("exercise-recommendation-div").style.visibility =
        "visible";
    })
    .catch((error) => {
      console.error("Error in fetching exercise recommendation data:", error);
    });
}

// celcius-farenheit switch management
document.getElementById("unitToggle").addEventListener("change", (e) => {
  if (temp_unit === "C") {
    // Switch is ON, use farenheit for all temperature-related data
    temp_unit = "F";

    document.getElementById("temp").innerHTML =
      (parseFloat(document.getElementById("temp").innerHTML) * 9) / 5 +
      32 +
      " °" +
      temp_unit;
    let feels_like = document.getElementById("feels-like").textContent;
    let feels_like_temp = feels_like.split(" ")[2];
    document.getElementById("feels-like").innerHTML =
      "Feels like " + ((feels_like_temp * 9) / 5 + 32) + " °" + temp_unit;
    document.getElementById("min-temp0").innerHTML =
      (parseFloat(document.getElementById("min-temp0").innerHTML) * 9) / 5 +
      32 +
      " °" +
      temp_unit;
    document.getElementById("max-temp0").innerHTML =
      (parseFloat(document.getElementById("max-temp0").innerHTML) * 9) / 5 +
      32 +
      " °" +
      temp_unit;

    // change the data which is related to the charts
    // store min and max temps
    let new_min = [],
      new_max = [];
    for (let i = 0; i < today_hourly_data.length; i++) {
      today_hourly_data[i][1] = (today_hourly_data[i][1] * 9) / 5 + 32;
      new_min.push(today_hourly_data[i][1]);
      today_hourly_data[i][2] = (today_hourly_data[i][2] * 9) / 5 + 32;
      new_max.push(today_hourly_data[i][2]);
    }

    // update chart's data
    today_instance.data.datasets[0].data = new_min;
    today_instance.data.datasets[1].data = new_max;
    today_instance.update();

    for (let j = 1; j < 6; j++) {
      let array;
      switch (j) {
        case 1:
          array = day1_hourly_data;
          break;
        case 2:
          array = day2_hourly_data;
          break;
        case 3:
          array = day3_hourly_data;
          break;
        case 4:
          array = day4_hourly_data;
          break;
        case 5:
          array = day5_hourly_data;
          break;
      }

      // store min and max temps
      let new_min = [],
        new_max = [];
      for (let i = 0; i < array.length; i++) {
        array[i][1] = (array[i][1] * 9) / 5 + 32;
        new_min.push(array[i][1]);
        array[i][2] = (array[i][2] * 9) / 5 + 32;
        new_max.push(array[i][2]);
      }

      switch (j) {
        case 1:
          day1_hourly_data = array;
          // update chart's data
          day1_instance.data.datasets[0].data = new_min;
          day1_instance.data.datasets[1].data = new_max;
          day1_instance.update();
          break;
        case 2:
          day2_hourly_data = array;
          // update chart's data
          day2_instance.data.datasets[0].data = new_min;
          day2_instance.data.datasets[1].data = new_max;
          day2_instance.update();
          break;
        case 3:
          day3_hourly_data = array;
          // update chart's data
          day3_instance.data.datasets[0].data = new_min;
          day3_instance.data.datasets[1].data = new_max;
          day3_instance.update();
          break;
        case 4:
          day4_hourly_data = array;
          // update chart's data
          day4_instance.data.datasets[0].data = new_min;
          day4_instance.data.datasets[1].data = new_max;
          day4_instance.update();
          break;
        case 5:
          day5_hourly_data = array;
          // update chart's data
          day5_instance.data.datasets[0].data = new_min;
          day5_instance.data.datasets[1].data = new_max;
          day5_instance.update();
          break;
      }

      // update min and max temp for next days
      let min =
        (parseFloat(
          document.getElementById("day" + j + "-min-temp").innerHTML
        ) *
          9) /
          5 +
        32;
      document.getElementById("day" + j + "-min-temp").innerHTML =
        min + " °" + temp_unit;
      let max =
        (parseFloat(
          document.getElementById("day" + j + "-max-temp").innerHTML
        ) *
          9) /
          5 +
        32;
      document.getElementById("day" + j + "-max-temp").innerHTML =
        max + " °" + temp_unit;
    }
  } else {
    // Switch is OFF, use Celsius for all temperature-related data
    temp_unit = "C";

    document.getElementById("temp").innerHTML =
      ((parseFloat(document.getElementById("temp").innerHTML) - 32).toFixed(2) *
        5) /
        9 +
      " °" +
      temp_unit;
    let feels_like = document.getElementById("feels-like").textContent;
    let feels_like_temp = feels_like.split(" ")[2];
    let new_feels_like_temp = ((feels_like_temp - 32).toFixed(2) * 5) / 9;
    document.getElementById("feels-like").innerHTML =
      "Feels like " + new_feels_like_temp + " °" + temp_unit;
    document.getElementById("min-temp0").innerHTML =
      ((
        parseFloat(document.getElementById("min-temp0").innerHTML) - 32
      ).toFixed(2) *
        5) /
        9 +
      " °" +
      temp_unit;
    document.getElementById("max-temp0").innerHTML =
      ((
        parseFloat(document.getElementById("max-temp0").innerHTML) - 32
      ).toFixed(2) *
        5) /
        9 +
      " °" +
      temp_unit;

    // change the data which is related to the charts
    // store min and max temps
    let new_min = [],
      new_max = [];
    for (let i = 0; i < today_hourly_data.length; i++) {
      today_hourly_data[i][1] =
        ((today_hourly_data[i][1] - 32) * 5).toFixed(2) / 9;
      new_min.push(today_hourly_data[i][1]);
      today_hourly_data[i][2] =
        ((today_hourly_data[i][2] - 32) * 5).toFixed(2) / 9;
      new_max.push(today_hourly_data[i][2]);
    }

    // update chart's data
    today_instance.data.datasets[0].data = new_min;
    today_instance.data.datasets[1].data = new_max;
    today_instance.update();

    for (let j = 1; j < 6; j++) {
      let array;
      switch (j) {
        case 1:
          array = day1_hourly_data;
          break;
        case 2:
          array = day2_hourly_data;
          break;
        case 3:
          array = day3_hourly_data;
          break;
        case 4:
          array = day4_hourly_data;
          break;
        case 5:
          array = day5_hourly_data;
          break;
      }

      // store min and max temps
      let new_min = [],
        new_max = [];
      for (let i = 0; i < array.length; i++) {
        array[i][1] = ((array[i][1] - 32) * 5) / 9;
        new_min.push(array[i][1]);
        array[i][2] = ((array[i][2] - 32) * 5) / 9;
        new_max.push(array[i][2]);
      }

      switch (j) {
        case 1:
          day1_hourly_data = array;
          // update chart's data
          day1_instance.data.datasets[0].data = new_min;
          day1_instance.data.datasets[1].data = new_max;
          day1_instance.update();
          break;
        case 2:
          day2_hourly_data = array;
          // update chart's data
          day2_instance.data.datasets[0].data = new_min;
          day2_instance.data.datasets[1].data = new_max;
          day2_instance.update();
          break;
        case 3:
          day3_hourly_data = array;
          // update chart's data
          day3_instance.data.datasets[0].data = new_min;
          day3_instance.data.datasets[1].data = new_max;
          day3_instance.update();
          break;
        case 4:
          day4_hourly_data = array;
          // update chart's data
          day4_instance.data.datasets[0].data = new_min;
          day4_instance.data.datasets[1].data = new_max;
          day4_instance.update();
          break;
        case 5:
          day5_hourly_data = array;
          // update chart's data
          day5_instance.data.datasets[0].data = new_min;
          day5_instance.data.datasets[1].data = new_max;
          day5_instance.update();
          break;
      }

      // update min and max temp for next days
      let min =
        ((
          parseFloat(
            document.getElementById("day" + j + "-min-temp").innerHTML
          ) - 32
        ).toFixed(2) *
          5) /
        9;
      document.getElementById("day" + j + "-min-temp").innerHTML =
        min + " °" + temp_unit;
      let max =
        ((
          parseFloat(
            document.getElementById("day" + j + "-max-temp").innerHTML
          ) - 32
        ).toFixed(2) *
          5) /
        9;
      document.getElementById("day" + j + "-max-temp").innerHTML =
        max + " °" + temp_unit;
    }
  }
});
