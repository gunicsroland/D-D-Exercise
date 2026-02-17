from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import *
import schemas
from dependencies import get_current_user, get_admin_user
from services import chat as chat_service
from services import messages as messages_service

app = APIRouter(
    prefix="/adventure",
    tags=["adventure"]
)

@app.post("/start")
def start_adventure(
    title: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Starting adventure for user_id={current_user.id} with title='{title}'")

    character = db.query(Character).filter(Character.user_id == current_user.id).first()

    if not character:
        logging.warning(f"No character found for user_id={current_user.id}")
        raise HTTPException(status_code=404, detail="Character not found")

    session = AdventureSession(
        user_id=current_user.id,
        character_id=character.id,
        title=title
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    logging.info(f"Adventure session created with id={session.id} for user_id={current_user.id}")

    return {"session_id": session.id}

@app.get("/", response_model=List[schemas.AdventureSessionRead])
def get_adventure_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(AdventureSession).filter(AdventureSession.user_id == current_user.id).all()

@app.get("/all", response_model=List[schemas.AdventureSessionRead])
def get_all_adventure_sessions(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(AdventureSession).all()

@app.post("/{session_id}/message")
def send_adventure_message(
    session_id: int,
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(AdventureSession).filter(AdventureSession.id == session_id, AdventureSession.user_id == current_user.id).first()

    if not session:
        logging.warning(f"Adventure session not found with id={session_id}")
        raise HTTPException(status_code=404, detail="Adventure session not found")

    dm_response = chat_service.generate_dm_response(session, message, db)

    messages_service.save_message(
        user_id=current_user.id,
        session_id=session.id,
        role=ChatRole.User,
        content=message,
        db=db
    )
    messages_service.save_message(
        user_id=current_user.id,
        session_id=session.id,
        role=ChatRole.DM,
        content=dm_response,
        db=db
    )

    logging.info(f"Added user message and DM response to session_id={session_id}")

    return {"dm_response": dm_response}

@app.delete("/{session_id}")
def delete_adventure_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(AdventureSession).filter(AdventureSession.id == session_id, AdventureSession.user_id == current_user.id).first()

    if not session:
        logging.warning(f"Adventure session not found with id={session_id} for deletion")
        raise HTTPException(status_code=404, detail="Adventure session not found")

    db.delete(session)
    db.commit()

    logging.info(f"Deleted adventure session with id={session_id}")

    return {"detail": "Adventure session deleted"}

@app.put("/{session_id}/title")
def update_adventure_title(
    session_id: int,
    new_title: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(AdventureSession).filter(AdventureSession.id == session_id, AdventureSession.user_id == current_user.id).first()

    if not session:
        logging.warning(f"Adventure session not found with id={session_id} for title update")
        raise HTTPException(status_code=404, detail="Adventure session not found")

    session.title = new_title
    db.commit()
    db.refresh(session)

    logging.info(f"Updated title of adventure session with id={session_id} to '{new_title}'")

    return {"detail": "Adventure title updated", "new_title": session.title}