from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Exercise, User, ExerciseCategory, ExerciseDifficulty
import schemas
from dependencies import get_admin_user, get_current_user
from services import character as character_service
from services import log as log_service
from services import quests as quest_service

app = APIRouter(
    prefix="/exercises",
    tags=["exercises"]
)

@app.get("/", response_model=list[schemas.ExerciseRead])
def get_exercises(
    db: Session = Depends(get_db)
):
    logging.info("Fetching all exercises")
    return db.query(Exercise).all()

@app.get("/{exercise_id}", response_model=schemas.ExerciseRead)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching exercise with id={exercise_id}")
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        logging.warning(f"Exercise with id={exercise_id} not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

@app.get("/{category}", response_model=list[schemas.ExerciseRead])
def get_exercises_by_category(
    category: ExerciseCategory,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching exercises in category '{category}'")
    return db.query(Exercise).filter(Exercise.category == category).all()

@app.get("/{difficulty}", response_model=list[schemas.ExerciseRead])
def get_exercises_by_difficulty(
    difficulty: ExerciseDifficulty,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching exercises with difficulty '{difficulty}'")
    return db.query(Exercise).filter(Exercise.difficulty == difficulty).all()

@app.get("/{category}/{difficulty}", response_model=list[schemas.ExerciseRead])
def get_exercises_by_category_and_difficulty(
    category: ExerciseCategory,
    difficulty: ExerciseDifficulty,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching exercises in category '{category}' with difficulty '{difficulty}'")
    return db.query(Exercise).filter(
        Exercise.category == category,
        Exercise.difficulty == difficulty
    ).all()

@app.post("/")
def add_exercise(
    exercise: schemas.ExerciseCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} adding new exercise: {exercise.name}")
    
    new_exercise = Exercise(
        name=exercise.name,
        category=exercise.category,
        difficulty=exercise.difficulty,
        xp_reward=exercise.xp_reward,
        media_url=exercise.media_url
    )
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    
    logging.info(f"Exercise '{exercise.name}' added successfully with id={new_exercise.id}")
    
    return {"message": "Exercise added successfully", "exercise": new_exercise}

@app.put("/{exercise_id}")
def update_exercise(
    exercise_id: int,
    exercise_data: schemas.ExerciseUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} updating exercise with id={exercise_id}")
    
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        logging.warning(f"Exercise with id={exercise_id} not found for update")
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    for field, value in exercise_data.dict(exclude_unset=True).items():
        setattr(exercise, field, value)

    db.commit()
    db.refresh(exercise)
    
    logging.info(f"Exercise with id={exercise_id} updated successfully")
    
    return {"message": "Exercise updated successfully", "exercise": exercise}
    

@app.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} deleting exercise with id={exercise_id}")
    
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        logging.warning(f"Exercise with id={exercise_id} not found for deletion")
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    db.delete(exercise)
    db.commit()
    
    logging.info(f"Exercise with id={exercise_id} deleted successfully")
    
    return {"message": "Exercise deleted successfully"}

@app.post("/finish/{exercise_id}")
def finish_exercise(
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        logging.warning(f"Exercise with id={exercise_id} not found for completion")
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    logging.info(f"User {current_user.id} completed exercise with id={exercise_id}, awarding {exercise.xp_reward} XP")
    character_service.add_xp(current_user.id, exercise.xp_reward, db)
    
    daily_quests = quest_service.get_daily_quests(db, current_user.id)
    if exercise_id in [quest.exercise_id for quest in daily_quests]:
        quest_service.update_quest_progress(current_user.id, exercise_id, db)
    
    logging.info(f"Rewards for exercise completion processed successfully for user {current_user.id}")
    
    log_service.log_exercise_completion(current_user.id, exercise_id, exercise.xp_reward, exercise.quantity, db)
    
    return {"message": "Exercise completed successfully, rewards processed"}
    