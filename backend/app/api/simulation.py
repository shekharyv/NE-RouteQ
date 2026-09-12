from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..core.dependencies import get_current_user
from .rerouting import analyze
router=APIRouter(prefix='/api/simulation',tags=['simulation'])
class SimulationInput(BaseModel): mission_id:str
@router.post('/landslide')
def landslide(payload:SimulationInput,user=Depends(get_current_user)): return analyze(payload.mission_id,user)
@router.post('/heavy-rain')
def heavy_rain(payload:SimulationInput,user=Depends(get_current_user)): return analyze(payload.mission_id,user)
