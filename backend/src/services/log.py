from sqlalchemy.orm import Session
import logging

from src.models import WorkoutLog


def log_exercise_completion(
    char_id: int, exercise_id: int, xp_gained: int, quantity: int, db: Session
):
    log_entry = WorkoutLog(
        char_id=char_id, exercise_id=exercise_id, xp_gained=xp_gained, quantity=quantity
    )
    db.add(log_entry)
    db.commit()
    logging.info(
        f"Exercise completion logged for char_id={char_id}, exercise_id={exercise_id}, xp_gained={xp_gained}, quantity={quantity}"
    )
