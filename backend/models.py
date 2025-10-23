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
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP)

    characters = relationship("Character", back_populates="user")
    
class Charachter(Base):
    __tablename__ = "characters"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    class_ = Column("class", Enum(CharacterClass))
    level = Column(Integer)
    xp = Column(Integer)
    
class Exercises(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    difficulty = Column(Integer)
    xp_reward = Column(Integer)
    
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
    