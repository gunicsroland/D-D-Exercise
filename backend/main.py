from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserRequest
from functions import *

app = FastAPI()

@app.post("/register")
def register(user: UserRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This Username is used")
    
    db_user = User(
        username = user.username,
        email = user.email,
        password_hash = hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}

@app.post("/login")
def login(user: UserRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code = 400, detail='Wrong username or wrong password')
    
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}