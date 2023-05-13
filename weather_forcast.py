import requests
import json
from flask import Flask, render_template, request


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

class Weather:
    
    def __init__(self, city_name, country_name, longitude, latitude, temperature, min_temperatur, max_temperatur,
                 humidity, wind_speed, main_weather_condition, description, air_pollution, icon_id):
        self.city_name = city_name
        self.country_name = country_name
        self.longitude = longitude
        self.latitude = latitude
        self.temperature = temperature
        self.min_temperatur = min_temperatur
        self.max_temperatur = max_temperatur
        self.humidity = humidity
        self.wind_speed = wind_speed
        self.main_weather_condition = main_weather_condition
        self.description = description
        self.air_pollution = air_pollution      # Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
        self.icon_id = icon_id



@app.route('/result', methods=['POST'])
# a function to get weather data from openweathermap.org
def get_weather_data(city_name):

    api_key = "6e10fbb861b606deeab532507ffcb0d7"

    # Base URL for the OpenWeatherMap API
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    # Weather API
    weather_url = base_url + "appid=" + api_key + "&q=" + city_name

    # API call
    response = requests.get(weather_url)

    # Convert the JSON response to a Python dictionary
    data = json.loads(response.text)
    
    # Get latitude and longitude
    longitude = data["coord"]["lon"]
    latitude = data["coord"]["lat"]
    
    # Extract relevant weather data
    # Convert temperature from Kelvin to Celsius
    temperature = round(data["main"]["temp"] - 273.15, 2)
    min_temperatur = round(data["main"]["temp_min"] - 273.15, 2)
    max_temperatur = round(data["main"]["temp_max"] - 273.15, 2)
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]
    main_weather_condition = data["weather"][0]["main"]
    description = data["weather"][0]["description"]
    country_name = data["sys"]["country"]
    icon_id = data["weather"][0]["id"]
    
    
    # Air pollution API
    air_pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid={api_key}"
    response = requests.get(air_pollution_url)

    # Parse the JSON response
    data = json.loads(response.text)
    
    air_pollution = data["list"][0]["main"]["aqi"]      # Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor

    weather = Weather(city_name, country_name, longitude, latitude, temperature, min_temperatur, max_temperatur,
                 humidity, wind_speed, main_weather_condition, description, air_pollution, icon_id)
    
    
    return weather
