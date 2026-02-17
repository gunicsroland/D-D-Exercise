from datetime import date
from constants import DAY_CATEGORY_MAP
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Quest, User
import schemas
from dependencies import get_admin_user, get_current_user
from services import quests as quest_service

app = APIRouter(
    prefix="/quests",
    tags=["quests"]
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

@app.get("/daily_quests", response_model=list[schemas.QuestRead])
def get_daily_quests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logging.info(f"Fetching daily quests for user {current_user.id}")
    daily_quests = quest_service.get_daily_quests(db, current_user.id)

    logging.info(f"Found {len(daily_quests)} daily quests for user {current_user.id}")
    return daily_quests

@app.post("/")
def create_quest(
    quest: schemas.QuestCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin user {admin_user.id} is creating a new quest with name '{quest.name}'")
    new_quest = Quest(
        name=quest.name,
        description=quest.description,
        exercise_id=quest.exercise_id,
        amount=quest.amount,
        xp_reward=quest.xp_reward,
        item_reward=quest.item_reward
    )
    db.add(new_quest)
    db.commit()
    db.refresh(new_quest)
    logging.info(f"Quest '{new_quest.name}' created successfully with id={new_quest.id}")
    return new_quest

@app.delete("/{quest_id}")
def delete_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin user {admin_user.id} is attempting to delete quest with id={quest_id}")
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        logging.warning(f"Quest with id={quest_id} not found for deletion")
        raise HTTPException(status_code=404, detail="Quest not found")
    
    db.delete(quest)
    db.commit()
    logging.info(f"Quest with id={quest_id} deleted successfully")
    return {"detail": "Quest deleted successfully"}

@app.put("/{quest_id}")
def update_quest(
    quest_id: int,
    quest_data: schemas.QuestUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin user {admin_user.id} is attempting to update quest with id={quest_id}")
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        logging.warning(f"Quest with id={quest_id} not found for update")
        raise HTTPException(status_code=404, detail="Quest not found")
    
    for field, value in quest_data.dict(exclude_unset=True).items():
        setattr(quest, field, value)
    
    db.commit()
    db.refresh(quest)
    logging.info(f"Quest with id={quest_id} updated successfully")
    return quest