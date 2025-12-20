from __future__ import annotations

from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import Session, sessionmaker

from backend.auth import get_current_user
from backend.dependencies import get_db
from backend.main import create_app
from backend.models import Base, Campaign, TeamMember, User


@pytest.fixture()
def engine():
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def db_session(engine) -> Generator[Session, None, None]:
    TestingSessionLocal = sessionmaker(
        bind=engine, autocommit=False, autoflush=False, expire_on_commit=False
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session: Session):
    app = create_app()

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    def override_get_current_user():
        user = db_session.query(User).first()
        if not user:
            raise AssertionError("Test setup missing current user")
        return user

    app.dependency_overrides[get_current_user] = override_get_current_user
    return TestClient(app)


def seed_user_and_membership(db_session: Session, account_id: str = "account-123") -> User:
    user = User(id="user-1", email="owner@example.com")
    db_session.add(user)
    db_session.flush()
    db_session.add(TeamMember(account_id=account_id, user_id=user.id))
    db_session.commit()
    return user


def test_list_campaigns_returns_only_member_account_campaigns(client: TestClient, db_session: Session):
    seed_user_and_membership(db_session, account_id="account-abc")
    db_session.add_all(
        [
            Campaign(name="Welcome Series", account_id="account-abc"),
            Campaign(name="Flash Sale", account_id="account-xyz"),
        ]
    )
    db_session.commit()

    response = client.get("/v1.0/campaigns")

    assert response.status_code == 200
    payload = response.json()
    assert payload["campaigns"][0]["account_id"] == "account-abc"
    assert len(payload["campaigns"]) == 1


def test_create_campaign_uses_derived_account_id(client: TestClient, db_session: Session):
    seed_user_and_membership(db_session, account_id="account-derived")

    response = client.post(
        "/v1.0/campaigns",
        json={"name": "Holiday Launch", "objective": "launch", "status": "scheduled"},
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["account_id"] == "account-derived"
    assert payload["name"] == "Holiday Launch"

    campaign = db_session.query(Campaign).one()
    assert campaign.account_id == "account-derived"


def test_membership_missing_returns_403(client: TestClient, db_session: Session):
    user = User(id="user-2", email="nomember@example.com")
    db_session.add(user)
    db_session.commit()

    def override_get_current_user():
        return user

    client.app.dependency_overrides[get_current_user] = override_get_current_user

    response = client.get("/v1.0/campaigns")

    assert response.status_code == 403
    assert "User is not a member" in response.json()["detail"]
