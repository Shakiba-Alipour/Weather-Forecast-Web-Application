import requests
import json


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
    lon = data["coord"]["lon"]
    lat = data["coord"]["lat"]
    
    # Extract relevant weather data
    # Convert temperature from Kelvin to Celsius
    temperature = round(data["main"]["temp"] - 273.15, 2)
    min_temperatur = round(data["main"]["temp_min"] - 273.15, 2)
    max_temperatur = round(data["main"]["temp_max"] - 273.15, 2)
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]
    main_weather_condition = data["weather"][0]["main"]
    description = data["weather"][0]["description"]
    country = data["sys"]["country"]
    
    
    # Air pollution API
    air_pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(air_pollution_url)

    # Parse the JSON response
    data = json.loads(response.text)
    
    air_pollution = data["list"][0]["main"]["aqi"]      # Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor

