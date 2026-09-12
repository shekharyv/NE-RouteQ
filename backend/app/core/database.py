import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from .config import DB_PATH


def now_iso():
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def get_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA foreign_keys = ON')
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def row_to_dict(row):
    if row is None:
        return None
    result = dict(row)
    for key in ('risk_factors', 'breakdown', 'geometry', 'affected_routes'):
        if key in result and isinstance(result[key], str):
            try:
                result[key] = json.loads(result[key])
            except json.JSONDecodeError:
                pass
    return result


def init_db():
    with get_db() as db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, mobile TEXT, organization TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL, is_active INTEGER DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS vehicles (vehicle_id TEXT PRIMARY KEY, registration_number TEXT UNIQUE NOT NULL, type TEXT NOT NULL, capacity REAL DEFAULT 0, status TEXT DEFAULT 'AVAILABLE', driver_id TEXT, current_lat REAL, current_lng REAL);
        CREATE TABLE IF NOT EXISTS missions (mission_id TEXT PRIMARY KEY, type TEXT NOT NULL, source TEXT NOT NULL, destination TEXT NOT NULL, priority TEXT NOT NULL, vehicle_id TEXT, driver_id TEXT, cargo TEXT NOT NULL, cargo_weight REAL DEFAULT 0, delivery_deadline TEXT, temperature_sensitive INTEGER DEFAULT 0, emergency INTEGER DEFAULT 0, status TEXT NOT NULL, selected_route_id TEXT, risk_score INTEGER DEFAULT 20, accessibility_score INTEGER DEFAULT 86, risk_level TEXT DEFAULT 'LOW', eta TEXT, distance TEXT, created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS routes (route_id TEXT PRIMARY KEY, mission_id TEXT NOT NULL, label TEXT NOT NULL, distance TEXT, duration TEXT, cost TEXT, risk_score INTEGER, accessibility_score INTEGER, road_reliability INTEGER, weather_exposure INTEGER, terrain_difficulty INTEGER, disruption_risk INTEGER, alternate_route_available INTEGER DEFAULT 1, geometry TEXT, status TEXT DEFAULT 'AVAILABLE', created_at TEXT NOT NULL, FOREIGN KEY(mission_id) REFERENCES missions(mission_id) ON DELETE CASCADE);
        CREATE TABLE IF NOT EXISTS tracking (id INTEGER PRIMARY KEY AUTOINCREMENT, mission_id TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, speed REAL DEFAULT 0, heading REAL DEFAULT 0, eta TEXT, distance_remaining TEXT, created_at TEXT NOT NULL, FOREIGN KEY(mission_id) REFERENCES missions(mission_id) ON DELETE CASCADE);
        CREATE TABLE IF NOT EXISTS alerts (id TEXT PRIMARY KEY, mission_id TEXT, severity TEXT NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, location TEXT, created_at TEXT NOT NULL, acknowledged INTEGER DEFAULT 0, affected_route TEXT);
        CREATE TABLE IF NOT EXISTS disruptions (id TEXT PRIMARY KEY, type TEXT NOT NULL, severity TEXT NOT NULL, location TEXT NOT NULL, description TEXT NOT NULL, affected_routes TEXT, created_at TEXT NOT NULL, active INTEGER DEFAULT 1);
        CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, mission_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT, created_at TEXT NOT NULL, FOREIGN KEY(mission_id) REFERENCES missions(mission_id) ON DELETE CASCADE);
        ''')
