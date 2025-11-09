from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.schemas import UserRequest, LoginRequest
from backend.functions import *

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost",
    "http://localhost:19006",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],         
)

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
def login(user: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code = 400, detail='Wrong username or wrong password')
    
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}