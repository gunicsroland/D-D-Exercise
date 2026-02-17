from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from models import WorkoutLog

def log_exercise_completion(user_id: int, exercise_id: int, xp_gained: int, quantity: int, db: Session):
    log_entry = WorkoutLog(
        user_id=user_id,
        exercise_id=exercise_id,
        xp_gained=xp_gained,
        quantity=quantity
    )
    db.add(log_entry)
    db.commit()
    logging.info(f"Exercise completion logged for user_id={user_id}, exercise_id={exercise_id}, xp_gained={xp_gained}, quantity={quantity}")