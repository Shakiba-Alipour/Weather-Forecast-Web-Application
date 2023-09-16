import pandas as pd

# Read the CSV file
df = pd.read_csv("databases/worldcities.csv")

# Extract the columns you need
cities_and_countries = df[["city_ascii", "country"]]

# Convert to JSON format
cities_and_countries_json = cities_and_countries.to_json(orient="records")

# Write the JSON data to a file
with open("databases/city.list.json", "w") as json_file:
    json_file.write(cities_and_countries_json)
