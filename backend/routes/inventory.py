from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import *
import schemas
from functions import *
from dependencies import get_current_user

app = APIRouter(
    prefix="/inventory",
    tags=["inventory"]
)

@app.get("/{user_id}", response_model=List[schemas.InventoryItemSchema])
def get_inventory(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching inventory for user_id={user_id}")

    if current_user["id"] != user_id:
        logging.warning(f"Unauthorized inventory fetch attempt by user {current_user['id']} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    inventory_items = (db.query(Inventory).filter(Inventory.user_id == user_id).all())

    logging.info(f"Found {len(inventory_items)} items in inventory for user_id={user_id}")

    return [
        schemas.InventoryItemSchema(
            quantity=item.quantity,
            item=schemas.ItemSchema.from_orm(item.item)
        )
        for item in inventory_items
    ]

@app.post("/{user_id}/add")
def add_item(
    user_id: int,
    item_id: int,
    quantity: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Adding item_id={item_id} (quantity={quantity}) to inventory for user_id={user_id}")
    
    if current_user["id"] != user_id:
        logging.warning(f"Unauthorized inventory modification attempt by user {current_user['id']} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    item = db.query(Items).filter(Items.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    existing_inventory_item = db.query(Inventory).filter(
        Inventory.user_id == user_id,
        Inventory.item_id == item_id
    ).first()

    if existing_inventory_item:
        existing_inventory_item.quantity += quantity
    else:
        new_inventory_item = Inventory(
            user_id=user_id,
            item_id=item_id,
            quantity=quantity
        )
        db.add(new_inventory_item)

    db.commit()
    logging.info(f"Item added successfully to inventory for user_id={user_id}")
    return {"message": "Item added to inventory"}

@app.post("/{user_id}/remove")
def remove_item(
    user_id: int,
    item_id: int,
    quantity: int = 1,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Removing item_id={item_id} (quantity={quantity}) from inventory for user_id={user_id}")
    
    if current_user["id"] != user_id:
        logging.warning(f"Unauthorized inventory modification attempt by user {current_user['id']} for user_id={user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    inventory_item = db.query(Inventory).filter(
        Inventory.user_id == user_id,
        Inventory.item_id == item_id
    ).first()

    if not inventory_item:
        raise HTTPException(status_code=404, detail="Item not in inventory")

    if inventory_item.quantity < quantity:
        raise HTTPException(status_code=400, detail="Not enough items in inventory")

    inventory_item.quantity -= quantity

    if inventory_item.quantity == 0:
        db.delete(inventory_item)

    db.commit()
    logging.info(f"Item removed successfully from inventory for user_id={user_id}")
    return {"message": "Item removed from inventory"}