from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import  User
import schemas
from dependencies import get_admin_user

app = APIRouter(
    prefix="/user",
    tags=["users"]
)

@app.get("/", response_model=List[schemas.UserSchema])
def get_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} fetching all users")
    return db.query(User).all()

@app.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} deleting user with id={user_id}")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logging.warning(f"User with id={user_id} not found for deletion")
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    logging.info(f"User with id={user_id} deleted successfully")
    return {"message": "User deleted successfully"}