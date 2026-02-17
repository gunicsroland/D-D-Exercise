from models import ExerciseCategory


XP_LEVELS = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000,
}
MAX_LEVEL = 20

DAY_CATEGORY_MAP = {
    0: ExerciseCategory.Strength,       #Monday
    1: ExerciseCategory.Strength,       #Tuesday
    2: ExerciseCategory.Flexibility,    #Wednesday
    3: ExerciseCategory.Flexibility,    #Thursday
    4: ExerciseCategory.Core,           #Friday
    5: ExerciseCategory.Core,           #Saturday
    6: ExerciseCategory.Cardio          #Sunday
}