import os
import secrets

from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from sqlalchemy.orm import Session
from jose import JWTError

from src.database import get_db
from src.models import User
from src.services.auth import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/form_login")
api_key_header = APIKeyHeader(name="X-Admin-Key")


def require_admin_key(api_key: str = Security(api_key_header)):
    if not secrets.compare_digest(api_key, os.environ["ADMIN_API_KEY"]):
        raise HTTPException(status_code=403)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = None
    user_id = None
    try:

        payload = decode_access_token(token)

        user_id = int(payload.get("sub"))

        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    except Exception:
        raise credentials_exception

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise credentials_exception

        return user
    except Exception:
        raise credentials_exception


def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user
