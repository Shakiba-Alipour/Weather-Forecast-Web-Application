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
  var city_name = document.getElementById("search-input").value;
  // Fetch weather data from the server
  fetch(`https://localhost:5500/weather?city=${encodeURIComponent(city_name)}`)
    .then((response) => response.json())
    .then((data) => {
      // const weatherInfo = document.getElementById('weather-info');
      // const cityElement = document.getElementById('city');
      // const temperatureElement = document.getElementById('temperature');
      // const descriptionElement = document.getElementById('description');

      // cityElement.textContent = data.city;
      // temperatureElement.textContent = data.temperature + ' °C';
      // descriptionElement.textContent = data.description;

      // weatherInfo.style.display = 'block';
      document.getElementById("open-about-popup").click;
    })
    .catch((error) => {
      alert("Failed to fetch weather data.");
    });
});
