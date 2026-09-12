from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def operator_headers():
    response = client.post('/api/auth/login', json={'identifier': 'operator@nerouteiq.in', 'password': 'Operator123!'})
    assert response.status_code == 200
    return {'Authorization': f"Bearer {response.json()['access_token']}"}


def test_health_and_docs():
    assert client.get('/api/health').json()['status'] == 'ok'
    assert client.get('/openapi.json').status_code == 200


def test_protected_missions_and_routes():
    headers = operator_headers()
    assert client.get('/api/missions', headers=headers).status_code == 200
    generated = client.post('/api/routes/generate', headers=headers, json={'mission_id': 'MED-1024'})
    assert generated.status_code == 200
    assert {route['route_id'] for route in generated.json()} == {'ROUTE-A', 'ROUTE-B', 'ROUTE-C'}
    recommendation = client.post('/api/routes/recommend', headers=headers, json={'mission_id': 'MED-1024'})
    assert recommendation.json()['recommended_route_id'] == 'ROUTE-B'


def test_tracking_and_driver_authorization():
    headers = operator_headers()
    tracking = client.post('/api/tracking/MED-1024/location', headers=headers, json={'latitude': 24.8167, 'longitude': 93.9368, 'speed': 42, 'heading': 120})
    assert tracking.status_code == 200
    assert client.post('/api/routes/recommend', json={'mission_id': 'MED-1024'}).status_code == 401


def test_disruption_reroute_and_report():
    headers = operator_headers()
    reroute = client.post('/api/simulation/landslide', headers=headers, json={'mission_id': 'MED-1024'})
    assert reroute.status_code == 200
    assert reroute.json()['recommended_route'] == 'ROUTE-C'
    accepted = client.post('/api/rerouting/MED-1024/accept', headers=headers)
    assert accepted.json()['selected_route_id'] == 'ROUTE-C'
    report = client.get('/api/reports/MED-1024', headers=headers)
    assert report.status_code == 200
    assert report.json()['timeline']
