from pydantic import BaseModel, model_validator
from models import AbilityType 
  
class UserRequest(BaseModel):
    username: str
    email: str
    password: str
    
class LoginRequest(BaseModel):
    username: str
    password: str
    
class CharacterCreateRequest(BaseModel):
    name: str
    class_: str
    abilities: dict[AbilityType, int]
    
    @model_validator(mode="after")
    def check_all_abilities_present(self):
        required = {a for a in AbilityType}
        received = {a for a in self.abilities.keys()}

        missing = required - received
        if missing:
            raise ValueError(f"Missing abilities: {', '.join(m.value for m in missing)}")

        for ability, score in self.abilities.items():
            if not 1 <= score <= 20:
                raise ValueError(f"{ability.value} score must be between 1 and 20")

        return self