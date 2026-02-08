from xmlrpc.client import Boolean
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, TIMESTAMP
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
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default="CURRENT_TIMESTAMP")
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
    
class Exercises(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    difficulty = Column(Integer)
    xp_reward = Column(Integer)
    
class CharacterAbility(Base):
    __tablename__ = "character_abilities"
    
    id = Column(Integer, primary_key=True)
    character_id = Column(Integer, ForeignKey("characters.id"))
    ability = Column(Enum(AbilityType))
    score = Column(Integer, default=10)

    character = relationship("Character", back_populates="abilities")    
    
class Quests(Base):
    __tablename__ = "quests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    amount = Column(Integer)
    xp_reward = Column(Integer)
    item_reward = Column(Integer, ForeignKey("items.id"))
    
class WorkoutLogs(Base):
    __tablename__ = "workout_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    amount = Column(Integer)
    date = Column(TIMESTAMP)
    
class Items(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    type = Column("item_type", Enum(ItemType))
    image_url = Column(String, nullable=True)
    
    effects = relationship("ItemEffect", back_populates="item")
    
class ItemEffect(Base):
    __tablename__ = "item_effect"
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    attribute = Column(String)
    operation = Column(String)
    value = Column(Integer)
    duration = Column(Integer)
    
class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    
    item = relationship("Items")