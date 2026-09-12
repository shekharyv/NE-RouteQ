from fastapi import APIRouter, Depends
from ..core.dependencies import require_roles
from ..core.database import get_db, row_to_dict
router=APIRouter(prefix='/api/drivers',tags=['drivers'])
@router.get('/me')
def me(user=Depends(require_roles('driver'))): return user
@router.get('/me/missions')
def missions(user=Depends(require_roles('driver'))):
    with get_db() as db:return [row_to_dict(r) for r in db.execute('SELECT * FROM missions WHERE driver_id=?',(user['id'],)).fetchall()]
@router.get('/me/alerts')
def alerts(user=Depends(require_roles('driver'))):
    with get_db() as db:return [row_to_dict(r) for r in db.execute('SELECT * FROM alerts WHERE acknowledged=0').fetchall()]
