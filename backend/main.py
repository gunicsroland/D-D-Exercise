from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, Base, engine
from models import *
import schemas
from functions import *
from dependencies import get_current_user
import logging

from routes import auth, users, character, inventory, items

app = FastAPI()

app.include_router(auth.app)
app.include_router(users.app)
app.include_router(character.app)
app.include_router(inventory.app)
app.include_router(items.app)

Base.metadata.create_all(bind=engine)

origins = [
    "http://127.0.0.1:5500",
    "http://localhost",
    "http://localhost:19006",
    "http://localhost:8081",
    "http://localhost:8000",
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],         
)


@app.get("/me")
def get_current_user(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "email": current_user.email}