import json
import logging
import os
from sqlalchemy.orm import Session

from database import get_db
from models import Exercise, ExerciseCategory, ExerciseDifficulty

def seed_exercises(db: Session):

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "exercises.json")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for ex in data:
            exists = db.query(Exercise).filter(Exercise.name == ex["name"]).first()
            if exists:
                logging.info(f"Skipping existing exercise: {ex['name']}")
                continue

            new_exercise = Exercise(
                name=ex["name"],
                category=ExerciseCategory(ex["category"]),
                difficulty=ExerciseDifficulty(ex["difficulty"]),
                quantity=ex.get("quantity", 1),
                xp_reward=ex["xp_reward"],
                media_url=ex.get("media_url"),
            )

            db.add(new_exercise)
            logging.info(f"Added exercise: {ex['name']}")

        db.commit()
        print("✅ Exercises seeded successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Error seeding exercises:", e)
        return "Error seeding exercises"

    finally:
        db.close()

    return "Success"