from fastapi import HTTPException, Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import *
import schemas
from dependencies import require_admin_key
from services.auth import hash_password, verify_password, create_access_token

app = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
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

@app.post("/admin/create")
def create_admin(user: schemas.UserCreate, db: Session = Depends(get_db),
                 _: None = Depends(require_admin_key)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This Username is used")
    
    db_user = User(
        username = user.username,
        email = user.email,
        password_hash = hash_password(user.password),
        is_admin = True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "Admin user created successfully"}

@app.post("/login")
def login(loginRequest: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == loginRequest.username).first()
    
    if not db_user or not verify_password(loginRequest.password, db_user.password_hash):
        raise HTTPException(status_code = 400, detail='Wrong username or wrong password')
    
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/form_login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password

    db_user = db.query(User).filter(User.username == username).first()

    if not db_user or not verify_password(password, db_user.password_hash):
        raise HTTPException(status_code = 400, detail='Wrong username or wrong password')
    
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}