from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import *
import schemas
from dependencies import get_current_user

import services.messages as messages_service

app = APIRouter(
    prefix="/messages",
    tags=["messages"]
)

@app.get("/{session_id}", response_model=List[schemas.AdventureMessageRead])
def get_adventure_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(AdventureSession).filter(AdventureSession.id == session_id, AdventureSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Adventure session not found")
    
    return db.query(AdventureMessage).filter(AdventureMessage.session_id == session_id).order_by(AdventureMessage.created_at).all()


