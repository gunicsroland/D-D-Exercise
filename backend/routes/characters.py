from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import *
import schemas
from dependencies import get_current_user
from services import character as character_service

app = APIRouter(
    prefix="/character",
    tags=["character"]
)

@app.get("/has_character/{user_id}")
def user_has_character(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Checking character existence for user_id={current_user.id}")

    character = db.query(Character).filter(Character.user_id == current_user.id).first()

    logging.info(f"Character exists: {bool(character)} for user_id={current_user.id}")
    return {"has_character": bool(character)}

    
@app.get("/{user_id}", response_model=schemas.CharacterRead)
def get_user_character(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching character for user_id={current_user.id}")

    character = db.query(Character).filter(Character.user_id == current_user.id).first()

    if not character:
        logging.warning(f"No character found for user_id={current_user.id}")
        raise HTTPException(status_code=404, detail="Character not found")

    logging.info(
        "Character found",
        extra={
            "character_id": character.id,
            "name": character.name,
            "level": character.level,
            "class": character.class_,
            "xp": character.xp,
            "ability_points": character.ability_points
        }
    )

    return character

@app.get("/", response_model=List[schemas.CharacterRead])
def get_all_characters(db: Session = Depends(get_db)):
    logging.info("Fetching all characters")
    return db.query(Character).all()


@app.post("/{user_id}")
def create_character(
    character_data: schemas.CharacterCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Creating character for user_id={current_user.id}")

    existing_character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if existing_character:
        logging.warning(f"User {current_user.id} already has a character")
        raise HTTPException(status_code=400, detail="Character already exists")

    character = Character(
        name=character_data.name,
        class_=character_data.class_,
        level=1,
        xp=0,
        user_id=current_user.id
    )

    character.abilities = [
        CharacterAbility(ability=ability, score=score)
        for ability, score in character_data.abilities.items()
    ]

    db.add(character)
    db.commit()
    db.refresh(character)

    logging.info(f"Character created successfully with id={character.id} for user_id={current_user.id}")

    return {
        "message": "Character created successfully",
        "character_id": character.id
    }

@app.delete("/{user_id}")
def delete_character(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Deleting character for user_id={current_user.id}")

    if current_user.id != current_user.id:
        logging.warning(f"Unauthorized character deletion attempt by user {current_user.id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    character = db.query(Character).filter(Character.user_id == current_user.id).first()

    if not character:
        logging.warning(f"No character found to delete for user_id={current_user.id}")
        raise HTTPException(status_code=404, detail="Character not found")

    db.delete(character)
    db.commit()

    logging.info(f"Character deleted successfully for user_id={current_user.id}")

    return {"message": "Character deleted successfully"}

@app.put("/{user_id}/xp")
def add_xp(
    xp_gain: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Adding XP for user={current_user.id}, xp_gain={xp_gain}")
    
    if current_user.id != current_user.id:
        logging.warning(f"Unauthorized XP addition attempt by user {current_user.id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    message = character_service.award_xp(current_user.id, xp_gain, db)
    logging.info(f"XP added successfully for user_id={current_user.id}. Total XP: {message['total_xp']}, New Level: {message['new_level']}")
    return message
    
@app.put("/{user_id}/ability_points")
def upgrade_ability(
    ability: AbilityType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Upgrading ability for user_id={current_user.id}, ability={ability.value}")
    if current_user.id != current_user.id:
        logging.warning(f"Unauthorized ability upgrade attempt by user {current_user.id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return character_service.upgrade_ability(current_user.id, ability, db)
    
