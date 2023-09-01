const sqlite3 = require("sqlite3").verbose();

function getExerciseRecommendations(weatherData) {
  const dbPath = "./databases/exercises.sql";
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return console.error(err.message);
    }

    let outdoor_possibility = 1;

    // Modify indoor ,outdoor and airQuality based on weatherData
    // temperature check
    if (
      weatherData.min_temperature < 4 ||
      min_temperature.max_temperature > 30
    ) {
      outdoor_possibility = 0;
    }
    // humudity check
    if (weatherData.humidity < 30 || weatherData.humidity > 70) {
      outdoor_possibility = 0;
    }
    // wind speen check
    if (weatherData.wind_speed >= 10) {
      outdoor_possibility = 0;
    }
    // main weather condition check
    if (
      (weatherData.description.includes("rain") ||
        weatherData.description.includes("snow")) &&
      !weatherData.description.includes("light")
    ) {
      outdoor_possibility = 0;
    }

    // Modify airQuality based on weatherData or user preferences
    /*
    Indoor exercises are always recommended (indoor = 1).
    Outdoor exercises are recommended if they have an air quality sensitivity that is not 'High'.
    This means outdoor exercises are recommended if their air quality sensitivity is 'Low' or 'Normal'.
    Additionally, outdoor exercises are recommended if the weatherData.air_pollution is "Good" or "Fair".
    Outdoor exercises are recommended if the outdoor possibility is set to 1, regardless of other conditions.
    */
    const query = `
        SELECT DISTINCT name, type, equipment_needed, difficulty_level
        FROM exercises
        WHERE
            (
                outdoor = 1 AND (
                    air_quality_sensitivity != 'High'
                    OR weatherData.air_pollution IN ('Good', 'Fair')
                )
            )
            OR (${outdoor_possibility} = 1)
            OR indoor = 1
        `;

    // Execute the SQL query and retrieve the recommendations
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const recommendedExercises = rows.map((row) => row.name);
        resolve(recommendedExercises);
      }

      // Close the database connection
      db.close();
    });
  });
}

export default {
  getExerciseRecommendations,
};
