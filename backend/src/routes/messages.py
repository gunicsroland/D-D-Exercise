from fastapi import HTTPException, Depends, APIRouter
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import logging
from typing import List

from src.database import get_db
from src.models import User, AdventureMessage, AdventureSession, ChatRole
import src.schemas as schemas
from src.dependencies import get_current_user
import src.services.messages as messages_service
from src.services import chat as chat_service

app = APIRouter(prefix="/messages", tags=["messages"])


@app.get("/{session_id}", response_model=List[schemas.AdventureMessageRead])
def get_adventure_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(AdventureSession)
        .filter(
            AdventureSession.id == session_id,
            AdventureSession.user_id == current_user.id,
        )
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Adventure session not found")

    return (
        db.query(AdventureMessage)
        .filter(AdventureMessage.session_id == session_id)
        .order_by(AdventureMessage.created_at)
        .all()
    )


@app.post("/{session_id}", response_model=schemas.AdventureMessageRead)
def send_adventure_message(
    session_id: int,
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(AdventureSession)
        .filter(
            AdventureSession.id == session_id,
            AdventureSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        logging.warning(f"Adventure session not found with id={session_id}")
        raise HTTPException(status_code=404, detail="Adventure session not found")

    generator = chat_service.generate_dm_response_stream(session, message, db)

    return StreamingResponse(generator, media_type="text/plain")
