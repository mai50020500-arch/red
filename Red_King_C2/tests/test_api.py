import pytest
import json
from app.core.red_cipher import RedCipher
from datetime import datetime

@pytest.mark.integration
def test_api_status(test_client):
    """Verify the /api/status endpoint."""
    response = test_client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["system"] == "ONLINE"
    assert "hive_mind" in data

@pytest.mark.integration
def test_api_hive_checkin_flow(test_client):
    """Verify the full check-in flow with the server's actual cipher."""
    from app.main import cipher_engine
    
    # 2. Prepare Payload
    agent_id = "test_agent_full_flow"
    payload_data = {
        "agent_id": agent_id,
        "info": {"os": "TestOS", "user": "testuser"}
    }
    encrypted_data = cipher_engine.encrypt(json.dumps(payload_data))
    
    # 3. Request
    response = test_client.post("/api/hive/checkin", json={
        "agent_id": agent_id,
        "data": encrypted_data
    })
    assert response.status_code == 200
    
    # 4. Decrypt Response
    resp_json = response.json()
    assert "data" in resp_json
    decrypted_resp = json.loads(cipher_engine.decrypt(resp_json["data"]))
    assert "jitter" in decrypted_resp
    assert "commands" in decrypted_resp

@pytest.mark.integration
async def test_api_consult_mocked(test_client, monkeypatch):
    """Verify the /api/consult endpoint with a mocked hive mind."""
    async def mock_advice(query: str):
        return "Mocked Advice"
    
    monkeypatch.setattr("app.main.hive_mind.get_strategic_advice", mock_advice)
    
    response = test_client.post("/api/consult", json={"query": "How to hack?"})
    assert response.status_code == 200
    assert response.json()["response"] == "Mocked Advice"
