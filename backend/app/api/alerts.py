from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..core.database import get_db, now_iso, row_to_dict
from ..core.dependencies import get_current_user, require_roles
import uuid
router=APIRouter(prefix='/api/alerts',tags=['alerts'])
class AlertInput(BaseModel): mission_id:str|None=None; severity:str; type:str; title:str; description:str; location:str=''; affected_route:str=''
@router.get('')
def list_alerts(user=Depends(get_current_user)):
    with get_db() as db:return [row_to_dict(r) for r in db.execute('SELECT * FROM alerts ORDER BY created_at DESC').fetchall()]
@router.get('/{alert_id}')
def get_alert(alert_id,user=Depends(get_current_user)):
    with get_db() as db:r=db.execute('SELECT * FROM alerts WHERE id=?',(alert_id,)).fetchone()
    if not r:raise HTTPException(404,'Alert not found')
    return row_to_dict(r)
@router.post('')
def create(payload:AlertInput,user=Depends(require_roles('government_admin','logistics_operator','emergency_operator'))):
    alert_id='ALT-'+uuid.uuid4().hex[:8]; now=now_iso()
    with get_db() as db:db.execute('INSERT INTO alerts VALUES (?,?,?,?,?,?,?,?,?,?)',(alert_id,payload.mission_id,payload.severity,payload.type,payload.title,payload.description,payload.location,now,0,payload.affected_route))
    return {'id':alert_id,**payload.model_dump(),'created_at':now,'acknowledged':0}
@router.post('/{alert_id}/acknowledge')
def acknowledge(alert_id,user=Depends(get_current_user)):
    with get_db() as db:r=db.execute('UPDATE alerts SET acknowledged=1 WHERE id=?',(alert_id,))
    if not r.rowcount:raise HTTPException(404,'Alert not found')
    return {'success':True}
