import logging
import constants
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session

from models import Character, User

def calculate_level(xp: int) -> int:
    level = 1
    
    for lvl, required_xp in constants.XP_LEVELS.items():
        if xp >= required_xp:
            level = lvl
        else:
            break
        
    return min(level, constants.MAX_LEVEL)

def award_xp(user_id, xp_gain, db):
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