import pytest
from src.models import AdventureSession

from tests.conftest import client, TestingSessionLocal

def create_session(db, user_id=1, character_id=1, title="Test Adventure"):
    session = AdventureSession(
        user_id=user_id,
        character_id=character_id,
        title=title
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def test_start_adventure():
    db = TestingSessionLocal()

    response = client.post("/adventure/start?title=MyAdventure")

    assert response.status_code == 200
    data = response.json()

    assert "session_id" in data

    session = db.query(AdventureSession).filter(
        AdventureSession.id == data["session_id"]
    ).first()

    assert session is not None
    assert session.title == "MyAdventure"
    assert session.user_id == 1


def test_get_adventure_sessions():
    db = TestingSessionLocal()

    create_session(db, user_id=1)
    create_session(db, user_id=1)

    response = client.get("/adventure/")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 3


def test_get_all_adventure_sessions_admin():
    db = TestingSessionLocal()

    create_session(db, user_id=1)
    create_session(db, user_id=2)

    response = client.get("/adventure/all")

    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 2


def test_delete_adventure_session():
    db = TestingSessionLocal()

    session = create_session(db, user_id=1)

    response = client.delete(f"/adventure/{session.id}")

    assert response.status_code == 200
    assert response.json()["detail"] == "Adventure session deleted"

    deleted = db.query(AdventureSession).filter(
        AdventureSession.id == session.id
    ).first()

    assert deleted is None


def test_delete_adventure_session_not_found():
    response = client.delete("/adventure/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Adventure session not found"


def test_update_adventure_title():
    db = TestingSessionLocal()

    session = create_session(db, user_id=1, title="OldTitle")

    response = client.put(
        f"/adventure/{session.id}/title?new_title=NewTitle"
    )

    assert response.status_code == 200
    data = response.json()

    assert data["detail"] == "Adventure title updated"
    assert data["new_title"] == "NewTitle"


def test_update_adventure_title_not_found():
    response = client.put("/adventure/999/title?new_title=NewTitle")

    assert response.status_code == 404
    assert response.json()["detail"] == "Adventure session not found"