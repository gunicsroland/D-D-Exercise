import pytest
from tests.conftest import client


# ---- Helpers ----
def create_exercise():
    response = client.post(
        "/exercises/",
        json={
            "name": "Push-up",
            "category": "strength",
            "difficulty": "easy",
            "xp_reward": 50,
            "media_url": "http://example.com",
        },
    )
    assert response.status_code == 200
    return response.json()["exercise"]


# ---- Tests ----

def test_add_exercise():
    response = client.post(
        "/exercises/",
        json={
            "name": "Squat",
            "category": "strength",
            "difficulty": "medium",
            "xp_reward": 70,
            "media_url": "http://example.com",
        },
    )

    assert response.status_code == 200
    data = response.json()

    assert data["message"] == "Exercise added successfully"
    assert data["exercise"]["name"] == "Squat"


def test_get_exercises():
    create_exercise()
    create_exercise()

    response = client.get("/exercises/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_exercise_by_id():
    exercise = create_exercise()

    response = client.get(f"/exercises/id/{exercise['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == exercise["id"]


def test_get_exercise_not_found():
    response = client.get("/exercises/id/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Exercise not found"


def test_get_by_category():
    create_exercise()

    response = client.get("/exercises/category/strength")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_by_difficulty():
    create_exercise()

    response = client.get("/exercises/difficulty/easy")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_by_category_and_difficulty():
    create_exercise()

    response = client.get("/exercises/strength/easy")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_exercise():
    exercise = create_exercise()

    response = client.put(
        f"/exercises/{exercise['id']}",
        json={"xp_reward": 100},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["message"] == "Exercise updated successfully"
    assert data["exercise"]["xp_reward"] == 100


def test_update_exercise_not_found():
    response = client.put("/exercises/9999", json={"xp_reward": 100})

    assert response.status_code == 404
    assert response.json()["detail"] == "Exercise not found"


def test_delete_exercise():
    exercise = create_exercise()

    response = client.delete(f"/exercises/{exercise['id']}")

    assert response.status_code == 200
    assert response.json()["message"] == "Exercise deleted successfully"

    # verify deletion
    get_response = client.get(f"/exercises/id/{exercise['id']}")
    assert get_response.status_code == 404


def test_delete_exercise_not_found():
    response = client.delete("/exercises/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Exercise not found"


# ---- finish_exercise ----
def test_finish_exercise(mocker):
    exercise = create_exercise()

    mock_xp = mocker.patch("src.services.character.add_xp")
    mock_get_quests = mocker.patch(
        "src.services.quests.get_daily_quests",
        return_value=[],
    )
    mock_update_quest = mocker.patch(
        "src.services.quests.update_quest_progress"
    )
    mock_log = mocker.patch(
        "src.services.log.log_exercise_completion"
    )

    response = client.post(f"/exercises/finish/{exercise['id']}")

    assert response.status_code == 200
    assert response.json()["message"] == "Exercise completed successfully, rewards processed"

    mock_xp.assert_called_once()
    mock_get_quests.assert_called_once()
    mock_log.assert_called_once()
    mock_update_quest.assert_not_called()


def test_finish_exercise_not_found():
    response = client.post("/exercises/finish/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Exercise not found"


# ---- seed ----
def test_seed_exercises(mocker):
    mock_seed = mocker.patch(
        "src.services.seeded_generation.seed_exercises",
        return_value={"status": "ok"},
    )

    response = client.post("/exercises/seed")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

    mock_seed.assert_called_once()