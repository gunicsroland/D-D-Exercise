from datetime import datetime

from src.models import AdventureSession, AdventureMessage, ChatRole
from tests.conftest import client, TestingSessionLocal

def create_session(db, user_id=1, character_id=1):
    session = AdventureSession(
        user_id=user_id,
        character_id=character_id,
        title="Test Adventure"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def create_message(db, session_id, content="Hello"):
    msg = AdventureMessage(
        session_id=session_id,
        role=ChatRole.User,
        content=content,
        created_at=datetime.utcnow(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def test_get_messages_success():
    db = TestingSessionLocal()

    session = create_session(db)
    create_message(db, session.id, "First")
    create_message(db, session.id, "Second")

    response = client.get(f"/messages/{session.id}")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["content"] == "First"
    assert data[1]["content"] == "Second"


def test_get_messages_session_not_found():
    response = client.get("/messages/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Adventure session not found"