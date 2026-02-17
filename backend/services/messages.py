from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from models import AdventureMessage, AdventureSession   , ChatRole

def save_message(
    user_id: int,
    session_id: int,
    role: ChatRole,
    content: str,
    db: Session
):
    session = db.query(AdventureSession).filter(AdventureSession.id == session_id, AdventureSession.user_id == user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Adventure session not found")

    adventure_message = AdventureMessage(
        session_id=session.id,
        role=role,
        content=content
    )
    db.add(adventure_message)
    db.commit()