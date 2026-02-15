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
    
class Exercise(Base):
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
    
class Quest(Base):
    __tablename__ = "quests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    amount = Column(Integer)
    xp_reward = Column(Integer)
    item_reward = Column(Integer, ForeignKey("items.id"))
    
class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    amount = Column(Integer)
    date = Column(TIMESTAMP)
    
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