from datetime import datetime
from sqlalchemy import (
    Integer,
    Boolean,
    String,
    ForeignKey,
    Enum,
    TIMESTAMP,
    func,
    Table,
    DateTime,
    Column,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.database import Base
import enum
from typing import Optional


class CharacterClass(enum.Enum):
    Barbarian = "Barbarian"
    Wizard = "Wizard"
    Bard = "Bard"


class ItemType(enum.Enum):
    Armor = "armor"
    Weapon = "weapon"
    Potion = "potion"
    Scroll = "scroll"
    Accessory = "accessory"


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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    quest_difficulty: Mapped[ExerciseDifficulty] = mapped_column(
        Enum(ExerciseDifficulty), default=ExerciseDifficulty.VeryEasy
    )
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    characters: Mapped[list["Character"]] = relationship(
        "Character", back_populates="user"
    )


class Character(Base):
    __tablename__ = "characters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String)
    class_: Mapped[CharacterClass] = mapped_column("class", Enum(CharacterClass))
    level: Mapped[int] = mapped_column(Integer, default=1)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    ability_points: Mapped[int] = mapped_column(Integer, default=0)

    abilities: Mapped[list["CharacterAbility"]] = relationship(
        "CharacterAbility", back_populates="character", cascade="all, delete"
    )
    user: Mapped["User"] = relationship("User", back_populates="characters")


class CharacterAbility(Base):
    __tablename__ = "character_abilities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    character_id: Mapped[int] = mapped_column(ForeignKey("characters.id"))
    ability: Mapped[AbilityType] = mapped_column(Enum(AbilityType))
    score: Mapped[int] = mapped_column(Integer, default=10)

    character: Mapped["Character"] = relationship(
        "Character", back_populates="abilities"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    category: Mapped[ExerciseCategory] = mapped_column(Enum(ExerciseCategory))
    difficulty: Mapped[ExerciseDifficulty] = mapped_column(Enum(ExerciseDifficulty))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    xp_reward: Mapped[int] = mapped_column(Integer)
    media_url: Mapped[str | None] = mapped_column(String, nullable=True)

    quests: Mapped[list["Quest"]] = relationship("Quest", back_populates="exercise")


class Quest(Base):
    __tablename__ = "quests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))
    amount: Mapped[int] = mapped_column(Integer)
    xp_reward: Mapped[int] = mapped_column(Integer)
    item_reward: Mapped[Optional[int]] = mapped_column(
        ForeignKey("items.id"), nullable=True
    )

    exercise: Mapped["Exercise"] = relationship("Exercise", back_populates="quests")
    item: Mapped[Optional["Item"]] = relationship("Item")


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    quest_id: Mapped[int] = mapped_column(ForeignKey("quests.id"))
    progress: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    date: Mapped[datetime] = mapped_column(TIMESTAMP)


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    xp_gained: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    user: Mapped["User"] = relationship("User")
    exercise: Mapped["Exercise"] = relationship("Exercise")


item_effect_link = Table(
    "item_effect_link",
    Base.metadata,
    Column("item_id", ForeignKey("items.id"), primary_key=True),
    Column("effect_id", ForeignKey("item_effects.id"), primary_key=True),
)


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    item_type: Mapped[ItemType] = mapped_column("item_type", Enum(ItemType))
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)

    effects: Mapped[list["ItemEffect"]] = relationship(
        "ItemEffect", secondary=item_effect_link, back_populates="items"
    )


class ItemEffect(Base):
    __tablename__ = "item_effects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    attribute: Mapped[AbilityType] = mapped_column("ability", Enum(AbilityType))
    increase: Mapped[bool] = mapped_column(Boolean)
    value: Mapped[int] = mapped_column(Integer)
    duration: Mapped[int] = mapped_column(Integer)

    items: Mapped[list["Item"]] = relationship(
        "Item", secondary=item_effect_link, back_populates="effects"
    )


class ActiveEffect(Base):
    __tablename__ = "active_effects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    attribute: Mapped[AbilityType] = mapped_column("ability", Enum(AbilityType))
    increase: Mapped[bool] = mapped_column(Boolean)
    value: Mapped[int] = mapped_column(Integer)


class Inventory(Base):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    quantity: Mapped[int] = mapped_column(Integer)

    item: Mapped["Item"] = relationship("Item")


class AdventureSession(Base):
    __tablename__ = "adventure_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    character_id: Mapped[int] = mapped_column(
        ForeignKey("characters.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    character: Mapped["Character"] = relationship("Character")
    user: Mapped["User"] = relationship("User")
    messages: Mapped[list["AdventureMessage"]] = relationship(
        "AdventureMessage", back_populates="session", cascade="all, delete-orphan"
    )


class AdventureMessage(Base):
    __tablename__ = "adventure_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(
        ForeignKey("adventure_sessions.id"), nullable=False
    )
    role: Mapped[ChatRole] = mapped_column(Enum(ChatRole), nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    session: Mapped["AdventureSession"] = relationship("AdventureSession")
