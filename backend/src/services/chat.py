from typing import List
from datetime import datetime, timezone
from collections import defaultdict

from sqlalchemy.orm import Session

from src.models import AdventureMessage, AdventureSession, Character, ActiveEffect, ChatRole
import src.services.character as character_service
from src.constants import MODEL_NAME, SUMMARY_TRIGGER_MESSAGES, RECENT_MESSAGES_TO_KEEP

from google import genai
from google.genai import types

client = genai.Client()

def get_active_effects_for_character(db: Session, character_id: int):
    now = datetime.now(timezone.utc)
    return (
        db.query(ActiveEffect)
        .filter(
            ActiveEffect.character_id == character_id,
            ActiveEffect.expires_at > now,
        )
        .all()
    )

def build_effective_ability_lines(character: Character, db: Session):
    deltas = defaultdict(int)
    active_effects = get_active_effects_for_character(db, character.id)

    for effect in active_effects:
        delta = effect.value if effect.increase else -effect.value
        deltas[effect.attribute] += delta

    lines = []
    for ability in character.abilities:
        delta = deltas.get(ability.ability, 0)
        effective_score = max(1, ability.score + delta)

        if delta == 0:
            lines.append(f"{ability.ability.value}: {effective_score}")
        else:
            lines.append(f"{ability.ability.name}: {ability.score} ({delta:+d} aktív hatás) → {effective_score}")

    return lines

def summarize_messages_with_model(messages: list[AdventureMessage], existing_summary: str = ""):
    summary_prompt = f"""
    Összefoglaló készítése egy D&D-szerű kalandhoz.

    Kérlek, röviden és tömören foglald össze az eddigi párbeszédet magyarul.
    Tartsd meg:
    - a fontos történéseket,
    - a játékos döntéseit,
    - az NPC-ket,
    - helyszíneket,
    - küldetésállapotot,
    - nyitott kérdéseket,
    - a karakter fontos állapotváltozásait.

    Ne írj meta-kommentárt. Csak az összefoglalót add vissza.
    Ha van korábbi összefoglaló, azt frissítsd és egészítsd ki.

    Korábbi összefoglaló:
    {existing_summary or "(nincs)"}
    """

    contents = [
        types.Content(role="user", parts=[types.Part(text=summary_prompt)]),
    ]

    for m in messages:
        contents.append(
            types.Content(
                role="user" if m.role == ChatRole.User else "model",
                parts=[types.Part(text=m.content)],
            )
        )

    response = call_chat_model(contents)
    return (response.text or "").strip()

def compact_session_history(db: Session, session: AdventureSession):
    messages = (
        db.query(AdventureMessage)
        .filter(AdventureMessage.session_id == session.id)
        .filter(AdventureMessage.summarized is False)
        .order_by(AdventureMessage.created_at)
        .all()
    )

    if len(messages) <= SUMMARY_TRIGGER_MESSAGES:
        return


    session.summary = summarize_messages_with_model(
        messages,
        existing_summary=getattr(session, "summary", "") or "",
    )

    for msg in messages:
        msg.summarized = True

    db.commit()

def generate_dm_response(session: AdventureSession, user_message: str, db: Session):
    character = session.character

    compact_session_history(db, session)

    system_prompt = f"""
    You are a Dungeon Master.
    The player character is:
    Name: {character.name}
    Class: {character.class_}
    Level: {character.level}
    Abilities: {build_effective_ability_lines(character, db)}

    Respond in immersive D&D style.
    It is a simplified game, we don't have items or spells.
    Respond in Hungarian
    """

    history = (
        db.query(AdventureMessage)
        .filter(AdventureMessage.session_id == session.id)
        .order_by(AdventureMessage.created_at.desc())
        .limit(RECENT_MESSAGES_TO_KEEP)
        .all()
    )
    contents = []

    contents.append(types.Content(role="user", parts=[types.Part(text=system_prompt)]))

    if getattr(session, "summary", None):
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=f"Eddigi rövid összefoglaló:\n{session.summary}")],
            )
        )

    for m in reversed(history):
        contents.append(
            types.Content(
                role="user" if m.role == ChatRole.User else "model",
                parts=[types.Part(text=m.content)],
            )
        )
    contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))

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
