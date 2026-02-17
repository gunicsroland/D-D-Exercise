from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from models import AdventureMessage, AdventureSession
import services.character as character_service

def generate_dm_response(
    session: AdventureSession,
    user_message: str,
    db: Session
):
    character = session.character
    
    system_prompt = f"""
    You are a Dungeon Master.
    The player character is:
    Name: {character.name}
    Class: {character.class_}
    Level: {character.level}
    Abilities: {[(a.ability.value, a.score) for a in character.abilities]}

    Respond in immersive D&D style.
    It is a simplified game, we don't have items or spells.
    """
    
    history = (
        db.query(AdventureMessage)
        .filter(AdventureMessage.session_id == session.id)
        .order_by(AdventureMessage.created_at)
        .all()
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": user_message})
    
    response = call_chat_model(messages)
    
    return response

def call_chat_model(messages):
    return "test response from DM"

def apply_dm_response_to_game_state(response, session, db):
    if not response:
        return
    
    user_id = session.user_id
    character = session.character
    
    if xp := response.get("xp"):
        character_service.add_experience(character, xp, db)