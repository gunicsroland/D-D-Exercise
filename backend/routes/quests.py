from datetime import date
from backend.constants import DAY_CATEGORY_MAP
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Quest, User
import schemas
from dependencies import get_admin_user, get_current_user
from services import quests as quest_service

app = APIRouter(
    prefix="/exercises",
    tags=["exercises"]
)

@app.get("/", response_model=list[schemas.QuestRead])
def get_quests(
    db: Session = Depends(get_db)
):
    logging.info("Fetching all quests")
    return db.query(Quest).all()

@app.get("/{quest_id}", response_model=schemas.QuestRead)
def get_quest(
    quest_id: int,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching quest with id={quest_id}")
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        logging.warning(f"Quest with id={quest_id} not found")
        raise HTTPException(status_code=404, detail="Quest not found")
    return quest

@app.post("/daily_quests", response_model=list[schemas.QuestRead])
def get_daily_quests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    daily_quests = quest_service.get_daily_quests(db, current_user.id)
    if daily_quests:
        logging.info(f"User {current_user.id} already has daily quests for today, returning existing quests")
        return daily_quests
    
    logging.info(f"Fetching daily quests for user {current_user.id}")
    quests = quest_service.generate_daily_quests(db, current_user.id)
    
    for quest in quests:
        logging.info(f"Daily quest: {quest.name} (category={quest.exercise_category.value}, amount={quest.amount}, xp_reward={quest.xp_reward})")
        quest_service.get_or_create_progress(current_user.id, quest.id, db)
    
    logging.info(f"Found {len(quests)} daily quests for user {current_user.id}")
    return quests