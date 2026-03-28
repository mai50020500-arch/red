import pytest
import os
import json
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SovereignDB
from app.core.llm_commander import LLMCommander

@pytest.fixture(scope="session")
def test_client():
    """Returns a FastAPI TestClient."""
    with TestClient(app) as client:
        yield client

@pytest.fixture(scope="function")
def mock_db(tmp_path):
    """Returns an isolated SovereignDB instance using a temporary file."""
    db_file = tmp_path / "test_graph.json"
    db = SovereignDB(storage_path=str(db_file))
    return db

@pytest.fixture(scope="function")
def mock_hive_mind():
    """Returns a mocked LLMCommander to avoid API calls."""
    commander = LLMCommander()
    commander.model = MagicMock()
    # Mocking basic responses
    commander.model.generate_content.return_value.text = json.dumps({
        "device_type": "Test Device",
        "threat_level": "Low",
        "attack_vector": "Test Vector"
    })
    return commander

@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch):
    """Automatically sets up required environment variables for tests."""
    monkeypatch.setenv("SECRET_PASSPHRASE", "test_secret_passphrase")
    monkeypatch.setenv("GEMINI_API_KEY", "test_api_key")
    monkeypatch.setenv("NEO4J_URI", "bolt://localhost:7687")
    monkeypatch.setenv("NEO4J_USER", "neo4j")
    monkeypatch.setenv("NEO4J_PASSWORD", "test_password")
