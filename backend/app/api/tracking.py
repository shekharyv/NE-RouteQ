from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ..core.database import get_db, now_iso, row_to_dict
from ..core.dependencies import get_current_user
router=APIRouter(prefix='/api/tracking',tags=['tracking'])
class Location(BaseModel): latitude:float=Field(ge=-90,le=90); longitude:float=Field(ge=-180,le=180); speed:float=Field(default=0,ge=0); heading:float=Field(default=0,ge=0,le=360)
@router.post('/{mission_id}/location')
def location(mission_id,payload:Location,user=Depends(get_current_user)):
    with get_db() as db:
        mission=db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone()
        if not mission: raise HTTPException(404,'Mission not found')
        if user['role']=='driver' and mission['driver_id']!=user['id']: raise HTTPException(403,'Mission is not assigned to this driver')
        db.execute('INSERT INTO tracking (mission_id,latitude,longitude,speed,heading,eta,distance_remaining,created_at) VALUES (?,?,?,?,?,?,?,?)',(mission_id,payload.latitude,payload.longitude,payload.speed,payload.heading,mission['eta'],mission['distance'],now_iso()))
        db.execute("INSERT INTO events (mission_id,event_type,payload,created_at) VALUES (?, 'location_update', ?, ?)",(mission_id,payload.model_dump_json(),now_iso()))
    return {'success':True,'mission_id':mission_id,'location':payload.model_dump()}
@router.get('/{mission_id}')
def current(mission_id,user=Depends(get_current_user)):
    with get_db() as db:
        row=db.execute('SELECT * FROM tracking WHERE mission_id=? ORDER BY id DESC LIMIT 1',(mission_id,)).fetchone()
        mission=db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone()
    if not mission: raise HTTPException(404,'Mission not found')
    return {'mission_id':mission_id,'current_location':row_to_dict(row),'eta':mission['eta'],'distance_remaining':mission['distance'],'route_status':mission['status'],'risk':mission['risk_level'],'accessibility':mission['accessibility_score']}
