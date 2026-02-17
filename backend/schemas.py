from typing import List, Optional
from pydantic import BaseModel, model_validator
from models import AbilityType, ExerciseCategory, ExerciseDifficulty

class BaseSchema(BaseModel):
    class Config:
        orm_mode = True

class UserBase(BaseSchema):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    is_admin: bool
    
class AbilityBase(BaseSchema):
    ability: AbilityType
    score: int

class AbilityCreate(BaseSchema):
    ability: AbilityType
    score: int

class AbilityRead(AbilityBase):
    pass
    
class CharacterBase(BaseSchema):
    name: str
    class_: str
    level: int
    xp: int
    ability_points: int    
    
class CharacterCreate(CharacterBase):
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

class CharacterRead(CharacterBase):
    id: int
    abilities: List[AbilityRead]
    
class ItemEffectBase(BaseSchema):
    attribute: str
    operation: str
    value: int
    duration: int
    
class ItemEffectCreate(ItemEffectBase):
    pass
        
class ItemEffectRead(ItemEffectBase):
    id: int
    
class ItemEffectUpdate(BaseSchema):
    attribute: Optional[str] = None
    operation: Optional[str] = None
    value: Optional[int] = None
    duration: Optional[int] = None
    
class ItemBase(BaseSchema):
    name: str
    description: str
    item_type: str
    image_url: Optional[str] = None

class ItemCreate(ItemBase):
    pass
        
class ItemRead(ItemBase):
    id: int
    effects: List[ItemEffectRead] = []
    
class ItemUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    item_type: Optional[str] = None
    image_url: Optional[str] = None
        
class InventoryBase(BaseSchema):
    quantity: int
    
class InventoryCreate(InventoryBase):
    item_id: int
    user_id: int
    
class InventoryRead(InventoryBase):
    id: int
    item: ItemRead
    
class ExerciseBase(BaseSchema):
    name: str
    category: ExerciseCategory
    difficulty: ExerciseDifficulty
    quantity: int = 1
    xp_reward: int
    media_url: Optional[str] = None
    
class ExerciseCreate(ExerciseBase):
    pass

class ExerciseRead(ExerciseBase):
    id: int
    
class ExerciseUpdate(BaseSchema):
    name: Optional[str] = None
    category: Optional[ExerciseCategory] = None
    difficulty: Optional[ExerciseDifficulty] = None
    quantity: Optional[int] = None
    xp_reward: Optional[int] = None
    media_url: Optional[str] = None
    
class QuestBase(BaseSchema):
    name: str
    description: str
    exercise_id: int
    amount: int
    xp_reward: int
    item_reward: Optional[int] = None
    
class QuestCreate(QuestBase):
    pass

class QuestRead(QuestBase):
    id: int
    
class QuestUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    exercise_id: Optional[int] = None
    amount: Optional[int] = None
    xp_reward: Optional[int] = None
    item_reward: Optional[int] = None
    
class AdventureSessionBase(BaseSchema):
    character_id: int
    user_id: int
    title: str
    
class AdventureSessionCreate(AdventureSessionBase):
    pass

class AdventureSessionRead(AdventureSessionBase):
    id: int
    
class AdventureSessionUpdate(BaseSchema):
    character_id: Optional[int] = None
    user_id: Optional[int] = None
    title: Optional[str] = None
    
class AdventureMessageBase(BaseSchema):
    session_id: int
    role: str
    content: str
    
class AdventureMessageCreate(AdventureMessageBase):
    pass

class AdventureMessageRead(AdventureMessageBase):
    id: int