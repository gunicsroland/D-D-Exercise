import logging

import constants
from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import Item, ItemEffect

def link_item_with_effect(item_id: int, effect_id: int, db: Session):
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