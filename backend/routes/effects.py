from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Item, ItemEffect, User
import schemas
from dependencies import get_admin_user

app = APIRouter(
    prefix="/effects",
    tags=["effects"]
)

@app.get("/effects/{effect_id}", response_model=schemas.ItemEffectRead)
def get_item_effect(
    effect_id: int,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching item effect with id={effect_id}")

    effect = db.query(ItemEffect).filter(ItemEffect.id == effect_id).first()

    if not effect:
        logging.warning(f"Item effect with id={effect_id} not found")
        raise HTTPException(status_code=404, detail="Item effect not found")

    logging.info(f"Item effect found: {effect.attribute}")

    return effect

@app.get("/effects", response_model=list[schemas.ItemEffectRead])
def get_all_item_effects(db: Session = Depends(get_db)):
    logging.info("Fetching all item effects")
    return db.query(ItemEffect).all()

@app.post("/effects", response_model=schemas.ItemEffectRead)
def add_item_effect(
    item_id: int,
    effect_data: schemas.ItemEffectCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} adding effect to item id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    effect = ItemEffect(
        attribute=effect_data.attribute,
        operation=effect_data.operation,
        value=effect_data.value,
        duration=effect_data.duration,
    )

    db.add(effect)
    db.commit()
    db.refresh(effect)

    return effect

@app.put("/effects/{effect_id}")
def update_item_effect(
    effect_id: int,
    effect_data: schemas.ItemEffectUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} updating item effect id={effect_id}")

    effect = db.query(ItemEffect).filter(ItemEffect.id == effect_id).first()
    if not effect:
        logging.warning(f"Item effect with id={effect_id} not found for update")
        raise HTTPException(status_code=404, detail="Item effect not found")

    for field, value in effect_data.dict(exclude_unset=True).items():
        setattr(effect, field, value)

    db.commit()
    db.refresh(effect)

    logging.info(f"Item effect id={effect_id} updated successfully")

    return effect

@app.delete("/effects/{effect_id}")
def delete_item_effect(
    effect_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} deleting effect id={effect_id}")

    effect = db.query(ItemEffect).filter(ItemEffect.id == effect_id).first()
    if not effect:
        raise HTTPException(status_code=404, detail="Item effect not found")

    db.delete(effect)
    db.commit()

    logging.info(f"Effect id={effect_id} deleted successfully")

    return {"detail": "Item effect deleted successfully"}