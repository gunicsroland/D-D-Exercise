from pydantic import BaseModel  
  
class UserRequest(BaseModel):
    username: str
    email: str
    password: str
    
class LoginRequest(BaseModel):
    username: str
    password: str