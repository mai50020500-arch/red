import pytest
import json
from app.core.red_cipher import RedCipher
from app.core.database import SovereignDB

@pytest.mark.unit
def test_red_cipher_encryption_decryption():
    """Verify that RedCipher can encrypt and decrypt data correctly."""
    key = b"test_secret_key"
    cipher = RedCipher(key)
    original_text = "Highly Sensitive Intel"
    
    # Encrypt
    encrypted = cipher.encrypt(original_text)
    assert encrypted != original_text
    assert isinstance(encrypted, str)
    
    # Decrypt
    decrypted = cipher.decrypt(encrypted)
    assert decrypted == original_text

@pytest.mark.unit
def test_red_cipher_key_derivation():
    """Verify key derivation produces unique keys."""
    cipher = RedCipher(b"base_key")
    key1 = cipher.derive_key("salt1")
    key2 = cipher.derive_key("salt2")
    assert key1 != key2
    assert len(key1) == 32 # SHA-256

@pytest.mark.unit
def test_sovereign_db_json_persistence(mock_db):
    """Verify that SovereignDB saves and loads from JSON correctly."""
    agent_id = "test_agent_123"
    agent_data = {"id": agent_id, "status": "ACTIVE", "os": "Linux"}
    
    # Upsert
    mock_db.upsert_agent(agent_id, agent_data)
    
    # Check in-memory
    assert agent_id in mock_db.get_agents()
    
    # Check JSON file
    with open(mock_db.storage_path, "r") as f:
        saved_db = json.load(f)
        assert agent_id in saved_db["agents"]
        assert saved_db["agents"][agent_id]["os"] == "Linux"

@pytest.mark.unit
def test_sovereign_db_network_relations(mock_db):
    """Verify network relation tracking in SovereignDB."""
    agent_id = "agent_alpha"
    neighbors = [{"ip": "192.168.1.5", "mac": "AA:BB:CC:DD:EE:FF"}]
    
    mock_db.add_network_relation(agent_id, neighbors)
    
    graph = mock_db.get_graph()
    # Find the neighbor node
    node_ids = [n["id"] for n in graph["nodes"]]
    assert "neighbor_192.168.1.5" in node_ids
    
    # Find the link
    link_sources = [l["source"] for l in graph["links"]]
    assert f"agent_{agent_id}" in link_sources
