from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import *
import schemas
from functions import *
from dependencies import get_current_user

app = APIRouter(
    prefix="/character",
    tags=["character"]
)

@app.get("/has_character/{user_id}")
def user_has_character(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Checking character existence for user_id={user_id}")

    if current_user.id != user_id:
        logging.warning(f"Unauthorized access attempt by user {current_user['id']} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    character = db.query(Character).filter(Character.user_id == user_id).first()

    logging.info(f"Character exists: {bool(character)} for user_id={user_id}")
    return {"has_character": bool(character)}

    
@app.get("/{user_id}", response_model=schemas.CharacterSchema)
def get_user_character(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching character for user_id={user_id}")

    if current_user.id != user_id:
        logging.warning(f"Unauthorized character fetch attempt by user {current_user.id} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    character = db.query(Character).filter(Character.user_id == user_id).first()

    if not character:
        logging.warning(f"No character found for user_id={user_id}")
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

@app.get("/")
def get_all_characters(db: Session = Depends(get_db)):
    logging.info("Fetching all characters")
    return db.query(Character).all()


@app.post("/{user_id}")
def create_character(
    user_id: int,
    character_data: schemas.CharacterCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Creating character for user_id={user_id}")

    if current_user.id != user_id:
        logging.warning(f"Unauthorized character creation attempt by user {current_user.id} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    existing_character = db.query(Character).filter(Character.user_id == user_id).first()
    if existing_character:
        logging.warning(f"User {user_id} already has a character")
        raise HTTPException(status_code=400, detail="Character already exists")

    character = Character(
        name=character_data.name,
        class_=character_data.class_,
        level=1,
        xp=0,
        user_id=user_id
    )

    character.abilities = [
        CharacterAbility(ability=ability, score=score)
        for ability, score in character_data.abilities.items()
    ]

    db.add(character)
    db.commit()
    db.refresh(character)

    logging.info(f"Character created successfully with id={character.id} for user_id={user_id}")

    return {
        "message": "Character created successfully",
        "character_id": character.id
    }

@app.delete("/{user_id}")
def delete_character(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Deleting character for user_id={user_id}")

    if current_user.id != user_id:
        logging.warning(f"Unauthorized character deletion attempt by user {current_user.id} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    character = db.query(Character).filter(Character.user_id == user_id).first()

    if not character:
        logging.warning(f"No character found to delete for user_id={user_id}")
        raise HTTPException(status_code=404, detail="Character not found")

    db.delete(character)
    db.commit()

    logging.info(f"Character deleted successfully for user_id={user_id}")

    return {"message": "Character deleted successfully"}

@app.post("/{user_id}/xp")
def add_xp(
    user_id: int,
    xp_gain: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Adding XP for user={user_id}, xp_gain={xp_gain}")
    
    if current_user.id != user_id:
        logging.warning(f"Unauthorized XP addition attempt by user {current_user.id} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    character = db.query(Character).filter(Character.user_id == user_id).first()
    if not character:
        logging.warning(f"No character found for user_id={user_id} when trying to add XP")
        raise HTTPException(status_code=404, detail="Character not found")
    
    old_level = character.level
    character.xp += xp_gain
    
    new_level = calculate_level(character.xp)
    levels_gained = new_level - old_level
    
    if levels_gained > 0:
        logging.info(f"Character leveled up from {old_level} to {new_level} for user_id={user_id}")
        character.level = new_level
        character.ability_points += levels_gained * 2
        
    db.commit()
    db.refresh(character)
    
    return {
        "message": "XP added",
        "xp_gained": xp_gain,
        "total_xp": character.xp,
        "old_level": old_level,
        "new_level": character.level,
        "levels_gained": levels_gained,
        "ability_points": character.ability_points,
    }
    
@app.post("/{user_id}/ability_points")
def upgrade_ability(
    user_id: int,
    ability: AbilityType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Upgrading ability for user_id={user_id}, ability={ability.value}")
    if current_user.id != user_id:
        logging.warning(f"Unauthorized ability upgrade attempt by user {current_user.id} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    character = db.query(Character).filter(Character.user_id == user_id).first()
    if not character:
        logging.warning(f"No character found for user_id={user_id} when trying to upgrade ability")
        raise HTTPException(status_code=404, detail="Character not found")
    
    if character.ability_points <= 0:
        logging.warning(f"User {user_id} does not have enough ability points to upgrade {ability.value}")
        raise HTTPException(status_code=400, detail="Not enough ability points")
    
    char_ability = db.query(CharacterAbility).filter(CharacterAbility.character_id == character.id, CharacterAbility.ability == ability).first()
    if not char_ability:
        logging.warning(f"Ability {ability.value} not found for character_id={character.id}")
        raise HTTPException(status_code=404, detail="Ability not found")
    
    if char_ability.score >= 20:
        logging.warning(f"Ability {ability.value} is already at max score for character_id={character.id}")
        raise HTTPException(status_code=400, detail="Ability score is already at maximum")
    
    char_ability.score += 1
    character.ability_points -= 1
    
    db.commit()
    db.refresh(character)
    
    logging.info(f"Ability {ability.value} upgraded successfully for character_id={character.id}. New score: {char_ability.score}, Remaining ability points: {character.ability_points}")
    
    return {
        "message": f"{ability.value} upgraded successfully",
        "new_score": char_ability.score,
        "remaining_ability_points": character.ability_points
    }
    
