import json
from ..core.database import get_db, row_to_dict


def build_report(mission_id):
    with get_db() as db:
        mission = row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id = ?', (mission_id,)).fetchone())
        if not mission: return None
        events = [row_to_dict(row) for row in db.execute('SELECT * FROM events WHERE mission_id = ? ORDER BY created_at', (mission_id,)).fetchall()]
        for event in events:
            if isinstance(event.get('payload'), str):
                try: event['payload'] = json.loads(event['payload'])
                except json.JSONDecodeError: pass
        return {'mission': mission, 'timeline': events, 'disruptions': [row_to_dict(row) for row in db.execute('SELECT * FROM disruptions WHERE id IN (SELECT id FROM disruptions)').fetchall()]}
