-- Create the exercises table
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY,
    name TEXT,
    type TEXT,
    indoor INTEGER,
    outdoor INTEGER,
    air_quality_sensitivity TEXT,
    equipment_needed TEXT,
    difficulty_level TEXT
);

-- Insert sample data
INSERT INTO exercises (
        name,
        type,
        indoor,
        outdoor,
        air_quality_sensitivity,
        equipment_needed,
        difficulty_level
    )
VALUES (
        'Jogging',
        'Cardio',
        0,
        1,
        'Normal',
        'None',
        'Beginner'
    ),
    (
        'Yoga',
        'Stretching',
        1,
        1,
        'Low',
        'Mat',
        'Beginner'
    ),
    (
        'Cycling',
        'Cardio',
        0,
        1,
        'Normal',
        'Bicycle',
        'Intermediate'
    ),
    (
        'Weight Lifting',
        'Strength',
        1,
        0,
        'Low',
        'Weights',
        'Intermediate'
    ),
    (
        'Hiking',
        'Outdoor',
        0,
        1,
        'High',
        'None',
        'Intermediate'
    ),
    (
        'Swimming',
        'Cardio',
        1,
        0,
        'Normal',
        'Pool',
        'Intermediate'
    ),
    (
        'Pilates',
        'Core',
        1,
        1,
        'Low',
        'Mat',
        'Intermediate'
    ),
    (
        'Treadmill',
        'Cardio',
        1,
        0,
        'Normal',
        'Treadmill',
        'Intermediate'
    ),
    (
        'Jump Rope',
        'Cardio',
        1,
        1,
        'Normal',
        'Jump Rope',
        'Intermediate'
    ),
    (
        'HIIT',
        'Cardio',
        1,
        1,
        'High',
        'None',
        'Advanced'
    ),
    (
        'Running Stairs',
        'Cardio',
        1,
        1,
        'High',
        'Stairs',
        'Advanced'
    ),
    (
        'CrossFit',
        'Strength',
        1,
        1,
        'High',
        'Various',
        'Advanced'
    ),
    (
        'Zumba',
        'Dance',
        1,
        1,
        'Low',
        'None',
        'Beginner'
    ),
    (
        'Rowing',
        'Cardio',
        1,
        0,
        'Normal',
        'Rowing Machine',
        'Intermediate'
    ),
    (
        'Rock Climbing',
        'Strength',
        1,
        1,
        'High',
        'Climbing Gear',
        'Advanced'
    ),
    (
        'Martial Arts',
        'Cardio',
        1,
        1,
        'Low',
        'None',
        'Intermediate'
    ),
    (
        'Aerobics',
        'Cardio',
        1,
        1,
        'Low',
        'None',
        'Beginner'
    ),
    (
        'Bodyweight Workout',
        'Strength',
        1,
        1,
        'Normal',
        'None',
        'Intermediate'
    ),
    (
        'Barre',
        'Dance',
        1,
        1,
        'Low',
        'Ballet Barre',
        'Intermediate'
    ),
    (
        'Kayaking',
        'Outdoor',
        0,
        1,
        'Normal',
        'Kayak',
        'Intermediate'
    ),
    (
        'Tai Chi',
        'Relaxation',
        1,
        1,
        'Low',
        'None',
        'Beginner'
    ),
    (
        'Boxing',
        'Cardio',
        1,
        1,
        'Normal',
        'Boxing Gloves',
        'Intermediate'
    ),
    (
        'TRX Suspension',
        'Strength',
        1,
        1,
        'Normal',
        'TRX Straps',
        'Intermediate'
    ),
    (
        'Dance',
        'Dance',
        1,
        1,
        'Low',
        'None',
        'Beginner'
    ),
    (
        'Spinning',
        'Cardio',
        1,
        1,
        'Normal',
        'Spin Bike',
        'Intermediate'
    ),
    (
        'Paddleboarding',
        'Outdoor',
        0,
        1,
        'Normal',
        'Paddleboard',
        'Beginner'
    ),
    (
        'Skiing',
        'Outdoor',
        0,
        1,
        'Normal',
        'Skis',
        'Intermediate'
    ),
    (
        'Calisthenics',
        'Strength',
        1,
        1,
        'Normal',
        'Pull-Up Bar',
        'Intermediate'
    ),
    (
        'Kickboxing',
        'Cardio',
        1,
        1,
        'Low',
        'None',
        'Intermediate'
    ),
    (
        'Surfing',
        'Outdoor',
        0,
        1,
        'Normal',
        'Surfboard',
        'Intermediate'
    ),
    (
        'Circuit Training',
        'Cardio',
        1,
        1,
        'High',
        'None',
        'Intermediate'
    ),
    (
        'Kettlebell',
        'Strength',
        1,
        1,
        'Normal',
        'Kettlebell',
        'Intermediate'
    ),
    (
        'Ballet',
        'Dance',
        1,
        1,
        'Low',
        'Ballet Barre',
        'Beginner'
    ),
    (
        'Powerlifting',
        'Strength',
        1,
        0,
        'Low',
        'Weights',
        'Advanced'
    ),
    (
        'Karate',
        'Martial Arts',
        1,
        1,
        'Low',
        'None',
        'Intermediate'
    ),
    (
        'Functional Training',
        'Strength',
        1,
        1,
        'Normal',
        'Various',
        'Intermediate'
    );