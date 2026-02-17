import logging
from datetime import date
from random import random
from constants import DAY_CATEGORY_MAP
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import schemas
from models import ExerciseCategory, User, Quest, UserQuestProgress
from services import character as character_service
from services import inventory as inventory_service

def get_or_create_progress(user_id: int, quest_id: int, db: Session):
    today = date.today()
    
    progress = (
        db.query(UserQuestProgress)
        .filter(
            UserQuestProgress.user_id == user_id,
            UserQuestProgress.quest_id == quest_id,
            UserQuestProgress.date == today
        )
        .first()
    )
    if not progress:
        progress = UserQuestProgress(
            user_id=user_id,
            quest_id=quest_id,
            progress=0,
            completed=False,
            date=today
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

def update_quest_progress(user_id: int, quest_id: int, db: Session):
    progress = get_or_create_progress(user_id, quest_id, db)
    
    if progress.completed:
        return progress
    
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    progress.progress += 1
    if progress.progress >= quest.amount:
        progress.completed = True
        complete_quest(user_id, quest, db)
   
    db.commit()
    db.refresh(progress)
    
    return progress

def generate_daily_quests(db: Session, user_id: int, num_quests: int = 3):
    today = date.today()
    weekday = today.weekday()

    category = DAY_CATEGORY_MAP.get(weekday, ExerciseCategory.Strength)

    quests = (
        db.query(Quest)
        .filter(Quest.daily == True, Quest.exercise_category == category)
        .all()
    )

    random.shuffle(quests)

    selected_quests = quests[:num_quests]

    return selected_quests

def get_daily_quests(db: Session, user_id: int):
    today = date.today()
    
    existing = (
        db.query(UserQuestProgress)
        .filter(
            UserQuestProgress.user_id == user_id,
            UserQuestProgress.date == today
        )
        .all()
    )
    
    daily_quests = []
    if existing:
        logging.info(f"User {user_id} already has daily quests for today, returning existing quests")
        for progress in existing:
            quest = db.query(Quest).filter(Quest.id == progress.quest_id).first()
            if quest:
                daily_quests.append(quest)
            
    return daily_quests

def complete_quest(user_id: int, quest: Quest, db: Session):
    logging.info(f"User {user_id} completed quest '{quest.name}', awarding {quest.xp_reward} XP and item id={quest.item_reward}")
    
    character_service.add_xp(user_id, quest.xp_reward, db)
    
    if quest.item_reward:
        inventory_service.add_item_to_inventory(user_id, quest.item_reward, db)
    
    logging.info(f"Rewards for quest completion processed successfully for user {user_id}")