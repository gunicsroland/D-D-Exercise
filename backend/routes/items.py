from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
from models import Item, ItemEffect, User, ItemType
import schemas
from dependencies import get_admin_user

app = APIRouter(
    prefix="/items",
    tags=["items"]
)

@app.get("/{item_id}", response_model=schemas.ItemRead)
def get_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching item with id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        logging.warning(f"Item with id={item_id} not found")
        raise HTTPException(status_code=404, detail="Item not found")

    logging.info(f"Item found: {item.name} (type={item.type.value}) with {len(item.effects)} effects")

    return item

@app.get("/", response_model=list[schemas.ItemRead])
def get_all_items(db: Session = Depends(get_db)):
    logging.info("Fetching all items")
    return db.query(Item).all()

@app.post("/", response_model=schemas.ItemRead)
def create_item(
    item_data: schemas.ItemCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} creating new item {item_data.name}")

    item = Item(
        name=item_data.name,
        description=item_data.description,
        image_url=item_data.image_url,
        type=ItemType(item_data.type)
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

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

@app.post("/", response_model=schemas.ItemRead)
def create_item(
    item_data: schemas.ItemCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user) 
):
    logging.info(f"Admin {admin_user.id} creating new item {item_data.name}")

    item = Item(
        name=item_data.name,
        description=item_data.description,
        image_url=item_data.image_url,
        type=ItemType(item_data.type)
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} deleting item id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    logging.info(f"Item id={item_id} deleted successfully")

    return {"detail": "Item deleted successfully"}

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

@app.post("/{item_id}/effects/{effect_id}")
def link_effect_to_item(
    item_id: int,
    effect_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} linking effect id={effect_id} to item id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    effect = db.query(ItemEffect).filter(ItemEffect.id == effect_id).first()
    if not effect:
        raise HTTPException(status_code=404, detail="Item effect not found")

    item.effects.append(effect)
    db.commit()

    logging.info(f"Effect id={effect_id} linked to item id={item_id} successfully")

    return {"detail": "Effect linked to item successfully"}