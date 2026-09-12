from datetime import datetime, timezone
import json
from ..ai.accessibility_engine import calculate_accessibility
from ..ai.recommendation_engine import recommend
from ..core.database import get_db, now_iso, row_to_dict
from .maps_service import route_geometry


def generate_routes(mission):
    base = [
        ('ROUTE-A', 'Fastest Route', '7h 50m', 'Low Cost', 72, 62, 78, 64, 74, 24),
        ('ROUTE-B', 'AI Recommended', '8h 40m', 'Medium Cost', 24, 86, 91, 28, 18, 8),
        ('ROUTE-C', 'Safest Alternative', '9h 00m', 'Higher Cost', 18, 89, 94, 22, 20, 6),
    ]
    geometry = route_geometry(mission['source'], mission['destination'])
    created = now_iso()
    routes = []
    with get_db() as db:
        for route_id, label, duration, cost, risk, access, reliability, weather, terrain, disruption in base:
            item = {'route_id': route_id, 'mission_id': mission['mission_id'], 'label': label, 'distance': '312 km', 'duration': duration, 'cost': cost, 'risk_score': risk, 'accessibility_score': access, 'road_reliability': reliability, 'weather_exposure': weather, 'terrain_difficulty': terrain, 'disruption_risk': disruption, 'alternate_route_available': 1, 'geometry': json.dumps(geometry), 'status': 'AVAILABLE', 'created_at': created}
            db.execute('INSERT OR REPLACE INTO routes ({}) VALUES ({})'.format(','.join(item), ','.join('?' for _ in item)), tuple(item.values()))
            routes.append(item)
        db.execute("INSERT INTO events (mission_id, event_type, payload, created_at) VALUES (?, 'route_generated', ?, ?)", (mission['mission_id'], json.dumps({'count': len(routes)}), created))
    return routes


def recommend_route(mission, routes):
    result = recommend(routes, mission['priority'])
    with get_db() as db:
        db.execute('UPDATE missions SET selected_route_id = ?, risk_score = ?, accessibility_score = ?, risk_level = ?, updated_at = ? WHERE mission_id = ?', (result['recommended_route_id'], 24, 86, 'LOW', now_iso(), mission['mission_id']))
        db.execute("INSERT INTO events (mission_id, event_type, payload, created_at) VALUES (?, 'route_selected', ?, ?)", (mission['mission_id'], json.dumps(result), now_iso()))
    return result


def get_routes(mission_id):
    with get_db() as db:
        return [row_to_dict(row) for row in db.execute('SELECT * FROM routes WHERE mission_id = ? ORDER BY route_id', (mission_id,)).fetchall()]
