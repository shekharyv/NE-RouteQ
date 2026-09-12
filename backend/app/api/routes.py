from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..core.dependencies import get_current_user
from ..core.database import get_db, row_to_dict
from ..services.route_service import generate_routes, get_routes, recommend_route

router=APIRouter(prefix='/api/routes',tags=['routes'])
class RouteRequest(BaseModel): mission_id:str
@router.post('/generate')
def generate(payload:RouteRequest,user=Depends(get_current_user)):
    with get_db() as db: mission=row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(payload.mission_id,)).fetchone())
    if not mission: raise HTTPException(404,'Mission not found')
    existing=get_routes(payload.mission_id)
    return existing or generate_routes(mission)
@router.post('/recommend')
def recommend(payload:RouteRequest,user=Depends(get_current_user)):
    with get_db() as db: mission=row_to_dict(db.execute('SELECT * FROM missions WHERE mission_id=?',(payload.mission_id,)).fetchone())
    routes=get_routes(payload.mission_id)
    if not mission: raise HTTPException(404,'Mission not found')
    if not routes: routes=generate_routes(mission)
    return recommend_route(mission,routes)
@router.get('/{mission_id}')
def list_routes(mission_id,user=Depends(get_current_user)): return get_routes(mission_id)
