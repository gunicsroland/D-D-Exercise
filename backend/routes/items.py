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

    logging.info(f"Item found: {item.name} (type={item.item_type.value}) with {len(item.effects)} effects")

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
        item_type=ItemType(item_data.item_type)
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.put("/{item_id}")
def update_item(
    item_id: int,
    item_data: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} updating item id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        logging.warning(f"Item with id={item_id} not found for update")
        raise HTTPException(status_code=404, detail="Item not found")

    for field, value in item_data.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    logging.info(f"Item id={item_id} updated successfully")

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

@app.delete("/{item_id}/effects/{effect_id}")
def unlink_effect_from_item(
    item_id: int,
    effect_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    logging.info(f"Admin {admin_user.id} unlinking effect id={effect_id} from item id={item_id}")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    effect = db.query(ItemEffect).filter(ItemEffect.id == effect_id).first()
    if not effect:
        raise HTTPException(status_code=404, detail="Item effect not found")

    if effect in item.effects:
        item.effects.remove(effect)
        db.commit()
        logging.info(f"Effect id={effect_id} unlinked from item id={item_id} successfully")
        return {"detail": "Effect unlinked from item successfully"}
    else:
        logging.warning(f"Effect id={effect_id} is not linked to item id={item_id}")
        raise HTTPException(status_code=400, detail="Effect is not linked to this item")