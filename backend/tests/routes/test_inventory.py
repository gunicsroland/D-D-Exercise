from datetime import datetime
import pytest
from src.models import Inventory, Item, ItemEffect, ItemType, AbilityType

from tests.conftest import client, TestingSessionLocal



def create_item(db):
    item = Item(
        name="Potion",
        description="Test potion",
        item_type=ItemType.Potion,
        image_url=None
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def create_inventory(db, char_id, item_id, quantity=3):
    inv = Inventory(
        char_id=char_id,
        item_id=item_id,
        quantity=quantity
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


def test_get_all_inventories():
    db = TestingSessionLocal()
    item = create_item(db)
    create_inventory(db, 1, item.id)

    response = client.get("/inventory/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_get_inventory_me():
    db = TestingSessionLocal()

    item = create_item(db)
    create_inventory(db, 1, item.id, 5)

    response = client.get("/inventory/me")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[1]["quantity"] == 5


def test_add_item():
    db = TestingSessionLocal()

    item = create_item(db)

    response = client.post(f"/inventory/{item.id}/?quantity=2")

    assert response.status_code == 200
    assert response.json()["message"] == "Item added to inventory"

    inventory = db.query(Inventory).filter(Inventory.item_id == item.id).first()
    assert inventory is not None
    assert inventory.quantity == 2


def test_consume_item_success():
    db = TestingSessionLocal()

    item = create_item(db)

    effect = ItemEffect(
        attribute=AbilityType.STR,
        increase=True,
        value=5,
        duration=10
    )

    item.effects.append(effect)
    db.add(effect)
    db.commit()

    create_inventory(db, 1, item.id, 2)

    response = client.delete(f"/inventory/consume/{item.id}?quantity=1")

    assert response.status_code == 200
    assert response.json()["message"] == "Item consumed from inventory"

    inventory = db.query(Inventory).filter(Inventory.item_id == item.id).first()
    assert inventory.quantity == 1


def test_consume_item_not_in_inventory():
    response = client.delete("/inventory/consume/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not in inventory"


def test_consume_item_not_enough():
    db = TestingSessionLocal()

    item = create_item(db)
    create_inventory(db, 1, item.id, 1)

    response = client.delete(f"/inventory/consume/{item.id}?quantity=5")

    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough items in inventory"


def test_remove_item_success():
    db = TestingSessionLocal()

    item = create_item(db)
    create_inventory(db, 1, item.id, 3)

    response = client.delete(f"/inventory/{item.id}/?quantity=2")

    assert response.status_code == 200
    assert response.json()["message"] == "Item removed from inventory"

    inventory = db.query(Inventory).filter(Inventory.item_id == item.id).first()
    assert inventory.quantity == 1


def test_remove_item_not_found():
    response = client.delete("/inventory/999/?quantity=1")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not in inventory"


def test_remove_item_not_enough():
    db = TestingSessionLocal()

    item = create_item(db)
    create_inventory(db, 1, item.id, 1)

    response = client.delete(f"/inventory/{item.id}/?quantity=5")

    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough items in inventory"