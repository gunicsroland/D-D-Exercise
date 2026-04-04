from src.models import ExerciseCategory

DAY_CATEGORY_MAP = {
    0: ExerciseCategory.Strength,  # Monday
    1: ExerciseCategory.Strength,  # Tuesday
    2: ExerciseCategory.Flexibility,  # Wednesday
    3: ExerciseCategory.Flexibility,  # Thursday
    4: ExerciseCategory.Core,  # Friday
    5: ExerciseCategory.Core,  # Saturday
    6: ExerciseCategory.Cardio,  # Sunday
}
