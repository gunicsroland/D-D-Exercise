from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Items, ItemEffect, User, ItemType
import schemas
from functions import get_admin_user

app = APIRouter(
    prefix="/items",
    tags=["items"]
)

@app.get("/{item_id}", response_model=schemas.ItemSchema)
def get_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching item with id={item_id}")

    item = db.query(Items).filter(Items.id == item_id).first()

    if not item:
        logging.warning(f"Item with id={item_id} not found")
        raise HTTPException(status_code=404, detail="Item not found")

    logging.info(f"Item found: {item.name} (type={item.type.value}) with {len(item.effects)} effects")

    return item

@app.get("/", response_model=list[schemas.ItemSchema])
def get_all_items(db: Session = Depends(get_db)):
    logging.info("Fetching all items")
    return db.query(Items).all()

@app.post("/", response_model=schemas.ItemSchema)
def create_item(
    item_data: schemas.ItemCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} creating new item {item_data.name}")

    item = Items(
        name=item_data.name,
        description=item_data.description,
        image_url=item_data.image_url,
        type=ItemType(item_data.type)
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.post("/{item_id}/effects", response_model=schemas.ItemEffectSchema)
def add_item_effect(
    item_id: int,
    effect_data: schemas.ItemEffectCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} adding effect to item id={item_id}")

    item = db.query(Items).filter(Items.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    effect = ItemEffect(
        item_id=item_id,
        attribute=effect_data.attribute,
        operation=effect_data.operation,
        value=effect_data.value,
        duration=effect_data.duration,
    )

    db.add(effect)
    db.commit()
    db.refresh(effect)

    return effect

@app.post("/", response_model=schemas.ItemSchema)
def create_item(
    item_data: schemas.ItemCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user) 
):
    logging.info(f"Admin {admin_user.id} creating new item {item_data.name}")

    item = Items(
        name=item_data.name,
        description=item_data.description,
        image_url=item_data.image_url,
        type=ItemType(item_data.type)
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.post("/{item_id}/effects", response_model=schemas.ItemEffectSchema)
def add_item_effect(
    item_id: int,
    effect_data: schemas.ItemEffectCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)  # ✅ Admin check
):
    logging.info(f"Admin {admin_user.id} adding effect to item id={item_id}")

    item = db.query(Items).filter(Items.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    effect = ItemEffect(
        item_id=item_id,
        attribute=effect_data.attribute,
        operation=effect_data.operation,
        value=effect_data.value,
        duration=effect_data.duration,
    )

    db.add(effect)
    db.commit()
    db.refresh(effect)

    return effect
