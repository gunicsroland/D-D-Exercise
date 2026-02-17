import logging

import constants
from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import Character, CharacterAbility, User

def calculate_level(xp: int) -> int:
    level = 1
    
    for lvl, required_xp in constants.XP_LEVELS.items():
        if xp >= required_xp:
            level = lvl
        else:
            break
        
    return min(level, constants.MAX_LEVEL)

def award_xp(user_id: int, xp_gain: int, db: Session):
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
    
def upgrade_ability(user_id: int, ability: str, db: Session):
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