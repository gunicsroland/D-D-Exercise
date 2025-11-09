import base64
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
    password_bytes = password.encode('utf-8')
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return base64.b64encode(hashed).decode('utf-8')

def verify_password(entered_pw: str, hash_pw : str):
    entered_pw_bytes = entered_pw.encode('utf-8')
    hashed_bytes = base64.b64decode(hash_pw.encode('utf-8'))
    return bcrypt.checkpw(entered_pw_bytes, hashed_bytes)