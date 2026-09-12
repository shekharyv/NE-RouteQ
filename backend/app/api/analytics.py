from fastapi import APIRouter, Depends
from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
router=APIRouter(prefix='/api/analytics',tags=['analytics'])
@router.get('/summary')
def summary(user=Depends(require_roles('government_admin','logistics_operator','ngo_operator','emergency_operator'))):
    with get_db() as db:
        total=db.execute('SELECT COUNT(*) c FROM missions').fetchone()['c']; active=db.execute("SELECT COUNT(*) c FROM missions WHERE status NOT IN ('completed','cancelled')").fetchone()['c']; completed=db.execute("SELECT COUNT(*) c FROM missions WHERE status='completed'").fetchone()['c']; delayed=db.execute("SELECT COUNT(*) c FROM missions WHERE status IN ('delayed','at_risk')").fetchone()['c']; avg=db.execute('SELECT COALESCE(AVG(accessibility_score),0) v FROM missions').fetchone()['v']; alerts=db.execute('SELECT COUNT(*) c FROM disruptions WHERE active=1').fetchone()['c']
    return {'total_missions':total,'active_missions':active,'successful_missions':completed,'delayed_missions':delayed,'reroutes':0,'disruptions':alerts,'average_accessibility':round(avg),'on_time_delivery':94}
@router.get('/accessibility')
def accessibility(user=Depends(get_current_user)): return {'score':84,'trend':6,'regions':[{'region':'Assam Valley','score':92},{'region':'Shillong Plateau','score':86},{'region':'Barail Corridor','score':72},{'region':'Nagaland / Manipur Hills','score':64}]}
@router.get('/routes')
def route_stats(user=Depends(get_current_user)):
    with get_db() as db:return [dict(r) for r in db.execute('SELECT route_id,AVG(risk_score) risk_score,AVG(accessibility_score) accessibility_score,COUNT(*) uses FROM routes GROUP BY route_id').fetchall()]
@router.get('/risk')
def risk(user=Depends(get_current_user)):
    with get_db() as db:return [dict(r) for r in db.execute('SELECT risk_level,COUNT(*) count FROM missions GROUP BY risk_level').fetchall()]
