import json, uuid
from fastapi import APIRouter, Depends, HTTPException
from ..core.database import get_db, now_iso, row_to_dict
from ..core.dependencies import get_current_user
from ..services.route_service import generate_routes, get_routes, recommend_route
router=APIRouter(prefix='/api/rerouting',tags=['rerouting'])
@router.post('/{mission_id}/analyze')
def analyze(mission_id,user=Depends(get_current_user)):
    with get_db() as db:mission=row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())
    if not mission:raise HTTPException(404,'Mission not found')
    routes=get_routes(mission_id) or generate_routes(mission); old=mission['selected_route_id'] or 'ROUTE-B'; safer=next((r for r in routes if r['route_id']=='ROUTE-C'),routes[-1])
    with get_db() as db:
        db.execute("UPDATE missions SET status='rerouting',risk_score=82,accessibility_score=72,risk_level='HIGH',updated_at=? WHERE mission_id=?",(now_iso(),mission_id)); db.execute("INSERT INTO events (mission_id,event_type,payload,created_at) VALUES (?, 'disruption_detected', ?, ?)",(mission_id,json.dumps({'reason':'Landslide risk detected ahead'}),now_iso()))
        alert_id='ALT-'+uuid.uuid4().hex[:8]; db.execute('INSERT INTO alerts VALUES (?,?,?,?,?,?,?,?,?,?)',(alert_id,mission_id,'HIGH','LANDSLIDE','Landslide Risk Detected','Landslide risk detected ahead. Safer alternative route available.','NH corridor near Imphal',now_iso(),0,old))
    return {'reroute_required':True,'reason':'Landslide risk detected','previous_route':old,'recommended_route':safer['route_id'],'old_risk':82,'new_risk':31,'old_accessibility':72,'new_accessibility':84,'eta_change':'+25 minutes'}
@router.post('/{mission_id}/accept')
def accept(mission_id,user=Depends(get_current_user)):
    with get_db() as db:
        mission=db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone()
        if not mission:raise HTTPException(404,'Mission not found')
        db.execute("UPDATE missions SET selected_route_id='ROUTE-C',status='in_transit',risk_score=31,accessibility_score=84,risk_level='LOW',updated_at=? WHERE mission_id=?",(now_iso(),mission_id)); db.execute("INSERT INTO events (mission_id,event_type,payload,created_at) VALUES (?, 'reroute_accepted', ?, ?)",(mission_id,json.dumps({'route':'ROUTE-C'}),now_iso()))
        return row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(mission_id,)).fetchone())
@router.post('/{mission_id}/reject')
def reject(mission_id,user=Depends(get_current_user)):
    with get_db() as db:db.execute("UPDATE missions SET status='at_risk',updated_at=? WHERE mission_id=?",(now_iso(),mission_id))
    return {'success':True,'status':'at_risk'}
