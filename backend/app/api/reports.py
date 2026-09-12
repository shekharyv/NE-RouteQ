from fastapi import APIRouter, Depends, HTTPException
from ..core.dependencies import get_current_user
from ..core.database import get_db, row_to_dict
from ..services.report_service import build_report
router=APIRouter(prefix='/api/reports',tags=['reports'])
@router.get('')
def reports(user=Depends(get_current_user)):
    with get_db() as db:return [row_to_dict(r) for r in db.execute("SELECT mission_id,type,source,destination,status,eta,distance,accessibility_score,risk_level FROM missions WHERE status='completed' OR status='in_transit'").fetchall()]
@router.get('/{mission_id}')
def report(mission_id,user=Depends(get_current_user)):
    result=build_report(mission_id)
    if not result:raise HTTPException(404,'Mission report not found')
    return result
