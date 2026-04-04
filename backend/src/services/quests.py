import logging
from datetime import date
import random
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import ExerciseCategory, Quest, CharQuestProgress, Character, Exercise
from src.services import character as character_service
from src.services import inventory as inventory_service
from src.constants import DAILY_QUEST_COUNT
from src.utils import DAY_CATEGORY_MAP


def get_or_create_progress(char_id: int, quest_id: int, db: Session):
    today = date.today()

    progress = (
        db.query(CharQuestProgress)
        .filter(
            CharQuestProgress.char_id == char_id,
            CharQuestProgress.quest_id == quest_id,
            CharQuestProgress.date == today,
        )
        .first()
    )

    if not progress:
        progress = CharQuestProgress(
            char_id=char_id, quest_id=quest_id, progress=0, completed=False, date=today
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)

    return progress


def update_quest_progress(char_id: int, quest_id: int, db: Session):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail=f"Quest with {quest_id} not found")

    progress = get_or_create_progress(char_id, quest_id, db)

    if progress.completed:
        return progress

    progress.progress += 1
    if progress.progress >= quest.amount:
        progress.completed = True
        complete_quest(char_id, quest, db)

    db.commit()
    db.refresh(progress)

    return progress


def generate_daily_quests(
    db: Session, char_id: int, num_quests: int = DAILY_QUEST_COUNT
):
    today = date.today()
    weekday = today.weekday()

    category = DAY_CATEGORY_MAP.get(weekday, ExerciseCategory.Strength)

    char = db.query(Character).filter(Character.id == char_id).first()

    if not char:
        raise HTTPException(status_code=404, detail="User not found")

    quests = (
        db.query(Quest)
        .join(Exercise, Quest.exercise_id == Exercise.id)
        .filter(
            Exercise.category == category, Exercise.difficulty == char.quest_difficulty
        )
        .all()
    )

    random.shuffle(quests)

    selected_quests = quests[:num_quests]
    for quest in selected_quests:
        get_or_create_progress(char_id, quest.id, db)

    return selected_quests


def get_daily_quests(db: Session, char_id: int):
    today = date.today()

    existing = (
        db.query(CharQuestProgress)
        .filter(CharQuestProgress.char_id == char_id, CharQuestProgress.date == today)
        .all()
    )

    daily_quests = []
    if existing:
        logging.info(
            f"Character {char_id} already has daily quests for today, returning existing quests"
        )
        for progress in existing:
            quest = db.query(Quest).filter(Quest.id == progress.quest_id).first()
            if quest:
                daily_quests.append(quest)
    else:
        logging.info(f"Generating new daily quests for user {char_id}")
        daily_quests = generate_daily_quests(db, char_id)

    return daily_quests


def complete_quest(char_id: int, quest: Quest, db: Session):
    logging.info(
        f"User {char_id} completed quest '{quest.name}', awarding {quest.xp_reward} XP and item id={quest.item_reward}"
    )

    character_service.add_xp(char_id, quest.xp_reward, db)

    if quest.item_reward:
        inventory_service.add_item(char_id, quest.item_reward, 1, db)

    logging.info(
        f"Rewards for quest completion processed successfully for user {char_id}"
    )

    return "Success"
