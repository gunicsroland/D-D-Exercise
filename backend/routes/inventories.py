from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import logging
from typing import List

from database import get_db
from models import *
import schemas
from dependencies import get_current_user
from services import inventory as inventory_service

app = APIRouter(
    prefix="/inventory",
    tags=["inventory"]
)

@app.get("/", response_model=List[schemas.InventoryRead])
def get_all_inventories(
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching all inventories")
    return db.query(Inventory).all()

@app.get("/{user_id}", response_model=List[schemas.InventoryRead])
def get_inventory(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logging.info(f"Fetching inventory for user_id={current_user.id}")

    inventory_items = (db.query(Inventory).filter(Inventory.user_id == current_user.id).all())

    logging.info(f"Found {len(inventory_items)} items in inventory for user_id={current_user.id}")

    return inventory_items

@app.post("/{user_id}/{item_id}/")
def add_item(
    item_id: int,
    quantity: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Adding item_id={item_id} (quantity={quantity}) to inventory for user_id={current_user.id}")
    
    inventory_service.add_item(current_user.id, item_id, quantity, db)
    
    return {"message": "Item added to inventory"}

@app.delete("/{user_id}/{item_id}/")
def remove_item(
    item_id: int,
    quantity: int = 1,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logging.info(f"Removing item_id={item_id} (quantity={quantity}) from inventory for user_id={current_user.id}")
    
    inventory_item = db.query(Inventory).filter(
        Inventory.user_id == current_user.id,
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
    logging.info(f"Item removed successfully from inventory for user_id={current_user.id}")
    return {"message": "Item removed from inventory"}