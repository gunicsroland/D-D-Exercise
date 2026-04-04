from tests.conftest import client
import pytest

def test_register_user():

    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@test.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "User created successfully"

def test_register_existing_user():

    user = {
        "username": "existinguser",
        "email": "existing@test.com",
        "password": "password123",
    }

    client.post("/auth/register", json=user)

    response = client.post("/auth/register", json=user)

    assert response.status_code == 400
    assert response.json()["detail"] == "This Username is used"


def test_login_success():

    client.post(
        "/auth/register",
        json={
            "username": "loginuser",
            "email": "login@test.com",
            "password": "password123",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "username": "loginuser",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password():

    client.post(
        "/auth/register",
        json={
            "username": "wrongpass",
            "email": "wrong@test.com",
            "password": "goodpass",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "username": "wrongpass",
            "password": "badpass",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Wrong username or wrong password"


def test_form_login():

    client.post(
        "/auth/register",
        json={
            "username": "formuser",
            "email": "form@test.com",
            "password": "password123",
        },
    )

    response = client.post(
        "/auth/form_login",
        data={
            "username": "formuser",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
