from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from ..core.database import get_db, now_iso, row_to_dict
from ..core.dependencies import get_current_user, require_roles

router = APIRouter(prefix='/api/missions', tags=['missions'])
class MissionInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    mission_id: str | None = None
    type: str = Field(alias='category')
    source: str = Field(alias='origin')
    destination: str
    priority: str
    vehicle_id: str = ''
    driver_id: str = ''
    cargo: str
    cargo_weight: float = 0
    delivery_deadline: str | None = None
    temperature_sensitive: bool = False
    emergency: bool = False
class StatusInput(BaseModel): status: str

@router.post('')
def create_mission(payload: MissionInput, user=Depends(require_roles('government_admin','logistics_operator','ngo_operator','emergency_operator'))):
    now=now_iso(); mission_id=payload.mission_id or f'MSN-{datetime.now(timezone.utc).strftime("%m%d%H%M%S")}'
    values=(mission_id.upper(),payload.type,payload.source,payload.destination,payload.priority,payload.vehicle_id,payload.driver_id,payload.cargo,payload.cargo_weight,payload.delivery_deadline,int(payload.temperature_sensitive),int(payload.emergency),'planning','',24,86,'LOW','8h 40m','312 km',user['id'],now,now)
    with get_db() as db:
        try: db.execute('INSERT INTO missions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', values)
        except Exception as error: raise HTTPException(409, 'Mission ID already exists') from error
        db.execute("INSERT INTO events (mission_id,event_type,payload,created_at) VALUES (?, 'mission_created', ?, ?)", (mission_id, '{}', now))
        return row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())

@router.get('')
def list_missions(user=Depends(get_current_user)):
    with get_db() as db:
        query='SELECT * FROM missions'; args=()
        if user['role']=='driver': query+=' WHERE driver_id=?'; args=(user['id'],)
        return [row_to_dict(row) for row in db.execute(query+' ORDER BY created_at DESC',args).fetchall()]

@router.get('/{mission_id}')
def get_mission(mission_id: str, user=Depends(get_current_user)):
    with get_db() as db: mission=row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())
    if not mission: raise HTTPException(404,'Mission not found')
    if user['role']=='driver' and mission['driver_id'] != user['id']: raise HTTPException(403,'Mission is not assigned to this driver')
    return mission

@router.put('/{mission_id}')
def update_mission(mission_id: str, payload: StatusInput, user=Depends(require_roles('government_admin','logistics_operator','ngo_operator','emergency_operator'))):
    allowed={'draft','planning','route_selected','assigned','in_transit','delayed','at_risk','rerouting','completed','cancelled'}
    if payload.status not in allowed: raise HTTPException(400,'Invalid mission status')
    with get_db() as db:
        result=db.execute('UPDATE missions SET status=?,updated_at=? WHERE mission_id=?',(payload.status,now_iso(),mission_id))
        if not result.rowcount: raise HTTPException(404,'Mission not found')
        return row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())

@router.delete('/{mission_id}')
def delete_mission(mission_id: str, user=Depends(require_roles('government_admin'))):
    with get_db() as db:
        result=db.execute('DELETE FROM missions WHERE mission_id=?',(mission_id,))
    if not result.rowcount: raise HTTPException(404,'Mission not found')
    return {'success':True}

@router.post('/{mission_id}/assign-driver')
def assign_driver(mission_id: str, driver_id: str, user=Depends(require_roles('government_admin','logistics_operator','emergency_operator'))):
    with get_db() as db:
        driver=db.execute("SELECT id FROM users WHERE id=? AND role='driver'",(driver_id,)).fetchone()
        if not driver: raise HTTPException(404,'Driver not found')
        result=db.execute("UPDATE missions SET driver_id=?,status='assigned',updated_at=? WHERE mission_id=?",(driver_id,now_iso(),mission_id))
        if not result.rowcount: raise HTTPException(404,'Mission not found')
        return row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())

@router.post('/{mission_id}/start')
def start(mission_id: str, user=Depends(get_current_user)):
    return _set_driver_status(mission_id,'in_transit',user)
@router.post('/{mission_id}/pause')
def pause(mission_id: str, user=Depends(get_current_user)):
    return _set_driver_status(mission_id,'at_risk',user)
@router.post('/{mission_id}/complete')
def complete(mission_id: str, user=Depends(get_current_user)):
    return _set_driver_status(mission_id,'completed',user)
def _set_driver_status(mission_id,status,user):
    with get_db() as db:
        mission=db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone()
        if not mission: raise HTTPException(404,'Mission not found')
        if user['role']=='driver' and mission['driver_id']!=user['id']: raise HTTPException(403,'Mission is not assigned to this driver')
        db.execute('UPDATE missions SET status=?,updated_at=? WHERE mission_id=?',(status,now_iso(),mission_id)); db.execute('INSERT INTO events (mission_id,event_type,payload,created_at) VALUES (?,?,?,?)',(mission_id, 'journey_started' if status=='in_transit' else 'delivery_completed' if status=='completed' else 'mission_paused','{}',now_iso()))
        return row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())
