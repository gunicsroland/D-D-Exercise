from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from models import Item, Inventory

def add_item(user_id: int, item_id: int, quantity: int, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
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