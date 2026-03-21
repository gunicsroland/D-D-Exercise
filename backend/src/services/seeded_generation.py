import json
import logging
import os
from sqlalchemy.orm import Session
from fastapi import HTTPException

from src.models import Exercise, ExerciseCategory, ExerciseDifficulty, AbilityType, ItemEffect, Item, ItemType, Quest
from src.services import item as item_service

def seed_exercises(db: Session):

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "exercises.json")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for ex in data:
            exists = db.query(Exercise).filter(Exercise.name == ex["name"]).first()
            if exists:
                logging.info(f"Skipping existing exercise: {ex['name']}")
                continue

            new_exercise = Exercise(
                name=ex["name"],
                category=ExerciseCategory(ex["category"]),
                difficulty=ExerciseDifficulty(ex["difficulty"]),
                quantity=ex.get("quantity", 1),
                xp_reward=ex["xp_reward"],
                media_url=ex.get("media_url"),
            )

            db.add(new_exercise)
            logging.info(f"Added exercise: {ex['name']}")

        db.commit()
        print("Exercises seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error seeding exercises:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding items: {str(e)}"
        )
    finally:
        db.close()

    return "Success"

def generate_item_effects_file():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "jsons/item_effects.json")
    effects = []

    for ability in AbilityType:
        for value in range(-3, 4):
            if value == 0:
                continue 

            effect = {
                "attribute": ability.value,
                "increase": value > 0,
                "value": abs(value),
                "duration": max(1, 6 // abs(value))
            }

            effects.append(effect)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(effects, f, indent=4)

    print(f"Generated {len(effects)} item effects into {output_path}")

def seed_item_effects(db: Session):
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "item_effects.json")

        if not os.path.exists(file_path):
            logging.info("item_effects.json not found. Generating...")
            generate_item_effects_file()

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for effect in data:
            exists = (
                db.query(ItemEffect)
                .filter(
                    ItemEffect.attribute == AbilityType(effect["attribute"]),
                    ItemEffect.increase == effect["increase"],
                    ItemEffect.value == effect["value"],
                    ItemEffect.duration == effect["duration"],
                )
                .first()
            )

            if exists:
                continue

            new_effect = ItemEffect(
                attribute=AbilityType(effect["attribute"]),
                increase=effect["increase"],
                value=effect["value"],
                duration=effect["duration"],
            )

            db.add(new_effect)

        db.commit()
        print("Item effects seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error seeding item effects:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding items: {str(e)}"
        )
    finally:
        db.close()

    return "Success"

def seed_items(db: Session):

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "items.json")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item_data in data:
            exists = db.query(Item).filter(Item.name == item_data["name"]).first()
            if exists:
                logging.info(f"Skipping existing item: {item_data['name']}")
                continue

            item = Item(
                name=item_data["name"],
                description=item_data["description"],
                image_url=item_data.get("image_url"),
                item_type=ItemType(item_data["item_type"])
            )

            db.add(item)
            logging.info(f"Added item: {item_data['name']}")

        db.commit()
        print("Items seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error seeding items:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding items: {str(e)}"
        )

    finally:
        db.close()

    return "Success"

def seed_link_effects(db: Session):

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "effect_links.json")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for link_data in data:
            item_id = link_data.get("item_id")
            effect_ids = link_data.get("effect_ids", [])

            for effect_id in effect_ids:
                item_service.link_item_with_effect(item_id, effect_id, db)

        print("All item-effect links seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error seeding item-effect links:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding item-effect links: {str(e)}"
        )

    finally:
        db.close()

    return "Success"
            
def seed_quests(db: Session):
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "jsons", "quests.json")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for q in data:
            exists = db.query(Quest).filter(Quest.name == q["name"]).first()
            if exists:
                logging.info(f"Skipping existing quest: {q['name']}")
                continue

            exercise = db.query(Exercise).filter(Exercise.id == q["exercise_id"]).first()
            if not exercise:
                logging.warning(f"Exercise with id={q['exercise_id']} not found. Skipping quest '{q['name']}'")
                continue

            item = db.query(Item).filter(Item.id == q["item_reward"]).first()
            if not item:
                logging.warning(f"Item with id={q['item_reward']} not found. Skipping quest '{q['name']}'")
                continue

            new_quest = Quest(
                name=q["name"],
                exercise_id=q["exercise_id"],
                amount=q["amount"],
                xp_reward=q["xp_reward"],
                item_reward=q["item_reward"]
            )

            db.add(new_quest)
            logging.info(f"Added quest: {q['name']}")

        db.commit()
        return "Success"

    except Exception as e:
        db.rollback()
        print("Error seeding quests:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding quests: {str(e)}"
        )
    finally:
        db.close()