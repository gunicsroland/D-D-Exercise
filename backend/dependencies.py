import os
from fastapi import Depends, HTTPException, Security
import secrets
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from sqlalchemy.orm import Session
from jose import JWTError
import logging

from database import get_db
from models import User
from functions import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
api_key_header = APIKeyHeader(name="X-Admin-Key")


def require_admin_key(api_key: str = Security(api_key_header)):
    if not secrets.compare_digest(api_key, os.environ["ADMIN_API_KEY"]):
        raise HTTPException(status_code=403)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = None
    user_id = None
    try:
        logging.warning("--- NEW get_current_user ---")
        logging.warning(f"1. Received Token: {token[:10]}...")
        
        payload = decode_access_token(token)
        logging.warning(f"2. Token Decoded. Payload: {payload}")
        
        user_id = int(payload.get("sub"))
        logging.warning(f"3. Extracted user_id: {user_id} (Type: {type(user_id)})")

        if user_id is None:
            logging.error("4. ERROR: Token 'sub' is missing.")
            raise credentials_exception
    except JWTError as e:
        logging.error(f"4. ERROR: JWT decode failed! Error: {e}")
        raise credentials_exception
    except Exception as e:
        logging.error(f"4. ERROR: Unexpected error during token decode. {e}")
        raise credentials_exception

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            logging.error(f"5. ERROR: User with ID {user_id} NOT FOUND in database.")
            raise credentials_exception
        
        logging.warning(f"5. SUCCESS: User '{user.username}' found.")
        logging.warning(f"User info: username={user.username}, email={user.email}, id={user.id}")
        return user
    except Exception as e: 
        logging.error(f"5. ERROR: Database query failed. {e}")
        raise credentials_exception
    
def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user