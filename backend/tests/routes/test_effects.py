import pytest
from tests.conftest import client

def create_effect():
    response = client.post(
        "/effects/",
        json={
            "attribute": "strength",
            "increase": True,
            "value": 2,
            "duration": 5,
        },
    )
    assert response.status_code == 200
    return response.json()


def test_add_item_effect():
    response = client.post(
        "/effects/",
        json={
            "attribute": "strength",
            "increase": True,
            "value": 2,
            "duration": 5,
        },
    )

    assert response.status_code == 200
    data = response.json()

    assert data["attribute"] == "strength"
    assert data["increase"] is True
    assert data["value"] == 2
    assert data["duration"] == 5
    assert "id" in data


def test_get_item_effect():
    effect = create_effect()

    response = client.get(f"/effects/{effect['id']}")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == effect["id"]
    assert data["attribute"] == effect["attribute"]


def test_get_item_effect_not_found():
    response = client.get("/effects/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item effect not found"


def test_get_all_item_effects():
    create_effect()
    create_effect()

    response = client.get("/effects/")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 2


def test_update_item_effect():
    effect = create_effect()

    response = client.put(
        f"/effects/{effect['id']}",
        json={
            "value": 20,
            "duration": 15,
        },
    )

    assert response.status_code == 200
    data = response.json()

    assert data["value"] == 20
    assert data["duration"] == 15


def test_update_item_effect_not_found():
    response = client.put(
        "/effects/9999",
        json={"value": 50},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Item effect not found"

def test_delete_item_effect():
    effect = create_effect()

    response = client.delete(f"/effects/{effect['id']}")

    assert response.status_code == 200
    assert response.json()["detail"] == "Item effect deleted successfully"

    # verify deletion
    get_response = client.get(f"/effects/{effect['id']}")
    assert get_response.status_code == 404


def test_delete_item_effect_not_found():
    response = client.delete("/effects/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item effect not found"


# ---- Seed endpoint ----
def test_seed_item_effects():
    response = client.post("/effects/seed")

    assert response.status_code == 200