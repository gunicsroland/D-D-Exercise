from sqlalchemy import Column, Integer, Boolean, String, ForeignKey, Enum, TIMESTAMP, func, Table
from sqlalchemy.orm import relationship
from database import Base
import enum

class CharacterClass(enum.Enum):
    Barbarian = "Barbarian"
    Wizard = "Wizard"
    Bard = "Bard"
    
class ItemType(enum.Enum):
    Armor = 'armor'
    Weapon = 'weapon'
    Potion = 'potion'
    
class AbilityType(enum.Enum):
    STR = "strength"
    DEX = "dexterity"
    CON = "constitution"
    INT = "intelligence"
    WIS = "wisdom"
    CHA = "charisma"
    
class ExerciseCategory(enum.Enum):
    Strength = "strength"
    Cardio = "cardio"
    Flexibility = "flexibility"
    Core = "core"
    
class ExerciseDifficulty(enum.Enum):
    VeryEasy = "very_easy"
    Easy = "easy"
    Medium = "medium"
    Hard = "hard"
    VeryHard = "very_hard"
    NearlyImpossible = "nearly_impossible"
    
class ChatRole(enum.Enum):
    User = "user"
    DM = "dm"
    System = "system"
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    is_admin = Column(Boolean, default=False)

    characters = relationship("Character", back_populates="user")
    
class Character(Base):
    __tablename__ = "characters"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    class_ = Column("class", Enum(CharacterClass))
    level = Column(Integer)
    xp = Column(Integer)
    ability_points = Column(Integer, default=0)
    abilities = relationship("CharacterAbility", back_populates="character", cascade="all, delete")
    
    user = relationship("User", back_populates="characters")

class CharacterAbility(Base):
    __tablename__ = "character_abilities"
    
    id = Column(Integer, primary_key=True)
    character_id = Column(Integer, ForeignKey("characters.id"))
    ability = Column(Enum(AbilityType))
    score = Column(Integer, default=10)

    character = relationship("Character", back_populates="abilities")        
    
class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(Enum(ExerciseCategory))
    difficulty = Column(Enum(ExerciseDifficulty))
    quantity = Column(Integer, default=1)
    xp_reward = Column(Integer)
    media_url = Column(String, nullable=True)
    
class Quest(Base):
    __tablename__ = "quests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    amount = Column(Integer)
    xp_reward = Column(Integer)
    item_reward = Column(Integer, ForeignKey("items.id"), nullable=True)
    
class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quest_id = Column(Integer, ForeignKey("quests.id"))
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    date = Column(TIMESTAMP)
    
class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    quantity = Column(Integer)
    xp_gained = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User")
    exercise = relationship("Exercise")
    
item_effect_link = Table(
    "item_effect_link",
    Base.metadata,
    Column("item_id", ForeignKey("items.id"), primary_key=True),
    Column("effect_id", ForeignKey("item_effects.id"), primary_key=True),
)
    
class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    item_type = Column("item_type", Enum(ItemType))
    image_url = Column(String, nullable=True)
    
    effects = relationship("ItemEffect",
                           secondary=item_effect_link,
                           back_populates="items")
    
class ItemEffect(Base):
    __tablename__ = "item_effects"
    
    id = Column(Integer, primary_key=True, index=True)
    attribute = Column(String)
    operation = Column(String)
    value = Column(Integer)
    duration = Column(Integer)
    
    items = relationship("Item",
                         secondary=item_effect_link,
                         back_populates="effects")
    
class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    
    item = relationship("Item")
    
class AdventureSession(Base):
    __tablename__ = "adventure_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=False)

    title = Column(String, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())

    character = relationship("Character")
    user = relationship("User")

class AdventureMessage(Base):
    __tablename__ = "adventure_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("adventure_sessions.id"), nullable=False)

    role = Column(Enum(ChatRole), nullable=False)
    content = Column(String, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())

    session = relationship("AdventureSession")
