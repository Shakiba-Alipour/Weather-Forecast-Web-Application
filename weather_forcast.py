import requests
import json


# a function to get weather data from openweathermap.org
def get_weather_data(city_name):

    api_key = "6e10fbb861b606deeab532507ffcb0d7"

    # Base URL for the OpenWeatherMap API
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    # Complete URL
    complete_url = base_url + "appid=" + api_key + "&q=" + city_name

    # API call
    response = requests.get(complete_url)

    # Convert the JSON response to a Python dictionary
    data = json.loads(response.text)

    # Extract relevant weather data
    # Convert temperature from Kelvin to Celsius
    temperature = round(data["main"]["temp"] - 273.15, 2)
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]
    description = data["weather"][0]["description"]

    # # Print weather information
    # print("Temperature : {} degree Celsius".format(temperature))
    # print("Humidity : {}%".format(humidity))
    # print("Wind Speed : {} m/s".format(wind_speed))
    # print("Description : {}".format(description))
