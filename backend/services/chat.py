from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from models import AdventureMessage, AdventureSession
import services.character as character_service
from constants import MODEL_NAME
from google import genai
from google.genai import types

client = genai.Client()

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
    contents = []
    
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part(text=system_prompt)]
        )
    )
    for m in history:
        contents.append(
            types.Content(
                role="user" if m.role == "user" else "model",
                parts=[types.Part(text=m.content)]
            )
        )
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part(text=user_message)]
        )
    )
    
    response = call_chat_model(contents)
    
    return response.text

def call_chat_model(contents):
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=contents,
        config=types.GenerateContentConfig(
            temperature=0,
            top_p=0.95,
            top_k=20,
        ),
    )
    return response

def apply_dm_response_to_game_state(response, session, db):
    if not response:
        return
    
    user_id = session.user_id
    character = session.character
    
    if xp := response.get("xp"):
        character_service.add_experience(character, xp, db)