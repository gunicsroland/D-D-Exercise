from typing import List
from pydantic import BaseModel, model_validator
from models import AbilityType 
  
class UserRequest(BaseModel):
    username: str
    email: str
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
    
class AbilitySchema(BaseModel):
    ability: AbilityType
    score: int

    class Config:
        orm_mode = True

class CharacterSchema(BaseModel):
    name: str
    class_: str
    level: int
    xp: int
    ability_points: int
    abilities: List[AbilitySchema]

    class Config:
        orm_mode = True
        
class ItemEffectSchema(BaseModel):
    attribute: str
    operation: str
    value: int
    duration: int

    class Config:
        orm_mode = True
        
class ItemSchema(BaseModel):
    id: int
    name: str
    description: str
    image_url: str | None
    item_type: str
    effects: list[ItemEffectSchema] = []

    class Config:
        orm_mode = True
        
class InventoryItemSchema(BaseModel):
    quantity: int
    item: ItemSchema

    class Config:
        orm_mode = True
        
class ItemEffectCreate(BaseModel):
    attribute: str
    operation: str  # "add", "multiply", "set"
    value: int
    duration: int
    
class ItemCreate(BaseModel):
    name: str
    description: str
    image_url: str | None = None
    type: str  # "weapon", "armor", "potion"
    
