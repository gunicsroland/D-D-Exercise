import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    if "sub" not in to_encode:
        raise ValueError("Token data must include 'sub' field")
    if not SECRET_KEY or not ALGORITHM:
        raise RuntimeError("SECRET_KEY amd ALGORITHM environment variable must be set")

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    if not SECRET_KEY or not ALGORITHM:
        raise RuntimeError("SECRET_KEY amd ALGORITHM environment variable must be set")
        
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

def hash_password(password: str):
    password_bytes = password.encode('utf-8')
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(entered_pw: str, hash_pw : str):
    entered_pw_bytes = entered_pw.encode('utf-8')
    hashed_bytes = hash_pw.encode('utf-8')
    return bcrypt.checkpw(entered_pw_bytes, hashed_bytes)
