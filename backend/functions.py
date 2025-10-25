import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "1fdf6ee430a52f970927d5e817510af2f83101581aa9a1c51165e2bb20b93d10"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*7 # 7 nap

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + (timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def hash_password(password: str):
    return bcrypt.hashpw(password, bcrypt.gensalt())

def verify_password(entered_pw: str, hash_pw : str):
    return bcrypt.checkpw(entered_pw, hash_pw)